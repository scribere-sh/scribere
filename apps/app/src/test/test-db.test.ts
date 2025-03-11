import { TestDB } from '$db/test';
import { describe, test, expect } from 'vitest';

describe('Test Database', () => {
    test('Initialise', async () => {
        const testDB = TestDB();
        await expect(testDB).resolves.not.toThrow();
    })
})
