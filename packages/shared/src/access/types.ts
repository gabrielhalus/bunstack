export type UserContext = {
  id: string;
  roles: { id: number; level: number; name: string }[];
  attributes: Record<string, unknown>;
};

export type UserLike = {
  id: string;
  roles?: { id: number; level: number; name: string }[];
  attributes?: Record<string, unknown>;
  // Allow additional properties for flexibility
  [key: string]: unknown;
};

// Helper type for permission checks that can work with any user-like object
export type PermissionCheckInput = {
  permissionName: string;
  user: UserLike;
  resource?: ResourceContext;
};

// Keep the original for internal use
export type PermissionCheck = {
  permissionName: string;
  user: UserContext;
  resource?: ResourceContext;
};

export type ResourceContext = {
  type: string;
  attributes: Record<string, unknown>;
};
