import { jest } from '@jest/globals';

import { getRandomElement } from '../src/utils/getRandomElement';

describe('getRandomElement', () => {
  describe('when Math.random() returns 0', () => {
    it('should return the first element', () => {
      jest.spyOn(global.Math, 'random').mockReturnValue(0);

      const elements = [1, 2, 3, 4, 5];
      const randomElement = getRandomElement(elements);

      expect(randomElement).toBe(1);

      jest.spyOn(global.Math, 'random').mockRestore();
    });
  });

  describe('when Math.random() returns a number strictly between 0 and 1', () => {
    it('should return intermediate element', () => {
      jest.spyOn(global.Math, 'random').mockReturnValue(0.5);

      const elements = [1, 2, 3, 4, 5];
      const randomElement = getRandomElement(elements);

      expect(randomElement).toBe(3);

      jest.spyOn(global.Math, 'random').mockRestore();
    });
  });

  describe('when Math.random() returns a number close to 1', () => {
    it('should return the last element', () => {
      jest.spyOn(global.Math, 'random').mockReturnValue(1 - Number.EPSILON);

      const elements = [1, 2, 3, 4, 5];
      const randomElement = getRandomElement(elements);

      expect(randomElement).toBe(5);

      jest.spyOn(global.Math, 'random').mockRestore();
    });
  });
});
