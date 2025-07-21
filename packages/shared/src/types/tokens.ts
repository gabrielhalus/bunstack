import { createInsertSchema } from "drizzle-zod";
import { Tokens } from "../db/schemas/tokens";

export type Token = typeof Tokens.$inferSelect;

export type TokenUniqueFields = Pick<Token, 'id'>

export const insertTokenSchema = createInsertSchema(Tokens);
