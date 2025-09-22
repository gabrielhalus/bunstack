import z from "zod";

export const getUsersPaginatedInputSchema = z.object({
  page: z.number().gte(0).optional(),
  pageSize: z.number().gte(0).optional(),
  search: z.string().optional(),
  sortField: z.string().optional(),
  sortDirection: z.string().optional(),
});
