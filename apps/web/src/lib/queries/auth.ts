import { queryOptions } from "@tanstack/react-query";

import { getCurrentUser, logout } from "@/lib/api/auth";

export const userQueryOptions = queryOptions({
  queryKey: ["get-current-user"],
  queryFn: getCurrentUser,
  staleTime: Infinity,
  retry: false,
});

export const logoutMutationOptions = {
  mutationFn: logout,
  onSuccess: () => {
    // Clear any cached data on logout
    localStorage.removeItem("accessToken");
  },
};
