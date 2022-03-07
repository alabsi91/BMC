import { animare, ease } from 'animare';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Ctx } from '../App';
import MethodInfo from '../MethodInfo';
import UnlockCard from '../UnlockCard';

export default function Bmi() {
  const ctx = useContext(Ctx);

  const bmiTxtEl = useRef();
  const bmiArrowPos = useRef();

  const prevBmi = useRef(0);

  const [bmi, setBmi] = useState(0);
  const [bmiRange, setBmiRange] = useState('');
  const [bmiGoal, setBmiGoal] = useState('');

  useEffect(() => {
    const canvas = document.getElementById('bmi-rangebar-canvas');
    const canvasCtx = canvas.getContext('2d');
    const gradient = canvasCtx.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop(0, '#ff0000');
    gradient.addColorStop(0.45, '#ffc000');
    gradient.addColorStop(0.65, '#1fff00');
    gradient.addColorStop(0.8, '#ffc000');
    gradient.addColorStop(1, '#ff0000');
    canvasCtx.fillStyle = gradient;
    canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  useEffect(() => {
    calculateBmi();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ctx.data.weight, ctx.data.height, ctx.data.mesurementSystem, ctx.data.age]);

  // animate bmi results
  useEffect(() => {
    const Txt = bmiTxtEl.current;
    animare({ from: prevBmi.current, to: bmi, duration: 500, ease: ease.out.sine }, ([t]) => {
      Txt.innerHTML = +t.toFixed(1);
    });
    prevBmi.current = bmi;
  }, [bmi]);

  const calculateBmi = useCallback(() => {
    // bmi
    const { weight, height, mesurementSystem, age } = ctx.data;

    let bmi = mesurementSystem === 'metric' ? weight / Math.pow(height / 100, 2) : (703 * weight) / Math.pow(height, 2);
    bmi = !bmi || ['Infinity', 'NaN'].includes(bmi.toFixed(1)) || bmi < 0 ? 0 : +bmi.toFixed(1);

    // range and goal
    let bmiRange, bmiGoal;
    if (bmi < 18.5 && age >= 18) {
      bmiRange = 'Underweight';
      bmiGoal = 'You Should Gain Some Weight';
    } else if (bmi >= 18.5 && bmi <= 25 && age >= 18) {
      bmiRange = 'Normal';
      bmiGoal = 'You Should Sustain Your Weight';
    } else if (bmi > 25 && bmi <= 30 && age >= 18) {
      bmiRange = 'Overweight';
      bmiGoal = 'You Should Lose Some Weight';
    } else if (bmi > 30 && age >= 18) {
      bmiRange = 'Obese';
      bmiGoal = 'You Should Lose Weight';
    } else if (age < 18) {
      bmiRange = 'Child';
      bmiGoal = '---';
    }

    setBmiRange(bmiRange);
    setBmiGoal(bmiGoal);

    // bmi indicator animation and range text color.
    const bmiArrow = document.getElementById('bmi-arrow');
    const rangeText = document.getElementById('bmi-range');
    const canvas = document.getElementById('bmi-rangebar-canvas');
    const context = canvas.getContext('2d');

    const indicator = bmi > 35 ? 99.9 : bmi < 0 ? 0 : Math.round((bmi * 100) / 35);
    animare({ from: bmiArrowPos.current || 0, to: indicator || 0, duration: 500, ease: ease.out.sine }, ([l]) => {
      bmiArrow.css({ left: l + '%' });
      const r = context?.getImageData((canvas.width * l) / 100, canvas.height / 2, 1, 1)?.data;
      const color = `rgb(${r[0]}, ${r[1]}, ${r[2]})`;
      rangeText.css({ color });
    });

    bmiArrowPos.current = indicator;
    setBmi(bmi);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ctx.data.weight, ctx.data.height, ctx.data.age, ctx.data.mesurementSystem]);

  return (
    <div className='card-container' data-card-id='bmi' draggable>
      <div className='masked-borders' />
      <UnlockCard title='BMI' dependencies={['age', 'weight', 'height']} />
      <MethodInfo
        title='BMI Method'
        text='BMI can tell you about excess weight.However, it can’t be an indicator of excess fat as it can’t tell the difference
          between excess muscle, fat, or bone. Unlike children, adult BMI is not subject to age, gender, or muscle mass. Pregnancy
          also affects BMI, which is why you should use pre-pregnancy weight for BMI calculation.'
      />

      <div className='card-contents'>
        <h3 className='card-title'>BMI</h3>
        <h3 className='card-result-title'>Your Body Mass Index</h3>
        <h3 ref={bmiTxtEl} className='card-result-number'>
          {bmi}
        </h3>
        <h3 className='card-result-title'>Weight Status</h3>
        <h3 id='bmi-range' className='card-result-range'>
          {bmiRange}
        </h3>
        <div className='bmi-rangebar'>
          <canvas id='bmi-rangebar-canvas' width='100%' height='100%'></canvas>
          <div id='bmi-arrow'></div>
        </div>
        <h3 className='card-result-goal'>{bmiGoal}</h3>
      </div>
    </div>
  );
}
