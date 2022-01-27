import { useCallback, useContext, useEffect, useState } from 'react';
import { Ctx } from '../App';
import MethodInfo from '../MethodInfo';
import UnlockCard from '../UnlockCard';

const formulas = [
  'The Borca Index',
  'The Davine Formula',
  'Robinson Formula',
  'The Miller Formula',
  'The Hamwi Formula',
  'Lemmens Formula',
];

export default function Ibw() {
  const ctx = useContext(Ctx);

  const [ibw, setIbw] = useState(0);
  const [formula, setFormula] = useState(formulas[0]);

  useEffect(() => {
    calculateIbw();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ctx.data.height, ctx.data.mesurementSystem, ctx.data.gender, formula]);

  const calculateIbw = useCallback(() => {
    const { height, mesurementSystem, gender } = ctx.data;
    const isMetric = mesurementSystem === 'metric';
    let ibw;

    if (formula === 'The Borca Index') {
      const impHeight = height * 2.54;
      if (gender === 'male') {
        ibw = isMetric ? height - 100 - (height - 100) * 0.1 : (impHeight - 100 - (impHeight - 100) * 0.1) * 2.205;
      } else {
        ibw = isMetric ? height - 100 + (height - 100) * 0.15 : (impHeight - 100 + (impHeight - 100) * 0.15) * 2.205;
      }
    } else if (formula === 'The Davine Formula') {
      if (gender === 'male') {
        ibw = isMetric ? 50 + (height / 2.54 - 60) * 2.3 : (50 + (height - 60) * 2.3) * 2.205;
      } else {
        ibw = isMetric ? 45.5 + (height / 2.54 - 60) * 2.3 : (45.5 + (height - 60) * 2.3) * 2.205;
      }
    } else if (formula === 'Robinson Formula') {
      if (gender === 'male') {
        ibw = isMetric ? 52 + (height / 2.54 - 60) * 1.9 : (52 + (height - 60) * 1.9) * 2.205;
      } else {
        ibw = isMetric ? 49 + (height / 2.54 - 60) * 1.7 : (49 + (height - 60) * 1.7) * 2.205;
      }
    } else if (formula === 'The Miller Formula') {
      if (gender === 'male') {
        ibw = isMetric ? 56.2 + (height / 2.54 - 60) * 1.41 : (56.2 + (height - 60) * 1.41) * 2.205;
      } else {
        ibw = isMetric ? 53.1 + (height / 2.54 - 60) * 1.36 : (53.1 + (height - 60) * 1.36) * 2.205;
      }
    } else if (formula === 'The Hamwi Formula') {
      if (gender === 'male') {
        ibw = isMetric ? 48 + (height / 2.54 - 60) * 2.7 : (48 + (height - 60) * 2.7) * 2.205;
      } else if (mesurementSystem === 'imperial') {
        ibw = isMetric ? 45.5 + (height / 2.54 - 60) * 2.2 : (45.5 + (height - 60) * 2.2) * 2.205;
      }
    } else if (formula === 'Lemmens Formula') {
      ibw = isMetric ? 22 * Math.pow(height / 100, 2) : 22 * Math.pow(height / 39.37, 2) * 2.205;
    }

    ibw = ibw < 0 ? 0 : ibw;
    setIbw(ibw);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ctx.data.height, ctx.data.mesurementSystem, ctx.data.gender, formula]);

  return (
    <div className='card-container' data-card-id='ibw' draggable>
      <div className='masked-borders'></div>
      <UnlockCard title='IBW' dependencies={['gender', 'height']} />
      <MethodInfo
        title='IBW Method'
        text='The IBW (Ideal Body Weight) indicates the ideal bodyweight based on your gender and height. Different formulas are used for the calculation of IBW. You can change the formula selection from the drop-down menu.'
      />
      <div className='card-contents'>
        <h3 className='card-title'>IBW</h3>
        <h3 className='card-select-title'>Choose IBW Method:</h3>
        <select className='card-select' value={formula} onChange={e => setFormula(e.target.value)}>
          {formulas.map((e, i) => (
            <option key={e + i} value={e}>
              {e}
            </option>
          ))}
        </select>
        <h3 className='card-result-title'>Your Basal Metabolic Rate</h3>
        <h3 className='card-result-number'>
          {['Infinity', 'NaN'].includes(ibw.toFixed(0)) ? 0 : ibw.toFixed(0)}
          <span className='card-result-unit'>{ctx.data.mesurementSystem === 'metric' ? ' Kilograms' : ' Pounds'}</span>
        </h3>
      </div>
    </div>
  );
}
