import { useCallback, useContext, useEffect, useState } from 'react';
import { Ctx } from '../App';
import MethodInfo from '../MethodInfo';
import UnlockCard from '../UnlockCard';

export default function Whtr() {
  const ctx = useContext(Ctx);

  const [whtr, setWhtr] = useState(0);
  const [whtrRange, setWhtrRange] = useState('');
  const [whtrGoal, setWhtrGoal] = useState('');

  useEffect(() => {
    calculateWhtr();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ctx.data.height, ctx.data.age, ctx.data.waist, ctx.data.gender]);

  const calculateWhtr = useCallback(() => {
    const { height, age, gender, waist } = ctx.data;
    let whtrRange, whtrGoal;

    let whtr = waist / height;

    // eslint-disable-next-line default-case
    switch (gender) {
      case 'male':
        if (whtr <= 0.34 && age >= 20) {
          whtrRange = 'Extremely Slim';
          whtrGoal = 'You Should Gain Weight';
          // whtrColor = '#dc2900';
        } else if (whtr >= 0.35 && whtr < 0.43 && age >= 20) {
          whtrRange = 'Slim';
          whtrGoal = 'You Should Gain Some Weight';
          // whtrColor = '#d0a50b';
        } else if (whtr >= 0.43 && whtr < 0.52 && age >= 20) {
          whtrRange = 'Healthy';
          whtrGoal = 'You Should Sustain Your Weight';
          // whtrColor = '#40ff45';
        } else if (whtr >= 0.52 && whtr < 0.57 && age >= 20) {
          whtrRange = 'Overweight';
          whtrGoal = 'You Should Lose Some Weight';
          // whtrColor = '#d0a50b';
        } else if (whtr >= 0.57 && whtr < 0.62 && age >= 20) {
          whtrRange = 'Very overweight';
          whtrGoal = 'You Should Lose Some Weight';
          // whtrColor = '#dc2900';
        } else if (whtr >= 0.62 && age >= 20) {
          whtrRange = 'Obese';
          whtrGoal = 'You Should Lose Weight';
          // whtrColor = '#dc2900';
        }
        break;

      case 'female':
        if (whtr <= 0.34 && age >= 20) {
          whtrRange = 'Extremely Slim';
          whtrGoal = 'You Should Gain Weight';
          // whtrColor = '#dc2900';
        } else if (whtr >= 0.35 && whtr < 0.41 && age >= 20) {
          whtrRange = 'Slim';
          whtrGoal = 'You Should Gain Some Weight';
          // whtrColor = '#d0a50b';
        } else if (whtr >= 0.41 && whtr < 0.48 && age >= 20) {
          whtrRange = 'Healthy';
          whtrGoal = 'You Should Sustain Your Weight';
          // whtrColor = '#40ff45';
        } else if (whtr >= 0.48 && whtr < 0.53 && age >= 20) {
          whtrRange = 'Overweight';
          whtrGoal = 'You Should Lose Some Weight';
          // whtrColor = '#d0a50b';
        } else if (whtr >= 0.53 && whtr < 0.57 && age >= 20) {
          whtrRange = 'Very overweight';
          whtrGoal = 'You Should Lose Weight';
          // whtrColor = '#dc2900';
        } else if (whtr >= 0.57 && age >= 20) {
          whtrRange = 'Obese';
          whtrGoal = 'You Should Lose Weight';
          // whtrColor = '#dc2900';
        }
        break;
    }

    if (whtr <= 0.34 && age < 20) {
      whtrRange = 'Extremely Slim';
      whtrGoal = 'You Should Gain Weight';
      // whtrColor = '#dc2900';
    } else if (whtr >= 0.35 && whtr < 0.45 && age < 20) {
      whtrRange = 'Slim';
      whtrGoal = 'You Should Gain Some Weight';
      // whtrColor = '#d0a50b';
    } else if (whtr >= 0.45 && whtr < 0.51 && age < 20) {
      whtrRange = 'Healthy';
      whtrGoal = 'You Should Sustain Your Weight';
      // whtrColor = '#40ff45';
    } else if (whtr >= 0.51 && whtr < 0.63 && age < 20) {
      whtrRange = 'Overweight';
      whtrGoal = 'You Should Lose Some Weight';
      // whtrColor = '#d0a50b';
    } else if (whtr >= 0.63 && age < 20) {
      whtrRange = 'Obese';
      whtrGoal = 'You Should Lose Weight';
      // whtrColor = '#dc2900';
    }

    setWhtr(whtr);
    setWhtrRange(whtrRange);
    setWhtrGoal(whtrGoal);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ctx.data.height, ctx.data.age, ctx.data.waist, ctx.data.gender]);

  return (
    <div className='card-container' data-card-id='whtr' draggable>
      <div className='masked-borders'></div>
      <UnlockCard title='WHtR' dependencies={['gender', 'age', 'height', 'waist']} />
      <MethodInfo
        title='WHtR Method'
        text='Waist to Height Ratio calculates your estimated waist-height ratio, which effectively indicates centralized obesity and cardiometabolic risk. WHtR is a measure of body fat distribution. Its higher value indicates a higher risk of cardiovascular diseases associated with obesity.'
      />
      <div className='card-contents'>
        <h3 className='card-title'>WHtR</h3>
        <h3 className='card-result-title'>Your Waist to Height Ratio</h3>
        <h3 className='card-result-number'>{['Infinity', 'NaN'].includes(whtr.toFixed(2)) ? 0 : whtr.toFixed(2)}</h3>
        <h3 className='card-result-title'>Weight Status</h3>
        <h3 className='card-result-range'>{whtrRange}</h3>
        <h3 className='card-result-goal'>{whtrGoal}</h3>
      </div>
    </div>
  );
}
