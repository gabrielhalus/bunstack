import { createInsertSchema } from "drizzle-zod";

import { Tokens } from "@/schemas/tokens";

export type Token = typeof Tokens.$inferSelect;

export const insertTokenSchema = createInsertSchema(Tokens);
