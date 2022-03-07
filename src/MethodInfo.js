import { animare, ease } from 'animare';
import { useCallback, useRef } from 'react';

export default function MethodInfo(props) {
  const infoContainer = useRef();
  const cardHeight = useRef();

  const openInfo = useCallback(() => {
    const infoCard = infoContainer.current;
    const card = infoCard.parentElement;
    const icons = document.querySelectorAll('.card-info-button');
    icons.css({ pointerEvents: 'none' });

    const padding = 40;
    const iconSize = document.querySelector('.card-info-button').getCss('height', true);

    const x = card.clientWidth - (padding + iconSize) / 2;
    const y = (padding + iconSize) / 2;

    infoCard.css({ display: 'block', overflow: 'hidden' });

    const infoCardHeight = infoCard.children[1].clientHeight + infoCard.children[2].clientHeight + padding;
    cardHeight.current = card.clientHeight;

    animare(
      {
        from: [0, x, y, card.clientHeight],
        to: [infoCardHeight + padding, card.clientWidth / 2, (infoCardHeight + padding) / 2, infoCardHeight],
        duration: 400,
        ease: ease.out.circ,
      },
      ([c, x, y, h], { isLastFrame }) => {
        card.css({ height: h + 'px' });
        infoCard.css({ clipPath: `circle(${c}px at ${x}px ${y}px)` });
        if (isLastFrame) {
          infoCard.css({ overflow: 'overlay' });
          icons.removeCss('pointer-events');
        }
      }
    );
  }, []);

  const closeInfo = useCallback(() => {
    const infoCard = infoContainer.current;
    const card = infoCard.parentElement;
    const icons = document.querySelectorAll('.card-info-button');
    icons.css({ pointerEvents: 'none' });

    const padding = 40;
    const iconSize = document.querySelector('.card-info-button').getCss('height', true);

    const x = card.clientWidth - (padding + iconSize) / 2;
    const y = (padding + iconSize) / 2;

    const infoCardHeight = infoCard.children[1].clientHeight + infoCard.children[2].clientHeight + padding;

    infoCard.css({ overflow: 'hidden' });

    animare(
      {
        from: [infoCardHeight, card.clientWidth / 2, card.clientHeight / 2, infoCardHeight],
        to: [0, x, y, cardHeight.current],
        duration: 500,
        ease: ease.in.sine,
      },
      ([c, x, y, h], { isLastFrame }) => {
        infoCard.css({ clipPath: `circle(${c}px at ${x}px ${y}px)` });
        card.css({ height: h + 'px' });

        if (isLastFrame) {
          infoCard.css({ display: 'none' });
          card.removeCss('height');
          infoCard.removeCss('overflow');
          icons.removeCss('pointer-events');
        }
      }
    );
  }, []);

  return (
    <>
      <svg className='card-info-button' onClick={openInfo} xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
        <title>Learn more about this method</title>
        <path d='M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z' />
      </svg>
      <div ref={infoContainer} className='card-info-content'>
        <svg className='card-info-button' onClick={closeInfo} xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
          <title>Press to close card information</title>
          <path d='M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z' />
        </svg>
        <h3 className='card-title'>{props.title}</h3>
        <p className='card-info-text'>{props.text}</p>
      </div>
    </>
  );
}
