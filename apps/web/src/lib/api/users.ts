import { api } from "../http";

export async function getAllUsers() {
  const res = await api.users.$get({ query: {} });
  return res.json();
}

export async function getUsersPaginated({ page = 0, pageSize = 10, search, sortField, sortDirection }: { page?: number; pageSize?: number; search?: string; sortField?: string; sortDirection?: "asc" | "desc" }) {
  const params = {
    page: page?.toString(),
    pageSize: pageSize?.toString(),
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
