import { z } from 'zod';

export const handleSchema = z
    .string()
    .regex(/^[a-z0-9.-]+$/, 'Invalid Handle')
    .nonempty()
    .max(32);

export const passwordSchema = z
    .string()
    .min(8, 'Must contain at least 8 characters')
    // literally only add this to prevent idiots
    //
    // hense why the amount is so high
    .max(255, 'Must contain no more than 255 characters');

export const displayNameSchema = z.string().nonempty().max(60);
