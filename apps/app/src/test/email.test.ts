import { describe, test, expect } from 'vitest';

import { createUser } from "$auth/user";
import { insertEmailAddress } from "$auth/email";

import { TestDB } from '$db/test';
import { usersTable, emailAddressTable } from "$db/tables";
import { eq } from 'drizzle-orm';


describe('Email Validation', () => {
    test("Email Address assigned to user should create records", async () => {
        const testDB = await TestDB();

        const testUser = {
            displayName: "Test Display Name",
            handle: "test_handle"
        }

        const testEmailAddress = 'testEmail@test.com'

        const testUserInserted = await createUser(testDB, testUser);
        await insertEmailAddress(testDB, testEmailAddress, testUserInserted.id);

        const [[userQuery], [emailQuery]] = await testDB.batch([
            testDB.select().from(usersTable).where(eq(usersTable.id, testUserInserted.id)),
            testDB.select().from(emailAddressTable).where(eq(emailAddressTable.userId, testUserInserted.id))
        ]);

        const expectedUserValue = {
            id: testUserInserted.id,
            ...testUser
        };
        const userQueryExceptDate = {
            ...userQuery,
            createdAt: undefined
        }

        expect(userQueryExceptDate).toEqual(expectedUserValue);

        const expectedEmailValue = {
            userId: testUserInserted.id,
            emailAddress: testEmailAddress,
            isValidated: false,
            challengeRef: null
        };

        expect(emailQuery).toEqual(expectedEmailValue);
    });
});
