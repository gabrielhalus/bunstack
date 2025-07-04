import type { User } from "@bunstack/shared/schemas/users";

import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

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
    user: User;
    isLoading: false;
    isError: false;
    isAuthenticated: true;
  };

type UseAuthOptions = {
  redirect?: boolean;
};

export function useAuth(options: UseAuthOptions = {}): UseAuthReturn {
  const { redirect = false } = options;
  const navigate = useNavigate();
  const { data, isLoading, isError } = useQuery(userQueryOptions);

  useEffect(() => {
    if (redirect && !isLoading && !data?.user) {
      navigate({ to: "/login" });
    }
  }, [redirect, isLoading, data?.user, navigate]);

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
