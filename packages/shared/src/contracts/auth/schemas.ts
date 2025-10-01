import { z } from "zod";

export const passwordSchema = z
  .string()
  .min(8, "minLengthErrorMessage")
  .regex(/[A-Z]/, "uppercaseErrorMessage")
  .regex(/[a-z]/, "lowercaseErrorMessage")
  .regex(/\d/, "numberErrorMessage")
  .regex(/[!@#$%^&*()\-=+[\]{};:'",.<>/?\\|`]/, "specialCharacterErrorMessage");

export const registerInputSchema = z.object({
  name: z.string().min(1, "requiredErrorMessage").min(3, "minLengthErrorMessage").max(20, "maxLengthErrorMessage"),
  email: z.email("invalidErrorMessage").toLowerCase(),
  password: passwordSchema,
});

export const loginInputSchema = z.object({
  email: z.email("invalidErrorMessage").toLowerCase(),
  password: z.string().min(1, "requiredErrorMessage"),
});

export const verifyAccountSchema = z.object({
  token: z.string(),
});
