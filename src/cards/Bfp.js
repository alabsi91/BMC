/* eslint-disable default-case */
import { useCallback, useContext, useEffect, useState } from 'react';
import { Ctx } from '../App';
import MethodInfo from '../MethodInfo';
import UnlockCard from '../UnlockCard';

export default function Bfp() {
  const ctx = useContext(Ctx);

  const [results, setResults] = useState({});

  useEffect(() => {
    calculateBfp();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ctx.data]);

  const calculateBfp = useCallback(() => {
    const { height, weight, age, mesurementSystem, gender, neck, waist, hip } = ctx.data;
    let bfp, bfpFM, bfpLM, bfpBmi, bfpRange;

    let bmi = mesurementSystem === 'metric' ? weight / Math.pow(height / 100, 2) : (703 * weight) / Math.pow(height, 2);

    switch (mesurementSystem) {
      case 'metric':
        if (gender === 'male') {
          bfp = 495 / (1.0324 - 0.19077 * Math.log10(waist - neck) + 0.15456 * Math.log10(height)) - 450;
          bfpFM = (bfp / 100) * weight;
          bfpLM = weight - bfpFM;
        } else if (gender === 'female') {
          bfp = 495 / (1.29579 - 0.35004 * Math.log10(waist + hip - neck) + 0.221 * Math.log10(height)) - 450;
          bfpFM = (bfp / 100) * weight;
          bfpLM = weight - bfpFM;
        }
        break;
      case 'imperial':
        if (gender === 'male') {
          bfp = 86.01 * Math.log10(waist - neck) - 70.041 * Math.log10(height) + 36.76;
          bfpFM = (bfp / 100) * weight;
          bfpLM = weight - bfpFM;
        } else if (gender === 'female') {
          bfp = 163.205 * Math.log10(waist + hip - neck) - 97.684 * Math.log10(height) - 78.387;
          bfpFM = (bfp / 100) * weight;
          bfpLM = weight - bfpFM;
        }
        break;
    }

    bfpBmi = gender === 'male' ? 1.2 * bmi + 0.23 * age - 16.2 : 1.2 * bmi + 0.23 * age - 5.4;

    switch (gender) {
      case 'male':
        if (bfp >= 2 && bfp <= 5) {
          bfpRange = 'Essential Fat';
        } else if (bfp > 5 && bfp <= 13) {
          bfpRange = 'Athletes';
        } else if (bfp > 13 && bfp <= 17) {
          bfpRange = 'Fitness';
        } else if (bfp > 17 && bfp <= 25) {
          bfpRange = 'Average';
        } else if (bfp > 25) {
          bfpRange = 'Obese';
        } else {
          bfpRange = '...';
        }
        break;
      case 'female':
        if (bfp >= 10 && bfp <= 13) {
          bfpRange = 'Essential Fat';
        } else if (bfp > 13 && bfp <= 20) {
          bfpRange = 'Athletes';
        } else if (bfp > 20 && bfp <= 24) {
          bfpRange = 'Fitness';
        } else if (bfp > 24 && bfp <= 31) {
          bfpRange = 'Average';
        } else if (bfp > 32) {
          bfpRange = 'Obese';
        } else {
          bfpRange = '...';
        }
        break;
    }
    bfp = bfp < 0 ? 0 : bfp;
    bfpFM = bfpFM < 0 ? 0 : bfpFM;
    bfpLM = bfpLM < 0 ? 0 : bfpLM;
    bfpBmi = bfpBmi < 0 ? 0 : bfpBmi;
    setResults({ bfp, bfpFM, bfpLM, bfpBmi, bfpRange });
  }, [ctx.data]);

  return (
    <div className='card-container' data-card-id='bfp' draggable>
      <div className='masked-borders'></div>
      <UnlockCard title='BFP' dependencies={['gender', 'age', 'height', 'weight', 'neck', 'waist', 'hip']} />
      <MethodInfo
        title='BFP Method'
        text='In scientific terms, body fat is known as “adipose tissue,” which includes essential body fat and storage body fat. Essential body fat is responsible for maintaining life and reproductive functions, whereas storage fat is fat that accumulates in adipose tissue. While some storage fat is good, excess of storage fat can lead to serious health implications. The body fat accumulation rate varies from person to person, depending on various genetic and behavioral factors, including exercise and food intake. Due to varying factors, losing body fat can be difficult for some people. However, managing diet and exercise can help reducing fat. Both men and women store body fat differently. After the age of 40 (or after menopause in women), reduced sexual hormones can result in excess body fat around the stomach in men or thighs and buttocks in women.'
      />
      <div className='card-contents'>
        <h3 className='card-title'>BFP</h3>

        <h3 className='card-result-title'>Body Fat (U.S. Navy Method)</h3>
        <h3 className='card-result-number'>
          {['Infinity', 'NaN'].includes(results?.bfp?.toFixed(1)) ? 0 : +results?.bfp?.toFixed(1)}
          <span className='card-result-unit'> %</span>
        </h3>

        <h3 className='card-result-title'>Body Fat Category</h3>
        <h3 className='card-result-range'>{results?.bfpRange}</h3>

        <h3 className='card-result-title'>Body Fat Mass</h3>
        <h3 className='card-result-number'>
          {['Infinity', 'NaN'].includes(results?.bfpFM?.toFixed(1)) ? 0 : +results?.bfpFM?.toFixed(1)}
          <span className='card-result-unit'>{ctx.data.mesurementSystem === 'metric' ? ' Kilograms' : ' Pounds'}</span>
        </h3>

        <h3 className='card-result-title'>Lean Body Mass</h3>
        <h3 className='card-result-number'>
          {['Infinity', 'NaN'].includes(results?.bfpLM?.toFixed(1)) ? 0 : +results?.bfpLM?.toFixed(1)}
          <span className='card-result-unit'>{ctx.data.mesurementSystem === 'metric' ? ' Kilograms' : ' Pounds'}</span>
        </h3>

        <h3 className='card-result-title'>Body Fat (BMI method)</h3>
        <h3 className='card-result-number'>
          {['Infinity', 'NaN'].includes(results?.bfpBmi?.toFixed(1)) ? 0 : +results?.bfpBmi?.toFixed(1)}
          <span className='card-result-unit'> %</span>
        </h3>
      </div>
    </div>
  );
}
