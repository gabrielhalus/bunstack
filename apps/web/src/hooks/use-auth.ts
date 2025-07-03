import type { UserProfile } from "@bunstack/shared/schemas/users";

import { useQuery } from "@tanstack/react-query";

import { userQueryOptions } from "@/lib/queries/auth";

type UseAuthReturn =
  | {
    user: undefined;
    isLoading: true;
    isError: false;
    isAuthenticated: false;
  }
  | {
    user: null;
    isLoading: false;
    isError: true;
    isAuthenticated: false;
  }
  | {
    user: UserProfile;
    isLoading: false;
    isError: false;
    isAuthenticated: true;
  };

export function useAuth(): UseAuthReturn {
  const { data, isLoading, isError } = useQuery(userQueryOptions);

  if (isLoading) {
    return {
      user: undefined,
      isLoading: true,
      isError: false,
      isAuthenticated: false,
    };
  }

  if (isError) {
    return {
      user: null,
      isLoading: false,
      isError: true,
      isAuthenticated: false,
    };
  }

  // data is defined here and contains a valid user
  return {
    user: data!.user,
    isLoading: false,
    isError: false,
    isAuthenticated: true,
  };
}
