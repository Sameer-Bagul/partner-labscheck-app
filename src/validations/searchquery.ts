// /validations/searchquery.ts
import * as z from 'zod';

export const searchQuerySchema = z.object({
  searchquery: z.string().min(2, 'Please enter at least 2 characters'),
  pincode: z
    .string()
    .optional()
    .refine((val) => !val || /^[0-9]{6}$/.test(val), {
      message: 'Pincode must be a 6-digit number',
    }),
});
