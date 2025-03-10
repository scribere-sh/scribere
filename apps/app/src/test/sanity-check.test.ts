import { describe, it, expect } from "vitest";

describe("Sanity Check", () => {
    it("should add numbers correctly", () => {
        const additionOfNumbers = 1 + 1;
        const expectedResult = 2;

        expect(additionOfNumbers).toEqual(expectedResult);
    });

    it("should follow the laws of mathematics", () => {
        const additionOfNumbers = 1 + 1;
        const expectedResultNotEqual = 3;

        expect(additionOfNumbers).not.toEqual(expectedResultNotEqual);
    });
});
