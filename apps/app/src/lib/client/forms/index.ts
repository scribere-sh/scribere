import { displayNameSchema, handleSchema, passwordSchema } from './parts';
import { z } from 'zod';

export const logInFormSchema = z.object({
    handleOrEmail: z.string().max(32),
    password: passwordSchema
});

export type LoginFormSchema = typeof logInFormSchema;

export const signupFormSchema = z.object({
    displayName: displayNameSchema,
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

export const resetPasswordAccountSettingsSchema = z.object({
    currentPassword: passwordSchema,
    newPassword: passwordSchema,
    confirmNewPassword: passwordSchema
});

export type ResetPasswordAccountSettingsSchema = typeof resetPasswordAccountSettingsSchema;
