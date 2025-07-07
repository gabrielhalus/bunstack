import { tokens } from "./table";

export type Token = typeof tokens.$inferSelect;

export type TokenUniqueFields = Pick<Token, "id">;
