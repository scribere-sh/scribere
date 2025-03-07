import { z } from 'zod';

export const logInFormSchema = z.object({
	emailAddress: z.string().email(),
	password: z
		.string()
		.min(8, 'Must contain at least 8 characters')
		// literally only add this to prevent idiots
		//
		// hense why the amount is so high
		.max(300, 'Must contain no more than 300 characters')
});

export const signupFormSchema = z.object({
	givenName: z.string().nonempty().max(100),
	familyName: z.string().nonempty().max(100),
	emailAddress: z.string().email(),
	password: z
		.string()
		.min(8, 'Must contain at least 8 characters')
		// literally only add this to prevent idiots
		//
		// hense why the amount is so high
		.max(300, 'Must contain no more than 300 characters')
});

export const mfaFormSchema = z.object({
    mfa: z.string().length(6)
});

export const mfaEnrollmentFormSchema = z.object({
    challenge: z.string().nonempty(),
    mfa: z.string().length(6)
});

export type LoginFormSchema = typeof logInFormSchema;
export type SignupFormSchema = typeof signupFormSchema;
export type MFAFormSchema = typeof mfaFormSchema;;
