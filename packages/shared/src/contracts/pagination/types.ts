import type z from "zod";

import type { paginationInputSchema } from "./schemas";

export type PaginationInput = z.input<typeof paginationInputSchema>;
