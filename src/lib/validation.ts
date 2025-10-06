import { z } from 'zod';

// Auth validation schemas
export const authSchema = z.object({
  email: z
    .string()
    .trim()
    .email({ message: 'Invalid email address' })
    .max(255, { message: 'Email must be less than 255 characters' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters' })
    .max(72, { message: 'Password must be less than 72 characters' }),
  name: z
    .string()
    .trim()
    .min(1, { message: 'Name is required' })
    .max(100, { message: 'Name must be less than 100 characters' })
    .optional()
});

// Session form validation schemas
export const sessionSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, { message: 'Title is required' })
    .max(200, { message: 'Title must be less than 200 characters' }),
  description: z
    .string()
    .trim()
    .min(1, { message: 'Description is required' })
    .max(2000, { message: 'Description must be less than 2000 characters' }),
  duration: z
    .number()
    .min(1, { message: 'Duration must be at least 1 minute' })
    .max(180, { message: 'Duration must be less than 180 minutes' })
});

// Profile validation schemas
export const profileSchema = z.object({
  displayName: z
    .string()
    .trim()
    .min(1, { message: 'Display name is required' })
    .max(50, { message: 'Display name must be less than 50 characters' })
});
