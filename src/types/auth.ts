
import * as z from "zod";
import { EmailOnlySchema, formChangePasswordSchema, ResetPasswordSchema, signInSchema, signUpSchema } from "@/validations/auth";


export type EmailOnlyData = z.infer<typeof EmailOnlySchema>;
export type ResetPasswordData = z.infer<typeof ResetPasswordSchema>;

export type VerifyOTPData = {
  email: string;
  otp: string;
};

export type GenerateOTPData = {
  email: string;
  name?: string;
};

export type GeneratePhoneOTPData = {
  phone_number: string;
};

export type VerifyPhoneOTPData = {
  phone_number: string;
  otp: string;
};


export type ResetPasswordRequest = ResetPasswordData & {
  email: string;
  otp: string;
};


export type User = {
  id: number | null;
  name: string;
  email: string;
  phoneNo: string | null;
  role: string;
  is_active: boolean;
  user_type: string;
}

export type checkUserAuthType={
  user: User | null;
  message?: string | null;
  isAuthenticated?: boolean;
}


export interface AuthResponse {
  user: User | null;
  isAuthenticated: boolean;
  message?: string;
}

export type FormSignUpData = z.infer<typeof signUpSchema>;
export type FormSignInData = z.infer<typeof signInSchema>;




export type ChangePasswordSchemaType = z.infer<typeof formChangePasswordSchema>;