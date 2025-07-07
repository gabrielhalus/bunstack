import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { tokensTable } from "./table";

export const selectTokenSchema = createSelectSchema(tokensTable);

export const insertTokenSchema = createInsertSchema(tokensTable);
