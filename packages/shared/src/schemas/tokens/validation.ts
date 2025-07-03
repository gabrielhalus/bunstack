import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { tokens } from "./table";

export const selectTokenSchema = createSelectSchema(tokens);

export const insertTokenSchema = createInsertSchema(tokens);
