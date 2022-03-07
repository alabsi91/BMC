import { animare, ease } from 'animare';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { ACTIVITY, Ctx, minMax } from './App';
// import all css files
import themes from './themes/themeList.json';
themes.forEach(theme => require(`./themes/${theme}.css`));

export default function Inputs() {
  const ctx = useContext(Ctx);

  const [selectedTheme, setSelectedTheme] = useState(window.localStorage.getItem('theme') || 'fledgling');

  const popStateTrigger = useRef(true);

  const hamburgerAnimation = useCallback(() => {
    const hamburger = document.getElementById('ham-menu');
    const top = hamburger.childNodes[0];
    const middle = hamburger.childNodes[1];
    const bottom = hamburger.childNodes[2];

    const step_1 = ([x, y]) => (hamburger.style.transform = `scale(${x}, ${y})`);
    const step_2 = ([t, b, s]) => {
      top.setAttribute('y', t);
      top.style.transform = `scaleY(${s})`;
      bottom.setAttribute('y', b);
      bottom.style.transform = `scaleY(${s})`;
      middle.style.transform = `scaleY(${s})`;
    };
    const step_3 = r => (top.style.transform = `rotate(${r}deg) scaleY(0.7)`);
    const step_4 = r => (hamburger.style.transform = `rotate(${r}deg)`);

    if (ctx.inputsPanle.isOpen) {
      // skip animation.
      if (!ctx.inputsPanle.useAnimation) {
        step_2([10.5, 10.5, 0.7]);
        step_3([90]);
        step_4([45]);
        return;
      }
      // animate to X shape
      animare({ from: [1, 1], to: [0.9, 1.1], duration: 150, direction: 'alternate' }, step_1)
        .next({ from: [3, 18, 1], to: [10.5, 10.5, 0.7], duration: 100 }, step_2)
        .next({ from: 0, to: 90, duration: 100 }, step_3)
        .next({ from: 0, to: 45, duration: 300, ease: ease.out.back }, step_4);
    } else {
      // skip animation.
      if (!ctx.inputsPanle.useAnimation) {
        step_4([0]);
        step_2([3, 18, 1]);
        return;
      }
      // reverse animation
      animare({ from: 90, to: 0, duration: 150, ease: ease.in.back }, step_3)
        .next({ from: 45, to: 0, duration: 100, ease: ease.linear }, step_4)
        .next({ from: [10.5, 10.5, 0.7], to: [3, 18, 1], duration: 100, ease: ease.linear }, step_2)
        .next({ from: [1, 1], to: [0.9, 1.1], duration: 200, direction: 'alternate', ease: ease.linear }, step_1);
    }
  }, [ctx.inputsPanle.isOpen, ctx.inputsPanle.useAnimation]);

  const expandFromTop = useCallback(() => {
    const inputsWrapper = document.querySelector('.Inputs-header');
    const inputsContainer = document.getElementById('expandContainer');
    const padding = inputsContainer.getCss('padding-top', true);
    const arrowContainer = document.querySelector('.input-expand-container');
    const arrow = document.getElementById('expand-arrow');
    const gridContainer = document.querySelector('.Inputs-grid-container');
    const gridHeight = gridContainer.getBoundingClientRect().height + gridContainer.getCss('margin-top', true);
    const masks = document.querySelectorAll('.Inputs-mask');
    const duration = ctx.inputsPanle.useAnimation ? 500 : 0;
    // close
    if (!ctx.inputsPanle.isOpen) {
      masks.removeClass('Inputs-mask-animation'); // remove mask animation
      arrowContainer.css({ borderTopWidth: '1px' }); // hide border

      animare({ from: [gridHeight, 0, padding], to: [0, 180, 0], duration, ease: ease.out.cubic }, ([h, r, p]) => {
        inputsContainer.css({ height: `${h}px`, paddingTop: `${p}px` });
        arrow.css({ transform: `rotate(${r}deg)` });
      });
      // open
    } else {
      masks.addClass('Inputs-mask-animation');
      arrowContainer.css({ borderTopWidth: '0px' });
      inputsContainer.removeCss('padding-top');

      animare({ from: [0, 180], to: [gridHeight, 0], duration, ease: ease.out.bounce }, ([h, r], { isLastFrame }) => {
        inputsContainer.css({ height: `${h}px` });
        arrow.css({ transform: `rotate(${r}deg)` });
        if (isLastFrame) {
          inputsContainer.removeCss('height');
          inputsWrapper.removeCss('position');
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ctx.inputsPanle]);

  const expandFromSide = useCallback(() => {
    const inputsContainer = document.getElementById('expandContainer');
    const masks = document.querySelectorAll('.Inputs-mask');
    const duration = ctx.inputsPanle.useAnimation ? 400 : 0;

    hamburgerAnimation();
    // close
    if (!ctx.inputsPanle.isOpen) {
      popStateTrigger.current = false;
      if (window.location.pathname === '/inputs') window.history.back();

      masks.removeClass('Inputs-mask-animation'); // remove mask animation
      animare({ to: -100, duration, ease: ease.in.cubic }, (left, { isLastFrame }) => {
        inputsContainer.css({ left: `${left}vw` });
        if (isLastFrame) popStateTrigger.current = true;
      });
      // open
    } else {
      if (window.location.pathname === '/') window.history.pushState('', '', '/inputs');
      masks.addClass('Inputs-mask-animation');
      animare({ from: -100, to: 0, duration, ease: ease.out.cubic }, left => {
        inputsContainer.css({ left: `${left}vw` });
      });
    }
  }, [ctx.inputsPanle.isOpen, ctx.inputsPanle.useAnimation, hamburgerAnimation]);

  useEffect(() => {
    window.innerWidth <= 800 ? expandFromSide() : expandFromTop();
    document.body.style.overflow = window.innerWidth <= 800 && ctx.inputsPanle.isOpen ? 'hidden' : 'auto';
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ctx.inputsPanle]);

  useEffect(() => {
    window.addEventListener('popstate', e => {
      e.preventDefault();
      if (window.location.pathname === '/' && popStateTrigger.current) ctx.setInputsPanle({ isOpen: false, useAnimation: true });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const expandOnClick = () => {
    ctx.setInputsPanle({ isOpen: !ctx.inputsPanle.isOpen, useAnimation: true });
  };

  const toggleThemeDialog = async e => {
    const container = document.querySelector('.theme-dialog');
    const isOpen = container.getCss('display') !== 'none';
    if (isOpen) {
      container.css({ opacity: 0 });
      await new Promise(resolve => setTimeout(resolve, 300));
      container.css({ display: 'none' });
    } else {
      container.css({ display: 'flex' });
      await new Promise(resolve => setTimeout(resolve, 10));
      container.css({ opacity: 1 });
    }
  };

  const changeTheme = e => {
    const themeColor = document.getElementById('theme-color');
    const theme = e.target.dataset.theme;
    document.body.dataset.currentTheme = theme;
    setSelectedTheme(theme);
    // for manifest
    const colorMain = getComputedStyle(document.body).getPropertyValue('--header-background').trim();
    themeColor.setAttribute('content', colorMain);
    // save theme to localStorage
    window.localStorage.setItem('theme', theme);
    // close theme dialog
    toggleThemeDialog();
    // dynamic icon color
    drawCanvas();
  };

  const drawCanvas = () => {
    const canvas = document.createElement('canvas');
    const iconTag = document.getElementById('appIcon');
    const ctx = canvas.getContext('2d');
    const colorMain = getComputedStyle(document.body).getPropertyValue('--main-color');
    const colorBg = getComputedStyle(document.body).getPropertyValue('--cards-background');

    const [width, height] = [512, 512];
    canvas.width = width;
    canvas.height = height;

    ctx.clearRect(0, 0, width, height); // clear canvas

    // draw rounded background
    const path = new Path2D(
      'M0 100C0 44.7715 44.7715 0 100 0H412C467.228 0 512 44.7715 512 100V412C512 467.228 467.228 512 412 512H100C44.7715 512 0 467.228 0 412V100Z'
    );
    ctx.fillStyle = colorBg;
    ctx.fill(path);

    // draw the text
    const B = new Path2D(
      'M45.5924 169.735H67.4624V281.515C67.4624 294.313 70.7024 304.276 77.1824 311.404C83.8244 318.37 92.8964 321.853 104.398 321.853C116.386 321.853 125.782 318.451 132.586 311.647C139.39 304.681 142.792 294.637 142.792 281.515C142.792 269.041 139.066 259.24 131.614 252.112C124.324 244.822 114.685 241.177 102.697 241.177C92.4914 241.177 83.6624 244.093 76.2104 249.925V228.055C85.1204 223.195 94.7594 220.765 105.127 220.765C122.299 220.765 136.474 226.354 147.652 237.532C158.992 248.548 164.662 263.209 164.662 281.515C164.662 300.793 158.749 315.778 146.923 326.47C135.259 337 120.517 342.265 102.697 342.265C85.6874 342.265 71.9174 336.757 61.3874 325.741C50.8574 314.725 45.5924 299.983 45.5924 281.515V169.735Z'
    );
    const M = new Path2D(
      'M191.326 223.195H298.489C309.991 223.195 319.144 225.382 325.948 229.756C332.914 234.13 337.45 239.8 339.556 246.766C341.824 253.732 342.958 262.075 342.958 271.795V339.835H321.574V271.795C321.574 259.159 317.767 250.816 310.153 246.766C306.265 244.66 298.408 243.607 286.582 243.607H276.619V339.835H255.235V243.607H212.71V339.835H191.326V223.195Z'
    );
    const C = new Path2D(
      'M451.828 314.32L466.408 328.657C455.23 337.729 442.432 342.265 428.014 342.265C410.032 342.265 395.614 336.514 384.76 325.012C373.906 313.348 368.479 298.849 368.479 281.515C368.479 264.505 374.149 250.168 385.489 238.504C396.991 226.678 411.166 220.765 428.014 220.765C442.432 220.765 455.23 225.301 466.408 234.373L452.071 248.953C445.267 243.769 437.248 241.177 428.014 241.177C416.836 241.177 407.926 244.903 401.284 252.355C394.804 259.645 391.564 269.365 391.564 281.515C391.564 293.665 394.804 303.466 401.284 310.918C407.926 318.208 416.836 321.853 428.014 321.853C437.41 321.853 445.348 319.342 451.828 314.32Z'
    );

    ctx.fillStyle = colorMain;
    ctx.fill(B);
    ctx.fill(M);
    ctx.fill(C);

    // set the icon
    const base64Canvas = canvas.toDataURL();
    iconTag.setAttribute('href', base64Canvas);

    // save the icon to local storage
    window.localStorage.setItem('appIcon', base64Canvas);

    canvas.remove();
  };

  const itemMouseEnter = e => {
    const theme = e.target.dataset.theme;
    document.body.dataset.currentTheme = theme;
  };

  const itemMouseLeave = () => {
    document.body.dataset.currentTheme = selectedTheme;
  };

  return (
    <>
      <div className='Inputs-header'>
        <div id='expandContainer' style={{ overflow: 'hidden' }}>
          <div className='Inputs-grid-container'>
            <SystemGenderInput />
            <BasicInput />
            <MoreInput />
            <ActivityInput />
            <div className='Inputs-done' onClick={expandOnClick}>
              <p>Done</p>
            </div>
          </div>
        </div>

        <div className='input-expand-container'>
          <div onClick={expandOnClick}>
            <svg id='expand-arrow' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
              <path d='M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z' />
            </svg>
            <p className='arrow-title'>Measurements</p>
          </div>

          <div className='theme-selector-container' onClick={toggleThemeDialog}>
            <p className='selected-theme'>{selectedTheme}</p>
            <svg xmlns='http://www.w3.org/2000/svg' enableBackground='new 0 0 24 24' viewBox='0 0 24 24' className='palette'>
              <path d='M12,2C6.49,2,2,6.49,2,12s4.49,10,10,10c1.38,0,2.5-1.12,2.5-2.5c0-0.61-0.23-1.2-0.64-1.67c-0.08-0.1-0.13-0.21-0.13-0.33 c0-0.28,0.22-0.5,0.5-0.5H16c3.31,0,6-2.69,6-6C22,6.04,17.51,2,12,2z M17.5,13c-0.83,0-1.5-0.67-1.5-1.5c0-0.83,0.67-1.5,1.5-1.5 s1.5,0.67,1.5,1.5C19,12.33,18.33,13,17.5,13z M14.5,9C13.67,9,13,8.33,13,7.5C13,6.67,13.67,6,14.5,6S16,6.67,16,7.5 C16,8.33,15.33,9,14.5,9z M5,11.5C5,10.67,5.67,10,6.5,10S8,10.67,8,11.5C8,12.33,7.33,13,6.5,13S5,12.33,5,11.5z M11,7.5 C11,8.33,10.33,9,9.5,9S8,8.33,8,7.5C8,6.67,8.67,6,9.5,6S11,6.67,11,7.5z' />
            </svg>
          </div>
        </div>
      </div>

      <div className='theme-dialog'>
        <div className='theme-dialog-background' onClick={toggleThemeDialog} />
        <div className='theme-dialog-content'>
          {themes.sort().map(i => (
            <p
              className={'theme-dialog-itmes ' + (selectedTheme === i ? 'theme-dialog-itmes-active' : '')}
              key={i}
              data-theme={i}
              onClick={changeTheme}
              onMouseEnter={itemMouseEnter}
              onMouseLeave={itemMouseLeave}
            >
              {i}
            </p>
          ))}
        </div>
      </div>
    </>
  );
}

const SystemGenderInput = () => {
  const ctx = useContext(Ctx);

  const active_bg = {
    backgroundColor: 'var(--main-color)',
    borderColor: 'var(--main-color)',
  };

  const active_text = {
    color: 'var(--buttons-text-color-active)',
  };

  return (
    <div className='Inputs-wrapper'>
      <div className='Inputs-mask' />

      <h2 className='Inputs-section-title'>Mesurement system</h2>
      <div className='system-wrapper'>
        <div
          className='Inputs-activity-container'
          style={ctx.data.mesurementSystem === 'metric' ? active_bg : null}
          onClick={() => ctx.set({ mesurementSystem: 'metric' })}
        >
          <h3 className='Inputs-activity-title' style={ctx.data.mesurementSystem === 'metric' ? active_text : null}>
            Metric
          </h3>
        </div>
        <div
          className='Inputs-activity-container'
          style={ctx.data.mesurementSystem === 'imperial' ? active_bg : null}
          onClick={() => ctx.set({ mesurementSystem: 'imperial' })}
        >
          <h3 className='Inputs-activity-title' style={ctx.data.mesurementSystem === 'imperial' ? active_text : null}>
            Imperial
          </h3>
        </div>
      </div>

      <h2 className='Inputs-section-title'>Select your gender</h2>
      <div className='system-wrapper'>
        <div
          className='Inputs-activity-container'
          style={ctx.data.gender === 'male' ? active_bg : null}
          onClick={() => ctx.set({ gender: 'male' })}
        >
          <h3 className='Inputs-activity-title' style={ctx.data.gender === 'male' ? active_text : null}>
            Male
          </h3>
        </div>
        <div
          className='Inputs-activity-container'
          style={{ ...(ctx.data.gender === 'female' ? active_bg : null) }}
          onClick={() => ctx.set({ gender: 'female' })}
        >
          <h3 className='Inputs-activity-title' style={{ ...(ctx.data.gender === 'female' ? active_text : null) }}>
            Female
          </h3>
        </div>
      </div>
    </div>
  );
};

const BasicInput = () => {
  const ctx = useContext(Ctx);

  const system = ctx.data.mesurementSystem;
  const { weight, height, units } = minMax[system];

  return (
    <div className='Inputs-wrapper'>
      <div className='Inputs-mask' style={{ animationDelay: '1s' }} />
      <h2 className='Inputs-section-title'>Basic Information</h2>

      <div className='Inputs-container'>
        <div className='Inputs-label-container'>
          <label htmlFor='age-input'>Age</label>
        </div>
        <input
          id='age-input'
          className='Inputs-input'
          type='number'
          min={minMax.age[0]}
          max={minMax.age[1]}
          title={`Enter your age between ${minMax.age[0]} and ${minMax.age[1]} years`}
          placeholder='Your Age in years'
          value={ctx.data.age || ''}
          onChange={e => ctx.set({ age: +e.target.value })}
          onBlur={e =>
            ctx.set({ age: +e.target.value !== 0 ? Math.min(Math.max(+e.target.value, +e.target.min), +e.target.max) : 0 })
          }
        />
      </div>

      <div className='Inputs-container'>
        <div className='Inputs-label-container'>
          <label htmlFor='weight-input'>Weight</label>
        </div>
        <input
          id='weight-input'
          className='Inputs-input'
          type='number'
          min={weight[0]}
          max={weight[1]}
          title={`Enter your weight between ${weight[0]} and ${weight[1]} ${units[0]}`}
          placeholder={`Your weight In ${units[0]}`}
          value={ctx.data.weight || ''}
          onChange={e => ctx.set({ weight: +e.target.value })}
          onBlur={e =>
            ctx.set({
              weight: +e.target.value !== 0 ? Math.min(Math.max(+e.target.value, +e.target.min), +e.target.max) : 0,
            })
          }
        />
      </div>

      <div className='Inputs-container'>
        <div className='Inputs-label-container'>
          <label htmlFor='height-input'>Height</label>
        </div>
        <input
          id='height-input'
          className='Inputs-input'
          type='number'
          min={height[0]}
          max={height[1]}
          title={`Enter your height between ${height[0]} and ${height[1]} ${units[1]}`}
          placeholder={`Your Height In ${units[1]}`}
          value={ctx.data.height || ''}
          onChange={e => ctx.set({ height: +e.target.value })}
          onBlur={e =>
            ctx.set({
              height: +e.target.value !== 0 ? Math.min(Math.max(+e.target.value, +e.target.min), +e.target.max) : 0,
            })
          }
        />
      </div>
    </div>
  );
};

const MoreInput = () => {
  const ctx = useContext(Ctx);

  const system = ctx.data.mesurementSystem;
  const { neck, waist, hip, units } = minMax[system];

  return (
    <div className='Inputs-wrapper'>
      <div className='Inputs-mask' style={{ animationDelay: '2s' }} />

      <h2 className='Inputs-section-title'>For more calculations</h2>

      <div
        className='Inputs-container'
        title="Wrap the measuring tape around the neck, beginning at about one inch from the meeting of your neck and shoulders. This may also coincide with the bottom part of your Adam's apple. Come fully around the neck, leaving no dangling space in between the neck and the tape. Make sure the tape is level and not being held at an angle."
      >
        <div className='Inputs-label-container'>
          <label htmlFor='neck-input'>Neck size</label>
        </div>
        <input
          id='neck-input'
          className='Inputs-input'
          type='number'
          min={neck[0]}
          max={neck[1]}
          title={`Enter your neck size between ${neck[0]} and ${neck[1]} ${units[1]}`}
          placeholder={`Your Neck Size In ${units[1]}`}
          value={ctx.data.neck || ''}
          onChange={e => ctx.set({ neck: +e.target.value })}
          onBlur={e =>
            ctx.set({
              neck: +e.target.value !== 0 ? Math.min(Math.max(+e.target.value, +e.target.min), +e.target.max) : 0,
            })
          }
        />
      </div>

      <div
        className='Inputs-container'
        title="Start at the top of your hip bone, then bring the tape measure all the way around your body, level with your belly button. Make sure it's not too tight and that it's straight, even at the back. Don't hold your breath while measuring. Check the number on the tape measure right after you exhale."
      >
        <div className='Inputs-label-container'>
          <label htmlFor='waist-input'>Waist size</label>
        </div>
        <input
          id='waist-input'
          className='Inputs-input'
          type='number'
          min={waist[0]}
          max={waist[1]}
          title={`Enter your waist size between ${waist[0]} and ${waist[1]} ${units[1]}`}
          placeholder={`Your Waist Size In ${units[1]}`}
          value={ctx.data.waist || ''}
          onChange={e => ctx.set({ waist: +e.target.value })}
          onBlur={e =>
            ctx.set({
              waist: +e.target.value !== 0 ? Math.min(Math.max(+e.target.value, +e.target.min), +e.target.max) : 0,
            })
          }
        />
      </div>

      <div
        className='Inputs-container'
        title='Your natural waist is the smallest part of your torso, where your body dips in. Your hips are below that, and they are usually wider than your waist. Your hip measurement includes your butt and your hips. Your hip measurements should be taken at where your hips are the widest.'
      >
        <div className='Inputs-label-container'>
          <label htmlFor='hip-input'>Hip size</label>
        </div>
        <input
          id='hip-input'
          className='Inputs-input'
          type='number'
          min={hip[0]}
          max={hip[1]}
          title={`Enter your hip size between ${hip[0]} and ${hip[1]} ${units[1]}`}
          placeholder={`Your Hip Size In ${units[1]}`}
          value={ctx.data.hip || ''}
          onChange={e => ctx.set({ hip: +e.target.value })}
          onBlur={e =>
            ctx.set({
              hip: +e.target.value !== 0 ? Math.min(Math.max(+e.target.value, +e.target.min), +e.target.max) : 0,
            })
          }
        />
      </div>
    </div>
  );
};

const ActivityInput = () => {
  const ctx = useContext(Ctx);

  const active_bg = {
    backgroundColor: 'var(--main-color)',
    borderColor: 'var(--main-color)',
  };

  const active_text = {
    color: 'var(--buttons-text-color-active)',
  };

  return (
    <div className='Inputs-wrapper'>
      <div className='Inputs-mask' style={{ animationDelay: '3s' }} />

      <h2 className='Inputs-section-title'>Select your activity level</h2>

      <div className='activity-wrapper'>
        <div
          className='Inputs-activity-container'
          title='Little or no exercise, desk job'
          style={ctx.data.activity === ACTIVITY.SEDENTARY ? active_bg : null}
          onClick={() => ctx.set({ activity: ACTIVITY.SEDENTARY })}
        >
          <h3 className='Inputs-activity-title' style={ctx.data.activity === ACTIVITY.SEDENTARY ? active_text : null}>
            Sedentary
          </h3>
        </div>
        <div
          className='Inputs-activity-container'
          title='Light exercise / sports 1-3 days/week'
          style={ctx.data.activity === ACTIVITY.LIGHT_ACTIVE ? active_bg : null}
          onClick={() => ctx.set({ activity: ACTIVITY.LIGHT_ACTIVE })}
        >
          <h3 className='Inputs-activity-title' style={ctx.data.activity === ACTIVITY.LIGHT_ACTIVE ? active_text : null}>
            Light active
          </h3>
        </div>
        <div
          className='Inputs-activity-container'
          title='Moderate exercise / sports 6-7 days/week'
          style={ctx.data.activity === ACTIVITY.MODERATE_ACTIVE ? active_bg : null}
          onClick={() => ctx.set({ activity: ACTIVITY.MODERATE_ACTIVE })}
        >
          <h3 className='Inputs-activity-title' style={ctx.data.activity === ACTIVITY.MODERATE_ACTIVE ? active_text : null}>
            Moderate Active
          </h3>
        </div>
        <div
          className='Inputs-activity-container'
          title='Hard exercise / sports & physical job or 2x training'
          style={ctx.data.activity === ACTIVITY.VERY_ACTIVE ? active_bg : null}
          onClick={() => ctx.set({ activity: ACTIVITY.VERY_ACTIVE })}
        >
          <h3 className='Inputs-activity-title' style={ctx.data.activity === ACTIVITY.VERY_ACTIVE ? active_text : null}>
            Very Active
          </h3>
        </div>
        <div
          className='Inputs-activity-container'
          title='Hard exercise 2 or more times per day'
          style={ctx.data.activity === ACTIVITY.EXTRA_ACTIVE ? active_bg : null}
          onClick={() => ctx.set({ activity: ACTIVITY.EXTRA_ACTIVE })}
        >
          <h3 className='Inputs-activity-title' style={ctx.data.activity === ACTIVITY.EXTRA_ACTIVE ? active_text : null}>
            Extra Active
          </h3>
        </div>
      </div>
    </div>
  );
};
