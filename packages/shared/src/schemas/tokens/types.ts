import { tokensTable } from "./table";

export type Token = typeof tokensTable.$inferSelect;

export type TokenUniqueFields = Pick<Token, "id">;
