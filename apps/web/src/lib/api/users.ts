import type { PaginationInput } from "@bunstack/shared/contracts/pagination";

import { api } from "../http";

export async function getAllUsers() {
  const res = await api.users.$get({ query: {} });

  if (!res.ok) {
    throw new Error("Failed to fetch users");
  }

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

  if (!res.ok) {
    throw new Error("Failed to fetch users");
  }

  return res.json();
}

export async function deleteUser({ id }: { id: string }) {
  const res = await api.users[":id"].$delete({ param: { id } });

  if (!res.ok) {
    throw new Error("Failed to delete user");
  }

  return res.json();
}
