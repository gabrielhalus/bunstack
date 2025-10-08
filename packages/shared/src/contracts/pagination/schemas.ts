import { z } from "zod";

export const paginationInputSchema = z.object({
  page: z.string().optional().transform(val => (Number(val) ?? 0)),
  pageSize: z.string().optional().transform(val => (Number(val) ?? Number.MAX_SAFE_INTEGER)),
  search: z.string().optional(),
  sortField: z.string().optional(),
  sortDirection: z.enum(["asc", "desc"]).optional().default("desc"),
});
