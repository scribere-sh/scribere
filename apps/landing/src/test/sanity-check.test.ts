import { describe, expect, test } from 'vitest';

describe('Sanity Check', () => {
    test('add numbers correctly', () => {
        const additionOfNumbers = 1 + 1;
        const expectedResult = 2;

        console.log({
            expected: expectedResult,
            actual: additionOfNumbers
        });
        expect(additionOfNumbers).toEqual(expectedResult);
    });

    test.fails('follow the laws of mathematics', () => {
        const additionOfNumbers = 1 + 1;
        const expectedResultNotEqual = 3;

        console.log({
            expectedToNotEqual: expectedResultNotEqual,
            actual: additionOfNumbers
        });
        expect(additionOfNumbers).toEqual(expectedResultNotEqual);
    });
});
