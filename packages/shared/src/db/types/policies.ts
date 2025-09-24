import type { Policies } from "@bunstack/shared/db/schemas/policies";

export type Policy = typeof Policies.$inferSelect;
