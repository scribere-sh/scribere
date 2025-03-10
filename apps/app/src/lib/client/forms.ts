import { z } from 'zod';

const handleSchema = z
	.string()
	.regex(/^[a-z0-9.-]+$/)
	.nonempty()
	.max(32);

export const logInFormSchema = z.object({
	handleOrEmail: z.string().max(32),
	password: z
		.string()
		.min(8, 'Must contain at least 8 characters')
		// literally only add this to prevent idiots
		//
		// hense why the amount is so high
		.max(300, 'Must contain no more than 300 characters')
});

export const signupFormSchema = z.object({
	displayName: z.string().nonempty().max(60),
	handle: handleSchema,
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
export type MFAFormSchema = typeof mfaFormSchema;
