import * as TWEEN from '@tweenjs/tween.js';
import { CrossFade } from './cross-fade';

describe('CrossTween', () => {
  it('should decrease the volume of a and increase those of b', () => {
    TWEEN.update(0);
    const a = { volume: 0.9 };
    const b = { volume: 0.1 };

    new CrossFade({ a, b, duration: 8000 }).start();

    TWEEN.update(2000);

    expect(a.volume < 0.9).toBe(true);
    expect(b.volume > 0.1).toBe(true);
  });

  it('should be able to stop the tweening', () => {
    TWEEN.update(0);
    const a = { volume: 0.9 };
    const b = { volume: 0.1 };

    const tween = new CrossFade({ a, b, duration: 8000 }).start();
    TWEEN.update(2000);
    const aVolume = a.volume;
    const bVolume = b.volume;
    tween.stop();
    TWEEN.update(4000);

    expect(a.volume).toBe(aVolume);
    expect(b.volume).toBe(bVolume);
  });
});
