import type { Policies } from "@bunstack/shared/database/schemas/policies";

export type Policy = typeof Policies.$inferSelect;
