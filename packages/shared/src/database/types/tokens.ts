import { Tokens } from "@bunstack/shared/database/schemas/tokens";
import { createInsertSchema } from "drizzle-zod";

export type Token = typeof Tokens.$inferSelect;

export type TokenUniqueFields = Pick<Token, "id">;

export const insertTokenSchema = createInsertSchema(Tokens);
