import type { User } from "@bunstack/shared/schemas/users";
import type { LinkOptions } from "@tanstack/react-router";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";

import { userQueryOptions } from "@/lib/queries/auth";

type UseAuthReturn =
  | {
    user: undefined;
    isPending: true;
    isError: false;
    isAuthenticated: false;
  }
  | {
    user: null;
    isPending: false;
    isError: true;
    isAuthenticated: false;
  }
  | {
    user: User;
    isPending: false;
    isError: false;
    isAuthenticated: true;
  };

type UseAuthReturnWithRedirect =
  | {
    user: undefined;
    isPending: true;
    isError: false;
    isAuthenticated: false;
  }
  | {
    user: User;
    isPending: false;
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
      isPending: true,
      isError: false,
      isAuthenticated: false,
    };
  }

  if (isError) {
    return {
      user: null,
      isPending: false,
      isError: true,
      isAuthenticated: false,
    };
  }

  // data is defined here and contains a valid user
  return {
    user: data!.user,
    isPending: false,
    isError: false,
    isAuthenticated: true,
  };
}
