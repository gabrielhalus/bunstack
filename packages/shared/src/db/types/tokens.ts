import { createInsertSchema } from "drizzle-zod";

import { Tokens } from "@bunstack/shared/db/schemas/tokens";

export type Token = typeof Tokens.$inferSelect;

export type TokenUniqueFields = Pick<Token, "id">;

export const insertTokenSchema = createInsertSchema(Tokens);
