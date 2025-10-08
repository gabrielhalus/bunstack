export const permissions = [
  "user:create",
  "user:read",
  "user:list",
  "user:edit",
  "user:delete",

  "role:create",
  "role:read",
  "role:list",
  "role:edit",
  "role:delete",

  "userRole:create",
  "userRole:delete",

  "settings:read",
  "settings:update",

  "session:impersonate",
  "session:invalidate",
] as const;
