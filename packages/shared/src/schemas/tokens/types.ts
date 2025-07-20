import type { Tokens } from "./table";

export type Token = typeof Tokens.$inferSelect;

export type TokenUniqueFields = Pick<Token, "id">;
