import { useCallback, useContext, useEffect, useState } from 'react';
import { requestNum } from 'request-animation-number';
import { ACTIVITY, Ctx, minMax } from './App';

export default function Inputs(props) {
  const ctx = useContext(Ctx);

  const [selectedTheme, setSelectedTheme] = useState(window.localStorage.getItem('theme') || 'fledgling');
  const themes = ['twitch', 'oneUi', 'laser', 'fledgling', 'neumorphism'];

  const expandHeader = useCallback(() => {
    const header = document.getElementById('header');
    const inputsWrapper = document.querySelector('.Inputs-header');
    const inputsContainer = document.getElementById('expandContainer');
    const arrowContainer = document.querySelector('.input-expand-container');
    const arrow = document.getElementById('expand-arrow');
    const gridContainer = document.querySelector('.Inputs-grid-container');
    const gridHeight = gridContainer.getBoundingClientRect().height + gridContainer.getCss('margin-top', true);
    const duration = ctx.inputsPanle.useAnimation ? 500 : 0;
    // close
    if (!ctx.inputsPanle.isOpen) {
      arrowContainer.css({ borderTopWidth: '1px' });
      inputsWrapper.css({ position: 'sticky' });
      header.css({ boxShadow: 'none' });

      requestNum({ from: [gridHeight, 0], to: [0, 180], duration, easingFunction: 'easeInOutQuad' }, (h, r) => {
        inputsContainer.css({ height: `${h}px` });
        arrow.css({ transform: `rotate(${r}deg)` });
      });
      // open
    } else {
      arrowContainer.css({ borderTopWidth: '0px' });
      header.removeCss('box-shadow');

      requestNum(
        { from: [0, 180, window.scrollY], to: [gridHeight, 0, 0], duration, easingFunction: 'easeInOutQuad' },
        (h, r, s) => {
          inputsContainer.css({ height: `${h}px` });
          arrow.css({ transform: `rotate(${r}deg)` });
          window.scrollTo({ top: s });
          if (r === 0) {
            inputsContainer.removeCss('height');
            inputsWrapper.removeCss('position');
          }
        }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ctx.inputsPanle]);

  useEffect(() => {
    expandHeader();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ctx.inputsPanle]);

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
    const tag = document.getElementById('currentTheme');
    const theme = e.target.dataset.theme;
    tag.setAttribute('href', `/themes/${theme}.css`);
    setSelectedTheme(theme);
    window.localStorage.setItem('theme', theme);
    toggleThemeDialog();
    drawCanvas();
  };

  const drawCanvas = () => {
    const canvas = document.createElement('canvas');
    const iconTag = document.getElementById('appIcon');
    const ctx = canvas.getContext('2d');
    const colorMain = getComputedStyle(document.documentElement).getPropertyValue('--main-color');
    const colorBg = getComputedStyle(document.documentElement).getPropertyValue('--cards-background');

    const [width, height] = [512, 512];
    canvas.width = width;
    canvas.height = height;

    ctx.clearRect(0, 0, width, height); // clear canvas

    // draw rounded background
    let radius = 20;
    const [x, y] = [0, 0];
    ctx.fillStyle = colorBg;
    if (width < 2 * radius) radius = width / 2;
    if (height < 2 * radius) radius = height / 2;
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.arcTo(x + width, y, x + width, y + height, radius);
    ctx.arcTo(x + width, y + height, x, y + height, radius);
    ctx.arcTo(x, y + height, x, y, radius);
    ctx.arcTo(x, y, x + width, y, radius);
    ctx.closePath();
    ctx.fill();

    // draw the text
    ctx.font = 'bold 200px Cairo';
    ctx.fillStyle = colorMain;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    ctx.fillText('BMC', width / 2, height / 2 + 40);

    // set the icon
    const base64Canvas = canvas.toDataURL();
    iconTag.setAttribute('href', base64Canvas);

    // save the icon to local storage
    window.localStorage.setItem('appIcon', base64Canvas);

    canvas.remove();
  };

  const itemMouseEnter = e => {
    const tag = document.getElementById('currentTheme');
    const theme = e.target.dataset.theme;
    tag.setAttribute('href', `/themes/${theme}.css`);
  };

  const itemMouseLeave = () => {
    const tag = document.getElementById('currentTheme');
    tag.setAttribute('href', `/themes/${selectedTheme}.css`);
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
          {themes.map(i => (
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
