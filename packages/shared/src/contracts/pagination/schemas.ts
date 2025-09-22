import z from "zod";

export const paginationInputSchema = z.object({
  page: z.number().optional().transform(val => (val ?? 0)),
  pageSize: z.number().optional().transform(val => (val ?? Number.MAX_SAFE_INTEGER)),
  search: z.string().optional(),
  sortField: z.string().optional(),
  sortDirection: z.enum(["asc", "desc"]).optional().default("desc"),
});
