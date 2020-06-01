import { ensureArray } from './ensureArray';

it('should return an array if a non-array is passed', () => {
  const resultArray = ensureArray('test');
  expect(resultArray).toEqual(['test']);
});

it("should return an array if it's already of array type", () => {
  const resultArray = ensureArray(['test']);
  expect(resultArray).toEqual(['test']);
});
