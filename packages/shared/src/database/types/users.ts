import type { Role } from "@bunstack/shared/database/types/roles";
import type { Merge } from "@bunstack/shared/types/utils";

import { Users } from "@bunstack/shared/database/schemas/users";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export type User = Merge<typeof Users.$inferSelect, { password?: string }>;

export type UserWithRoles = Merge<User, { roles: Role[] }>;

export type UserUniqueFields = Pick<User, "id" | "email">;

export type UserOrderBy = keyof User | { field: keyof User; direction: "asc" | "desc" };

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
