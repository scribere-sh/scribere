import { eq } from 'drizzle-orm';
import { describe, expect, test } from 'vitest';

import { insertEmailAddress } from '$auth/email';
import { createUser } from '$auth/user';

import { emailAddressTable, usersTable } from '$db/tables';
import { TestDB } from '$db/test';

describe('Email Validation', () => {
    test('Email Address assigned to user should create records', async () => {
        const testDB = await TestDB();

        const testUser = {
            displayName: 'Test Display Name',
            handle: 'test_handle'
        };

        const testEmailAddress = 'testEmail@test.com';

        const testUserInserted = await createUser(testDB, testUser);
        await insertEmailAddress(testDB, testEmailAddress, testUserInserted.id);

        const [[userQuery], [emailQuery]] = await testDB.batch([
            testDB.select().from(usersTable).where(eq(usersTable.id, testUserInserted.id)),
            testDB
                .select()
                .from(emailAddressTable)
                .where(eq(emailAddressTable.userId, testUserInserted.id))
        ]);

        const expectedUserValue = {
            id: testUserInserted.id,
            ...testUser
        };
        const userQueryExceptDate = {
            ...userQuery,
            createdAt: undefined
        };

        console.log({ expectedUserValue });
        expect(userQueryExceptDate).toEqual(expectedUserValue);

        const expectedEmailValue = {
            userId: testUserInserted.id,
            emailAddress: testEmailAddress,
            isValidated: false,
            challengeRef: null
        };

        console.log({ expectedEmailValue });
        expect(emailQuery).toEqual(expectedEmailValue);
    });
});
