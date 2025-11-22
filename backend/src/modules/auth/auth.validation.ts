import { z } from "zod";

const PasswordSchema = z
  .string()
  .min(8)
  .regex(/^(?=.*[A-Za-z])(?=.*\\d).+$/, "Password must contain at least one letter and one number");

export const RegisterSchema = z.object({
  tenantName: z.string().trim().min(1),
  email: z.string().trim().toLowerCase().email(),
  password: PasswordSchema,
  firstName: z.string().trim().min(1),
  lastName: z.string().trim().min(1),
});

export const LoginSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(1),
});

export const ForgotPasswordSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
});

export const ResetPasswordSchema = z.object({
  token: z.string().trim().min(32),
  password: PasswordSchema,
});

export const ResendVerificationSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
});

export const VerifyEmailSchema = z.object({
  token: z.string().trim().min(10),
});
