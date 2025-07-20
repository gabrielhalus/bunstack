import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { Tokens } from "./table";

export const selectTokenSchema = createSelectSchema(Tokens);

export const insertTokenSchema = createInsertSchema(Tokens);
