import { createInsertSchema } from "drizzle-zod";
import { Users } from "../db/schemas/users"
import { z } from "zod";

export type User = typeof Users.$inferSelect;

export type UserUniqueFields = Pick<User, "id" | "email">;

export const insertUserSchema = createInsertSchema(Users, {
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters long" })
    .max(20, { message: "Name must be less than 20 characters long" }),
  email: z.string().email({ message: "Invalid email address" }).transform(val => val.toLowerCase()),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).+$/, {
      message:
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    }),
});
