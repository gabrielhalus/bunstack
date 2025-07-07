import { createInsertSchema } from "drizzle-zod";

import { rolesTable } from "./table";

export const insertRoleSchema = createInsertSchema(rolesTable);
