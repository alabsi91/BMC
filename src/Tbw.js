import { useCallback, useContext, useEffect, useState } from 'react';
import { Ctx } from './App';
import MethodInfo from './MethodInfo';
import UnlockCard from './UnlockCard';

export default function Tbw() {
  const ctx = useContext(Ctx);

  const [tbw, setTbw] = useState(0);

  useEffect(() => {
    calculateTbw();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ctx.data.height, ctx.data.weight, ctx.data.gender, ctx.data.age, ctx.data.mesurementSystem]);

  const calculateTbw = useCallback(() => {
    const { height, weight, gender, age, mesurementSystem } = ctx.data;
    const isMale = gender === 'male';
    let tbw;
    if (mesurementSystem === 'metric') {
      tbw = isMale ? 2.447 - 0.09156 * age + 0.1074 * height + 0.3362 * weight : -2.097 + 0.1069 * height + 0.2466 * weight;
    } else {
      let heightCM = height * 2.54;
      let weightKG = weight / 2.205;
      tbw = isMale
        ? 2.447 - 0.09156 * age + 0.1074 * heightCM + 0.3362 * weightKG
        : -2.097 + 0.1069 * heightCM + 0.2466 * weightKG;
    }
    setTbw(tbw);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ctx.data.height, ctx.data.weight, ctx.data.gender, ctx.data.age, ctx.data.mesurementSystem]);

  return (
    <div className='card-container' data-card-id='tbw' draggable>
      <div className='masked-borders'></div>
      <UnlockCard title='TBW' dependencies={['gender', 'age', 'height', 'weight']} />
      <MethodInfo
        title='TBW Method'
        text='This total body water calculator uses your age, height, weight, and sex to estimate the volume of water in your body. It is based on a formula developed by dr. P.E. Watson and his team and described in 1980.'
      />
      <div className='card-contents'>
        <h3 className='card-title'>TBW</h3>
        <h3 className='card-result-title'>Your Total Body Water</h3>
        <h3 className='card-result-number'>
          {['Infinity', 'NaN'].includes(tbw.toFixed(1)) ? 0 : +tbw.toFixed(1)}
          <span className='card-result-unit'> Litres</span>
        </h3>
      </div>
    </div>
  );
}
