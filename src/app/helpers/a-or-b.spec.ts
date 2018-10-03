import { AOrB } from './a-or-b';

describe('AOrB', () => {
  let a;
  let b;
  let aOrB: AOrB<any>;

  beforeEach(() => {
    a = {};
    b = {};
    aOrB = new AOrB(a, b);
  });

  it('should start with A as the current, and B as the other', () => {
    expect(aOrB.current).toBe(a);
    expect(aOrB.other).toBe(b);
  });

  it('should swap A with B', () => {
    aOrB.switch();

    expect(aOrB.current).toBe(b);
    expect(aOrB.other).toBe(a);
  });

  it('should tell if current is A', () => {
    expect(aOrB.isA()).toBe(true);

    aOrB.switch();

    expect(aOrB.isA()).toBe(false);
  });
});
