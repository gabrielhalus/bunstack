import { createInsertSchema } from "drizzle-zod";

import { Tokens } from "@bunstack/shared/database/schemas/tokens";

export type Token = typeof Tokens.$inferSelect;

export const insertTokenSchema = createInsertSchema(Tokens);
