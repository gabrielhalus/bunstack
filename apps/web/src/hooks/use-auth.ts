import type { Role } from "@bunstack/shared/db/types/roles";
import type { User } from "@bunstack/shared/db/types/users";
import type { LinkOptions } from "@tanstack/react-router";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";

import { userQueryOptions } from "@/lib/queries/auth";

type UseAuthReturn =
  | {
    user: undefined;
    roles: undefined;
    can: () => false;
    isAdmin: false;
    loading: true;
    isError: false;
    isAuthenticated: false;
  }
  | {
    user: null;
    roles: undefined;
    can: (permission: string) => false;
    isAdmin: false;
    loading: false;
    isError: true;
    isAuthenticated: false;
  }
  | {
    user: User;
    roles: Role[];
    can: (permission: string) => boolean;
    isAdmin: boolean;
    loading: false;
    isError: false;
    isAuthenticated: true;
  };

type UseAuthReturnWithRedirect =
  | {
    user: undefined;
    roles: undefined;
    can: (permission: string) => false;
    isAdmin: false;
    loading: true;
    isError: false;
    isAuthenticated: false;
  }
  | {
    user: User;
    roles: Role[];
    can: (permission: string) => boolean;
    isAdmin: boolean;
    loading: false;
    isError: false;
    isAuthenticated: true;
  };

type UseAuthOptions = {
  redirect?: LinkOptions["to"] | false;
};

export function useAuth(): UseAuthReturn;
export function useAuth(options: { redirect: LinkOptions["to"] }): UseAuthReturnWithRedirect;
export function useAuth(options: UseAuthOptions = {}): UseAuthReturn | UseAuthReturnWithRedirect {
  const { redirect = false } = options;
  const router = useRouter();
  const { data, isPending, isError } = useQuery(userQueryOptions);

  const unauthenticated = isError || !data?.user;

  if (!isPending && unauthenticated && redirect) {
    router.navigate({ to: redirect });
  }

  if (isPending) {
    return {
      user: undefined,
      roles: undefined,
      can: (_permission: string) => false,
      isAdmin: false,
      loading: true,
      isError: false,
      isAuthenticated: false,
    };
  }

  if (isError) {
    return {
      user: null,
      roles: undefined,
      can: (_permission: string) => false,
      isAdmin: false,
      loading: false,
      isError: true,
      isAuthenticated: false,
    };
  }

  // data is defined here and contains a valid user
  return {
    user: data.user,
    roles: data.roles,
    can: (permission: string) => data.permissions.includes(permission),
    isAdmin: data.roles.some(role => role.isSuperAdmin),
    loading: false,
    isError: false,
    isAuthenticated: true,
  };
}
