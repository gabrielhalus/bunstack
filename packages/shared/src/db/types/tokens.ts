import { createInsertSchema } from "drizzle-zod";

import { Tokens } from "../schemas/tokens";

export type Token = typeof Tokens.$inferSelect;

export type TokenUniqueFields = Pick<Token, "id">;

export const insertTokenSchema = createInsertSchema(Tokens);
