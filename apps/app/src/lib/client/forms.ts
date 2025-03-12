import { z } from 'zod';

const handleSchema = z
    .string()
    .regex(/^[a-z0-9.-]+$/)
    .nonempty()
    .max(32);

const passwordSchema = z
    .string()
    .min(8, 'Must contain at least 8 characters')
    // literally only add this to prevent idiots
    //
    // hense why the amount is so high
    .max(255, 'Must contain no more than 255 characters');

export const logInFormSchema = z.object({
    handleOrEmail: z.string().max(32),
    password: passwordSchema
});

export type LoginFormSchema = typeof logInFormSchema;

export const signupFormSchema = z.object({
    displayName: z.string().nonempty().max(60),
    handle: handleSchema,
    emailAddress: z.string().email().max(255),
    password: passwordSchema,
    passwordConfirm: passwordSchema
});

export type SignupFormSchema = typeof signupFormSchema;

export const mfaFormSchema = z.object({
    mfa: z.string().optional(),
    recoveryCode: z.string().optional()
});

export type MFAFormSchema = typeof mfaFormSchema;

export const mfaEnrollmentFormSchema = z.object({
    challenge: z.string().nonempty().max(255),
    mfa: z.string().length(6)
});

export type MFAEnrollmentFormSchema = typeof mfaEnrollmentFormSchema;

export const forgotPasswordFormSchema = z.object({
    email: z.string().email().max(255)
});

export type ForgotPasswordFormSchema = typeof forgotPasswordFormSchema;

export const resetPasswordFormSchema = z.object({
    challengeRef: z.string().max(255),
    challengeToken: z.string().max(255),
    newPassword: passwordSchema,
    newPasswordConfirm: passwordSchema
});

export type ResetPasswordFormSchema = typeof resetPasswordFormSchema;
