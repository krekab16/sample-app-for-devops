const { fibonacci } = require('../src/app');

describe('fibonacci function', () => {
  test('should return 0 for n = 0', () => {
    expect(fibonacci(0)).toBe(0);
  });

  test('should return 1 for n = 1', () => {
    expect(fibonacci(1)).toBe(1);
  });

  test('should return the correct Fibonacci number for n = 10', () => {
    expect(fibonacci(10)).toBe(55);
  });

  test('should handle larger Fibonacci numbers', () => {
    expect(fibonacci(20)).toBe(6765);
  });

  test('should throw an error if n is not a number', () => {
    expect(() => fibonacci('a')).toThrow('The argument must be a non-negative integer');
  });

  test('should throw an error if n is negative', () => {
    expect(() => fibonacci(-5)).toThrow('The argument must be a non-negative integer');
  });

  test('should throw an error if n is not an integer', () => {
    expect(() => fibonacci(3.5)).toThrow('The argument must be a non-negative integer');
  });
});
