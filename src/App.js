import React, { useCallback, useEffect, useRef, useState } from 'react';
import initializeEasyCss from './easyCss/easyCss';
import Bfp from './cards/Bfp';
import Bmi from './cards/Bmi';
import Bmr from './cards/Bmr';
import Ibw from './cards/Ibw';
import Lbm from './cards/Lbm';
import Whtr from './cards/Whtr';
import Tbw from './cards/Tbw';
import Inputs from './Inputs';
import { cardMouseMove, cardMouseEnter, cardMouseLeave } from './cardMouseMove';
import { animare } from 'animare';

if ('registerProperty' in window.CSS) {
  CSS.registerProperty({
    name: '--title-color-Pos',
    syntax: '<percentage>',
    initialValue: '0%',
    inherits: false,
  });
  CSS.registerProperty({
    name: '--rotate-background',
    syntax: '<angle>',
    initialValue: '0deg',
    inherits: false,
  });
} else {
  document.documentElement.style.setProperty('--title-color-Pos', '50%');
  document.documentElement.style.setProperty('--rotate-background', '90deg');
}

initializeEasyCss();

export const ACTIVITY = {
  SEDENTARY: 1.2,
  LIGHT_ACTIVE: 1.375,
  MODERATE_ACTIVE: 1.55,
  VERY_ACTIVE: 1.725,
  EXTRA_ACTIVE: 1.9,
};

export const minMax = {
  age: [18, 99],
  metric: {
    age: [18, 99],
    weight: [30, 200],
    height: [60, 250],
    neck: [30, 66],
    waist: [40, 1000],
    hip: [40, 1000],
    units: ['Kilograms', 'Centimeters'],
  },
  imperial: {
    age: [18, 99],
    weight: [66, 440],
    height: [24, 100],
    neck: [12, 26],
    waist: [16, 400],
    hip: [16, 400],
    units: ['Pounds', 'Inches'],
  },
};

let userData = {
  gender: 'male', // female
  age: 0,
  weight: 0,
  height: 0,
  neck: 0,
  waist: 0,
  hip: 0,
  activity: ACTIVITY.SEDENTARY,
  mesurementSystem: 'metric', // imperial
};

userData = window.localStorage.getItem('userData') ? JSON.parse(window.localStorage.getItem('userData')) : userData;

/**
 * - Set user data values.
 * @param {object} data
 * @param {string} data.name
 * @param {'male' | 'female'} data.gender
 * @param {number} data.age
 * @param {number} data.weight
 * @param {number} data.height
 * @param {number} data.neck
 * @param {number} data.waist
 * @param {number} data.hip
 * @param {number} data.activity
 * @param {'metric' | 'imperial'} data.mesurementSystem
 *
 */
let set = data => {
  userData = { ...userData, ...data };
};

export const Ctx = React.createContext({ data: userData, set });

function App() {
  const isPanelOpen = useRef(false);
  const [data, setData] = useState(userData);
  const [inputsPanle, setInputsPanle] = useState({ isOpen: false, useAnimation: false });

  set = data => {
    setData(prev => {
      if (prev.mesurementSystem !== data.mesurementSystem && data.mesurementSystem) {
        if (data.mesurementSystem === 'imperial') {
          data.height = +(prev.height / 2.54).toFixed(2);
          data.neck = +(prev.neck / 2.54).toFixed(2);
          data.waist = +(prev.waist / 2.54).toFixed(2);
          data.hip = +(prev.hip / 2.54).toFixed(2);
          data.weight = +(prev.weight * 2.205).toFixed(2);
        } else if (data.mesurementSystem === 'metric') {
          data.height = +(prev.height * 2.54).toFixed(2);
          data.neck = +(prev.neck * 2.54).toFixed(2);
          data.waist = +(prev.waist * 2.54).toFixed(2);
          data.hip = +(prev.hip * 2.54).toFixed(2);
          data.weight = +(prev.weight / 2.205).toFixed(2);
        }
      }
      const newData = { ...prev, ...data };
      window.localStorage.setItem('userData', JSON.stringify(newData));
      return newData;
    });
  };

  useEffect(() => {
    isPanelOpen.current = inputsPanle.isOpen;
  }, [inputsPanle]);

  useEffect(() => {
    setTheme();

    const mediaQueryList = window.matchMedia('(max-width: 800px)');
    mediaQueryList.addListener(matchMediaListener);

    window.addEventListener('scroll', scrollFunction);

    const resizeObserver = new ResizeObserver(masonryLayout);
    const headerObserver = new ResizeObserver(stickyTopValue);

    resizeObserver.observe(document.getElementById('cards-grid'));
    headerObserver.observe(document.getElementById('header'));

    document.querySelectorAll('.card-container').forEach(card => {
      resizeObserver.observe(card);
      if (!matchMedia('(pointer:fine)').matches) return; // disable mouse events on touch devices
      card.addEventListener('mousemove', e => cardMouseMove(e, card));
      card.addEventListener('mouseenter', e => cardMouseEnter(e, card));
      card.addEventListener('mouseleave', e => cardMouseLeave(e, card));

      card.addEventListener('dragstart', onDragStart, false);
      card.addEventListener('dragend', onDragEnd, false);
      card.addEventListener('dragover', onDragOver, false);
    });

    animateCardsBorders();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setTheme = () => {
    // color transition when changing theme.
    document.documentElement.style.setProperty('--color-transition', 'background-color 0.3s ease-in-out');
    // dynamic icon color
    const iconTag = document.getElementById('appIcon');
    const icon = window.localStorage.getItem('appIcon');
    iconTag.setAttribute('href', icon);
    // for manifest
    const themeColor = document.getElementById('theme-color');
    const colorMain = getComputedStyle(document.body).getPropertyValue('--header-background').trim();
    themeColor.setAttribute('content', colorMain);
  };

  const onDragStart = e => {
    e.stopPropagation();
    e.target.dataset.drag = 'true';
    e.target.children[0].css({ WebkitMaskPosition: 'center', maskPosition: 'center' });
    e.target.classList.add('card-drag-ghost');
    document.querySelectorAll('.card-unlock-content').css({ pointerEvents: 'none' });
  };

  const onDragEnd = e => {
    e.target.dataset.drag = 'false';
    e.target.classList.remove('card-drag-ghost');
    document.querySelectorAll('.card-unlock-content').removeCss('pointer-events');
    const gridItems = [...document.querySelectorAll('.card-container')];
    const newArrange = gridItems.map(e => e.dataset.cardId);
    window.localStorage.setItem('arrange', JSON.stringify(newArrange));
  };

  const onDragOver = e => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'copyMove';
    const grid = document.getElementById('cards-grid');
    const items = Array.from(grid.children);
    const targetId = e.target.closest('.card-container').dataset.cardId;
    const currentItem = items.find(item => item.dataset.cardId === targetId);

    if (!currentItem) return;

    const currentIndex = items.indexOf(currentItem);
    const targetItem = items.find(item => item.dataset.drag === 'true');
    const targetIndex = items.indexOf(targetItem);

    currentIndex > targetIndex
      ? grid.insertBefore(currentItem, targetItem)
      : grid.insertBefore(currentItem, targetItem.nextSibling);

    masonryLayout();
  };

  const animateCardsBorders = async () => {
    const cards = document.querySelectorAll('.card-container');
    const maskeElement = document.querySelectorAll('.masked-borders');
    const maskeSize = (maskeElement[0].getCss('mask-size', true) || maskeElement[0].getCss('-webkit-mask-size', true)) / 2;
    const duration = 200;

    await new Promise(resolve => setTimeout(resolve, 500));

    for (let i = 0; i < maskeElement.length; i++) {
      const card = cards[i];
      const circle = maskeElement[i];
      const { width, height } = card.getBoundingClientRect();

      const cb = ([x, y]) => {
        const maskPos = `${x - maskeSize}px ${y - maskeSize}px`;
        circle.css({ WebkitMaskPosition: maskPos, maskPosition: maskPos });
      };

      animare({ to: [width, 0], duration }, cb)
        .to({ to: [width, height] })
        .to({ to: [0, height] })
        .to({ to: [0, 0] })
        .to({ to: [width / 2, height / 2] })
        .onFinish(() => {
          if (!window.localStorage.getItem('userData')) setInputsPanle({ isOpen: true, useAnimation: true });
        });
    }
  };

  const scrollFunction = () => {
    const toTop = document.querySelector('.scroll-to-top');
    const trigger = 150;
    if (document.body.scrollTop > trigger || document.documentElement.scrollTop > trigger) {
      toTop.style.display = 'flex';
    } else {
      toTop.style.display = 'none';
    }
  };

  const stickyTopValue = () => {
    const headerHeight = document.getElementById('header').getBoundingClientRect().height + 'px';
    const inputsContainer = document.querySelector('.Inputs-header');
    inputsContainer.css({ top: headerHeight });
  };

  const masonryLayout = () => {
    const gridItems = document.querySelectorAll('.card-container');
    const grid = gridItems?.[0]?.parentElement;
    if (!grid) return;
    const gridGap = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-row-gap'));
    const columnCount = window.getComputedStyle(grid).getPropertyValue('grid-template-columns').split(' ').length;

    // remove margins from grid items to reset
    for (let i = 0; i < gridItems.length; i++) gridItems[i].style.removeProperty('margin-top');

    if (columnCount === 1) return;

    // set ma rgin-top of each row
    for (let i = 0; i < gridItems.length; i++) {
      if (gridItems[i + columnCount]) {
        const margin =
          gridItems[i].getBoundingClientRect().bottom - gridItems[i + columnCount].getBoundingClientRect().top + gridGap;
        gridItems[i + columnCount].style.marginTop = `${margin}px`;
      }
    }
  };

  const cards = useRef({
    Bmi,
    Bmr,
    Whtr,
    Ibw,
    Bfp,
    Lbm,
    Tbw,
  });

  const renderCards = useCallback(() => {
    const arrange = window.localStorage.getItem('arrange');
    if (arrange) {
      const newArrange = JSON.parse(arrange).map(e => e[0].charAt(0).toUpperCase() + e.slice(1));
      return newArrange.map(e => {
        const Card = cards.current[e];
        return <Card key={e} />;
      });
    } else {
      return Object.keys(cards.current).map(e => {
        const Card = cards.current[e];
        return <Card key={Card.name} />;
      });
    }
  }, []);

  const expandOnClick = () => {
    setInputsPanle({ isOpen: !inputsPanle.isOpen, useAnimation: true });
  };

  const matchMediaListener = e => {
    const inputsContainer = document.getElementById('expandContainer');
    if (e.matches) {
      inputsContainer.css({ left: isPanelOpen.current ? '0vw' : '-100vw' });
      document.body.style.overflow = isPanelOpen.current ? 'hidden' : 'auto';
    } else {
      inputsContainer.css({ height: isPanelOpen.current ? 'auto' : '0px' });
      document.body.style.overflow = 'auto';
    }
  };

  return (
    <Ctx.Provider value={{ data, set, inputsPanle, setInputsPanle }}>
      <div className='App'>
        <header id='header'>
          <svg id='ham-menu' onClick={expandOnClick} viewBox='0 0 24 24'>
            <rect x='0' y='3' width='100%' height='3' />
            <rect x='0' y='10.5' width='100%' height='3' />
            <rect x='0' y='18' width='100%' height='3' />
          </svg>
          <h1 className='header-title'>Body Measurements Calculator</h1>
        </header>

        <Inputs />

        <div id='cards-grid' className='cards-wrapper'>
          {renderCards()}
        </div>

        <div
          className='scroll-to-top'
          onClick={() => {
            animare({ from: window.scrollY, to: 0, duration: 500, easingFunction: 'easeOutCubic' }, ([y]) => {
              window.scrollTo({ top: y });
            });
          }}
        >
          <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
            <path d='M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z' />
          </svg>
        </div>
      </div>
    </Ctx.Provider>
  );
}

export default App;
