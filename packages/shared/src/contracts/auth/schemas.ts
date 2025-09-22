import { z } from "zod";

const passwordSchema = z
  .string()
  .min(8, { message: "minLengthErrorMessage" })
  .max(20, { message: "maxLengthErrorMessage" })
  .refine(password => /[A-Z]/.test(password), {
    message: "uppercaseErrorMessage",
  })
  .refine(password => /[a-z]/.test(password), {
    message: "lowercaseErrorMessage",
  })
  .refine(password => /\d/.test(password), { message: "numberErrorMessage" })
  .refine(password => /[!@#$%^&*]/.test(password), {
    message: "specialCharacterErrorMessage",
  });

export const registerInputSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: passwordSchema,
});

export const loginInputSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const availableSchema = z.object({
  email: z.string().email(),
});
