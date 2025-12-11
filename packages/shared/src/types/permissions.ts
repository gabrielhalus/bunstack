export const permissions = [
  // Users
  "user:create",
  "user:read",
  "user:list",
  "user:update",
  "user:delete",

  // Roles
  "role:create",
  "role:read",
  "role:list",
  "role:update",
  "role:delete",

  // User-roles
  "userRole:create",
  "userRole:delete",

  // Notifications
  "notification:create",
  "notification:read",
  "notification:list",
  "notification:update",
  "notification:delete",
] as const;

export type Permission = (typeof permissions)[number];
