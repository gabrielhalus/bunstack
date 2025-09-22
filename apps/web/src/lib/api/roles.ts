import type { PaginationInput } from "@bunstack/shared/contracts/pagination";
import type { UpdateRoleInput } from "@bunstack/shared/contracts/roles";

import { api } from "../http";

export async function getAllRoles() {
  const res = await api.roles.$get({ query: {} });

  if (!res.ok) {
    throw new Error("Failed to fetch roles");
  }

  return res.json();
}

export async function getRolesPaginated({ page = 0, pageSize = 10, sortField, sortDirection, search }: PaginationInput) {
  const params = {
    page: String(page),
    pageSize: String(pageSize),
    search,
    sortField,
    sortDirection,
  };

  const res = await api.roles.$get({ query: params });

  if (!res.ok) {
    throw new Error("Failed to fetch roles");
  }

  return res.json();
}

export async function getRoleByName(name: string) {
  const res = await api.roles[":name"].$get({ param: { name } });

  if (!res.ok) {
    throw new Error("Failed to fetch role");
  }

  return res.json();
}

export async function updateRole(id: number, data: UpdateRoleInput) {
  const res = await api.roles[":id"].$put({ param: { id: String(id) }, json: data });

  if (!res.ok) {
    throw new Error("Failed to update role");
  }

  return res.json();
};

export async function deleteRole({ id }: { id: number }) {
  const res = await api.roles[":id"].$delete({ param: { id: String(id) } });

  if (!res.ok) {
    throw new Error("Failed to delete role");
  }

  return res.json();
}
