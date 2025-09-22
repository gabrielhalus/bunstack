import type { PaginationInput } from "@bunstack/shared/contracts/pagination";

import { api } from "../http";

export async function getAllUsers() {
  const res = await api.users.$get({ query: {} });
  return res.json();
}

export async function getUsersPaginated({ page = 0, pageSize = 10, sortField, sortDirection, search }: PaginationInput) {
  const params = {
    page: String(page),
    pageSize: String(pageSize),
    search,
    sortField,
    sortDirection,
  };

  const res = await api.users.$get({ query: params });
  return res.json();
}

export async function deleteUser({ id }: { id: string }) {
  const res = await api.users[":id"].$delete({ param: { id } });
  return res.json();
}
