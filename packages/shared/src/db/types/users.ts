import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

import type { Merge } from "../../types/utils";
import type { Role } from "./roles";

import { Users } from "../schemas/users";

export type User = Merge<typeof Users.$inferSelect, { password?: string }>;

export type UserWithRoles = Merge<User, { roles: Role[] }>;

export type UserUniqueFields = Pick<User, "id" | "email">;

export type UserOrderBy = keyof User | { field: keyof User; direction: "asc" | "desc" };

export const insertUserSchema = createInsertSchema(Users, {
  id: z.never(),
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
