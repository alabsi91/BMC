import { useCallback, useContext, useEffect, useState } from 'react';
import { Ctx } from '../App';
import MethodInfo from '../MethodInfo';
import UnlockCard from '../UnlockCard';

const formulas = ['The Boer Formula', 'The James Formula', 'The Hume Formula'];
export default function Lbm() {
  const ctx = useContext(Ctx);

  const [lbm, setLbm] = useState(0);
  const [lbmF, setLbmF] = useState(0);
  const [lbmP, setLbmP] = useState(0);
  const [formula, setFormula] = useState(formulas[0]);

  useEffect(() => {
    calculateLbm();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ctx.data.height, ctx.data.waist, ctx.data.gender, ctx.data.mesurementSystem, formula]);

  const calculateLbm = useCallback(() => {
    const { height, weight, gender, mesurementSystem } = ctx.data;
    const isMale = gender === 'male';
    let lbm, lbmP, lbmF;

    if (formula === 'The Boer Formula') {
      if (mesurementSystem === 'metric') {
        lbm = isMale ? 0.407 * weight + 0.267 * height - 19.2 : 0.252 * weight + 0.473 * height - 48.3;
        lbmP = (lbm * 100) / weight;
      } else {
        lbm = isMale
          ? (0.407 * (weight / 2.205) + 0.267 * (height * 2.54) - 19.2) * 2.205
          : (0.252 * (weight / 2.205) + 0.473 * (height * 2.54) - 48.3) * 2.205;
        lbmP = (lbm * 100) / weight;
      }
      lbmF = 100 - lbmP;
    } else if (formula === 'The James Formula') {
      if (mesurementSystem === 'metric') {
        lbm = isMale ? 1.1 * weight - 128 * Math.pow(weight / height, 2) : 1.07 * weight - 148 * Math.pow(weight / height, 2);
        lbmP = (lbm * 100) / weight;
      } else {
        lbm = isMale
          ? (1.1 * (weight / 2.205) - 128 * Math.pow(weight / 2.205 / (height * 2.54), 2)) * 2.205
          : (1.07 * (weight / 2.205) - 148 * Math.pow(weight / 2.205 / (height * 2.54), 2)) * 2.205;
        lbmP = (lbm * 100) / weight;
      }
      lbmF = 100 - lbmP;
    } else if (formula === 'The Hume Formula') {
      if (mesurementSystem === 'metric') {
        lbm = isMale ? 0.3281 * weight + 0.33929 * height - 29.5336 : 0.29569 * weight + 0.41813 * height - 43.2933;

        lbmP = (lbm * 100) / weight;
      } else {
        lbm = isMale
          ? (0.3281 * (weight / 2.205) + 0.33929 * (height * 2.54) - 29.5336) * 2.205
          : (0.29569 * (weight / 2.205) + 0.41813 * (height * 2.54) - 43.2933) * 2.205;

        lbmP = (lbm * 100) / weight;
      }
      lbmF = 100 - lbmP;
    }

    lbm = lbm < 0 ? 0 : lbm;
    lbmP = lbmP < 0 ? 0 : lbmP;
    lbmF = lbmF < 0 ? 0 : lbmF;

    setLbm(lbm);
    setLbmF(lbmF);
    setLbmP(lbmP);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ctx.data.height, ctx.data.waist, ctx.data.gender, ctx.data.mesurementSystem, formula]);

  return (
    <div className='card-container' data-card-id='lbm' draggable>
      <div className='masked-borders'></div>
      <UnlockCard title='LBM' dependencies={['gender', 'height', 'weight']} />
      <MethodInfo
        title='LBM Method'
        text="The Lean Body Mass Calculator computes a person's estimated lean body mass (LBM) based on body weight, height, gender, and age. For comparison purposes, the calculator provides the results of multiple formulas."
      />
      <div className='card-contents'>
        <h3 className='card-title'>LBM</h3>

        <h3 className='card-select-title'>Choose LBM Method:</h3>
        <select className='card-select' value={formula} onChange={e => setFormula(e.target.value)}>
          {formulas.map((e, i) => (
            <option key={e + i} value={e}>
              {e}
            </option>
          ))}
        </select>

        <h3 className='card-result-title'>Lean Body Mass</h3>
        <h3 className='card-result-number'>
          {['Infinity', 'NaN'].includes(lbm.toFixed(1)) ? 0 : +lbm.toFixed(1)}
          <span className='card-result-unit'>{ctx.data.mesurementSystem === 'metric' ? ' Kilograms' : ' Pounds'}</span>
        </h3>

        <h3 className='card-result-title'>Lean Body Mass Percentage</h3>
        <h3 className='card-result-number'>
          {['Infinity', 'NaN'].includes(lbmP.toFixed(1)) ? 0 : +lbmP.toFixed(1)}
          <span className='card-result-unit'> %</span>
        </h3>

        <h3 className='card-result-title'>Body Fat Percentage</h3>
        <h3 className='card-result-number'>
          {['Infinity', 'NaN'].includes(lbmF.toFixed(1)) ? 0 : +lbmF.toFixed(1)}
          <span className='card-result-unit'> %</span>
        </h3>
      </div>
    </div>
  );
}
