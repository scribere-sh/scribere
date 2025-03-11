import { describe, expect, it } from 'vitest';

describe('Sanity Check', () => {
    it('should add numbers correctly', () => {
        const additionOfNumbers = 1 + 1;
        const expectedResult = 2;

        console.log({
            expected: expectedResult,
            actual: additionOfNumbers
        });
        expect(additionOfNumbers).toEqual(expectedResult);
    });

    it('should follow the laws of mathematics', () => {
        const additionOfNumbers = 1 + 1;
        const expectedResultNotEqual = 3;

        console.log({
            expectedToNotEqual: expectedResultNotEqual,
            actual: additionOfNumbers
        });
        expect(additionOfNumbers).not.toEqual(expectedResultNotEqual);
    });
});
