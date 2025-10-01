import type { paginationInputSchema } from "./schemas";
import type z from "zod";

export type PaginationInput = z.input<typeof paginationInputSchema>;
