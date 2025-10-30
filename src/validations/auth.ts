import * as z from "zod";



export const signUpSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters.")
      .max(50, "Name must not exceed 50 characters."),

    phone: z
      .string()
      .trim()
      .regex(
        /^\+?[1-9]\d{7,14}$/,
        "Enter a valid phone number with country code (e.g. +14155552671)."
      ),

    email: z
      .string()
      .trim()
      .email("Invalid email address."),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters.")
      .max(16, "Password must be at most 16 characters.")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter.")
      .regex(/[a-z]/, "Must contain at least one lowercase letter.")
      .regex(/[0-9]/, "Must contain at least one number.")
      .regex(/[^A-Za-z0-9]/, "Must contain at least one special character."),

    confirmPassword: z
      .string()
      .min(8, "Password must be at least 8 characters.")
      .max(16, "Password must be at most 16 characters."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export const signInSchema = z
  .object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
  });



export const EmailOnlySchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),

});

export const ResetPasswordSchema = z
  .object({
    new_password: z.string().min(6, 'Password must be at least 6 characters'),
    confirm_password: z.string().min(6, 'Please confirm your password'),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Passwords don't match",
    path: ['confirm_password'],
  });






export const formChangePasswordSchema = z
  .object({
    old_password: z.string().min(1, 'Previous password is required'),
    new_password: z
      .string()
      .min(6, 'New password must be at least 6 characters'),
    confirm_password: z.string().min(1, 'Confirm password is required'),
    otp: z
      .string()
      .length(6, 'OTP must be exactly 6 digits')
      .regex(/^\d+$/, 'OTP must contain only numbers'),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Passwords don't match",
    path: ['confirm_password'],
  });