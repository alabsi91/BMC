import { useContext, useEffect, useState } from 'react';
import { Ctx } from '../App';
import MethodInfo from '../MethodInfo';
import UnlockCard from '../UnlockCard';

const formulas = ['Harris Benedict Equation', 'Mifflin-St Jeor Equation', 'Roza and Shizgal Equation'];
export default function Bmr() {
  const ctx = useContext(Ctx);

  const [bmr, setBmr] = useState(0);
  const [formula, setFormula] = useState(formulas[0]);
  const [dailykcal, setDailykcal] = useState(0);

  useEffect(() => {
    calculateBmr();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ctx.data, formula]);

  const calculateBmr = () => {
    const { weight, height, mesurementSystem, age, gender, activity } = ctx.data;
    let bmr = 0;

    if (formula === formulas[0]) {
      if (gender === 'male') {
        bmr =
          mesurementSystem === 'metric'
            ? 66.5 + 13.76 * weight + 5.003 * height - 6.755 * age
            : 66 + 6.2 * weight + 12.7 * height - 6.76 * age;
      } else {
        bmr =
          mesurementSystem === 'metric'
            ? 655 + 9.563 * weight + 1.85 * height - 4.676 * age
            : 655 + 4.35 * weight + 4.7 * height - 4.7 * age;
      }
    } else if (formula === formulas[1]) {
      if (gender === 'male') {
        bmr =
          mesurementSystem === 'metric'
            ? 10 * weight + 6.25 * height - 5 * age + 5
            : (10 / 2.205) * weight + 6.25 * 2.54 * height - 5 * age + 5;
      } else {
        bmr =
          mesurementSystem === 'metric'
            ? 10 * weight + 6.25 * height - 5 * age - 161
            : (10 / 2.205) * weight + 6.25 * 2.54 * height - 5 * age - 161;
      }
    } else if (formula === formulas[2]) {
      if (gender === 'male') {
        bmr =
          mesurementSystem === 'metric'
            ? 88.362 + 13.397 * weight + 4.799 * height - 5.677 * age
            : 88.362 + (13.397 / 2.205) * weight + 4.799 * 2.54 * height - 5.677 * age;
      } else {
        bmr =
          mesurementSystem === 'metric'
            ? 447.593 + 9.247 * weight + 3.098 * height - 4.33 * age
            : 447.593 + (9.247 / 2.205) * weight + 3.098 * 2.54 * height - 4.33 * age;
      }
    }
    bmr = bmr < 0 ? 0 : bmr;
    setBmr(bmr);
    setDailykcal(bmr * activity);
  };

  return (
    <div className='card-container' data-card-id='bmr' draggable>
      <div className='masked-borders'></div>
      <UnlockCard title='BMR' dependencies={['gender', 'age', 'weight', 'height', 'activity']} />
      <MethodInfo
        title='BMR Method'
        text={`Your BMR (Basal Metabolic Rate) is energy used while at rest. Three equations are used for finding BMR: The original Harris–Benedict equations published in 1918 and 1919, The Harris–Benedict equations revised by Roza and Shizgal in 1984 and The Harris–Benedict equations revised by Mifflin and St Jeor in 1990. You can switch between equations from the drop-down.`}
      />
      <div className='card-contents'>
        <h3 className='card-title'>BMR</h3>
        <h3 className='card-select-title'>Choose BMR Method:</h3>
        <select className='card-select' value={formula} onChange={e => setFormula(e.target.value)}>
          {formulas.map((e, i) => (
            <option key={e + i} value={e}>
              {e}
            </option>
          ))}
        </select>
        <h3 className='card-result-title'>Your Basal Metabolic Rate</h3>
        <h3 className='card-result-number'>
          {['Infinity', 'NaN'].includes(bmr.toFixed(0)) ? 0 : bmr.toFixed(0)}
          <span className='card-result-unit'> kcal/day</span>
        </h3>
        <h3 className='card-result-title' style={{ lineHeight: '35px', marginBottom: '10px' }}>
          Daily Calorie Intake <br />
          <span>( Based on your activity )</span>
        </h3>

        <h3 className='card-result-number'>
          {['Infinity', 'NaN'].includes(dailykcal.toFixed(0)) ? 0 : dailykcal.toFixed(0)}
          <span className='card-result-unit'> kcal/day</span>
        </h3>
      </div>
    </div>
  );
}
