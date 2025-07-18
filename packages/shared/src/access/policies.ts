import type { Policy } from "./types";

export const policies: Record<string, Policy> = {
  isOwner: (user, resource, args) => {
    return user?.[args?.userKey as keyof typeof user ?? "id"] === resource?.[args?.resourceKey ?? "id"];
  },
};
