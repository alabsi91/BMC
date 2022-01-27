import { useCallback, useContext, useLayoutEffect, useRef } from 'react';
import { requestNum } from 'request-animation-number';
import { Ctx, minMax } from './App';

export default function UnlockCard(props) {
  const ctx = useContext(Ctx);

  const isFirstRender = useRef(true);

  const system = ctx.data.mesurementSystem;
  const { units } = minMax[system];

  const cardUnlockContent = useRef(null);

  const unlockAnimation = useCallback(skipAnimation => {
    const locked = cardUnlockContent.current;
    const card = locked.parentElement;
    const cardHeight = card.querySelector('.card-contents').clientHeight;

    if (locked.getCss('display') === 'none' && !skipAnimation) return; // exit if card is already unlocked

    const lockedHeight = locked.clientHeight;

    requestNum(
      { from: [lockedHeight, 100], to: [cardHeight, 0], duration: skipAnimation ? 0 : 400, easingFunction: 'easeInSine' },
      (h, p) => {
        locked.css({ clipPath: `circle(${p}%)` });
        card.css({ height: h + 'px' });
        if (p === 0) {
          card.removeCss('height');
          locked.css({ display: 'none' });
          locked.removeCss('clip-path');
        }
      }
    );
  }, []);

  const lockAnimation = useCallback(skipAnimation => {
    const locked = cardUnlockContent.current;
    const card = locked.parentElement;
    const cardHeight = card.querySelector('.card-contents').clientHeight;
    if (locked.getCss('display') === 'block' && !skipAnimation) return; // exit if card is already locked

    locked.css({ display: 'block', clipPath: 'circle(0%)' });
    const children = locked.children;

    const childrenHeights = [];
    for (let i = 0; i < children.length; i++) {
      const height = children[i].clientHeight;
      const margin = children[i].getCss('margin-top', true);
      childrenHeights.push(height + margin);
    }
    const lockedHeight = childrenHeights.reduce((a, b) => a + b) + 41;

    requestNum(
      { from: [cardHeight, 0], to: [lockedHeight, 100], duration: skipAnimation ? 0 : 300, easingFunction: 'easeInSine' },
      (h, p) => {
        locked.css({ clipPath: `circle(${p}% at 50% 50%)` });
        card.css({ height: h + 'px' });
        if (p === 100) locked.removeCss('clip-path');
      }
    );
  }, []);

  const UnlockCard = useCallback(
    skipAnimation => {
      const container = cardUnlockContent.current;
      const card = container.parentElement;

      let isUnlocked = 0;
      props.dependencies.forEach(dependency => {
        if (dependency === 'gender' || dependency === 'activity') {
          isUnlocked += 1;
          return;
        }
        const [min, max] = [minMax[system][dependency][0], minMax[system][dependency][1]];
        const value = ctx.data[dependency];
        isUnlocked = value >= min && value <= max ? isUnlocked + 1 : isUnlocked;
      });

      // lock / unlock card
      isUnlocked !== props.dependencies.length ? lockAnimation(skipAnimation) : unlockAnimation(skipAnimation);

      // hide card info when card is unlocked
      const siblings = card.children;
      for (let i = 0; i < siblings.length; i++)
        if (siblings[i].className === 'card-info-content') siblings[i].css({ display: 'none' });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ctx.data, props.dependencies]
  );

  const loadCard = useCallback(async () => {
    await new Promise(resolve => setTimeout(resolve, 150));
    UnlockCard(true);
  }, [UnlockCard]);

  useLayoutEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      UnlockCard(true);
      loadCard();
      return;
    }
    UnlockCard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ctx.data]);

  const unit = name => {
    const length = ['height', 'neck', 'waist', 'hip'];
    if (length.includes(name)) {
      return ' in ' + units[1];
    } else if (name === 'weight') {
      return ' in ' + units[0];
    } else if (name === 'age') {
      return ' in Years';
    }
  };

  const expandInputs = () => {
    if (!ctx.inputsPanle.isOpen) ctx.setInputsPanle({ isOpen: true, useAnimation: true });
  };

  return (
    <>
      <div
        ref={cardUnlockContent}
        className='card-unlock-content'
        style={{ cursor: ctx.inputsPanle.isOpen ? 'unset' : 'pointer' }}
        onClick={expandInputs}
      >
        <h3 className='card-title card-unlock-title'>
          {props.title}
          <svg className='card-lock-icon' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
            <title>This card is locked to unlocked please enter the required information</title>
            <path d='M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z' />
          </svg>
        </h3>
        <h3 className='card-result-title'>Please enter the following to unlock this card:</h3>
        {props.dependencies.map(dependency => (
          <h3
            key={Math.random() * 100}
            className={`card-dependencies-text ${ctx.data[dependency] ? 'card-dependencies-text-lineThrough' : ''}`}
          >
            Your{' '}
            {dependency + (['neck', 'waist', 'hip'].includes(dependency) ? ' size' : dependency === 'activity' ? ' level' : '')}
            {unit(dependency)}.
          </h3>
        ))}
      </div>
    </>
  );
}
