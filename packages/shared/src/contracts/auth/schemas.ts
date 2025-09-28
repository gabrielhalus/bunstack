import { z } from "zod";

export const passwordSchema = z
  .string()
  .min(8, { error: "minLengthErrorMessage" })
  .regex(/[A-Z]/, { error: "uppercaseErrorMessage" })
  .regex(/[a-z]/, { error: "lowercaseErrorMessage" })
  .regex(/\d/, { error: "numberErrorMessage" })
  .regex(/[!@#$%^&*()\-=+[\]{};:'",.<>/?\\|`]/, { error: "specialCharacterErrorMessage" });

export const registerInputSchema = z.object({
  name: z.string().min(1, { error: "requiredErrorMessage" }).min(3, { error: "minLengthErrorMessage" }).max(20, { error: "maxLengthErrorMessage" }),
  email: z.email({ error: "invalidErrorMessage" }).toLowerCase(),
  password: passwordSchema,
});

export const loginInputSchema = z.object({
  email: z.email({ error: "invalidErrorMessage" }).toLowerCase(),
  password: z.string().min(1, { error: "requiredErrorMessage" }),
});

export const availableSchema = z.object({
  email: z.email({ error: "invalidErrorMessage" }),
});
