import { Random } from './random';

describe('Random', () => {
  describe('randIntExclusive', () => {
    it('should return middle number when random = 0.5', () => {
      spyOn(Math, 'random').and.returnValue(0.5);

      const randInt = Random.randIntExclusive(2, 6);

      expect(randInt).toBe(4);
    });

    it('should return start number when random = 0', () => {
      spyOn(Math, 'random').and.returnValue(0);

      const randInt = Random.randIntExclusive(2, 6);

      expect(randInt).toBe(2);
    });

    it('should return end - 1 when random = 0.99', () => {
      spyOn(Math, 'random').and.returnValue(0.99);

      const randInt = Random.randIntExclusive(2, 6);

      expect(randInt).toBe(5);
    });

    it('should be uniformly distributed', () => {
      spyOn(Math, 'random');
      const randomSpy = <any>Math.random;

      for (let i = 0; i < 10; i++) {
        randomSpy.and.returnValue(i / 10);
        const randInt = Random.randIntExclusive(0, 10);
        expect(randInt).toBe(i);
      }
    });
  });
});
