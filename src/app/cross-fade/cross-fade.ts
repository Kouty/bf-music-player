import * as TWEEN from '@tweenjs/tween.js';

export class CrossFade {
  private a;
  private b;
  private duration: number;
  private tween: any;

  constructor({ a, b, duration }) {
    this.a = a;
    this.b = b;
    this.duration = duration;
    this.tween = { stop: () => null };
  }

  start() {
    const toTween = { val: this.a.volume };
    this.tween = new TWEEN.Tween(toTween)
      .to({ val: 0 }, this.duration)
      .onUpdate(() => {
        this.a.volume = toTween.val;
        this.b.volume = 1 - toTween.val;
      })
      .start();

    return this;
  }

  stop() {
    this.tween.stop();
  }
}
