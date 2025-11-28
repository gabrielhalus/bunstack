export type PaginationParams = {
  page: number;
  limit: number;
};

export type PaginatedResult<T> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type OrderBy<T> = keyof T | { field: keyof T; direction: "asc" | "desc" };
