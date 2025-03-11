import { describe, expect, test } from 'vitest';

import { TestDB } from '$db/test';

describe('Test Database', () => {
    test('Initialise', async () => {
        console.time('DB Init');
        const testDB = TestDB();
        console.timeEnd('DB Init');
        await expect(testDB).resolves.not.toThrow();
    });
});
