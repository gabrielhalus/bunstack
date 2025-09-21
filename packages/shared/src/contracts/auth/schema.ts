import { z } from "zod";

export const loginSchema = z.object({
  email: z.string({ required_error: "email_required" }).email({ message: "email_invalid" }),
  password: z.string({ required_error: "password_required" }),
});
