import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { LogOut } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { useAuth } from "@/hooks/use-auth";
import { logout } from "@/lib/api/auth";
import { env } from "@/lib/env";
import { Button } from "@bunstack/ui/components/button";
import { DropdownMenuItem } from "@bunstack/ui/components/dropdown-menu";
import { Spinner } from "@bunstack/ui/components/spinner";
import sayno from "@bunstack/ui/lib/sayno";

type Variant = "button" | "dropdown";

type CommonProps = {
  variant?: Variant;
  className?: string;
};

export function LogoutButton({ variant = "button", className }: CommonProps) {
  const { t } = useTranslation("auth");
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { isAuthenticated } = useAuth();

  const mutation = useMutation({
    mutationFn: async () => {
      const confirmation = await sayno({ description: t("logout.dialog") });
      if (!confirmation) {
        return false;
      }

      await logout();
      return true;
    },
    onSuccess: (loggedOut) => {
      if (!loggedOut) {
        return;
      }

      // Clear cached queries
      queryClient.resetQueries();

      // Redirect to SSO login
      navigate({ href: `${env.VITE_AUTH_URL}?redirect=${encodeURIComponent(location.href)}`, replace: true });
    },
    onError: () => {
      toast.error(t("logout.error"));
    },
  });

  const handleLogoutClick = () => mutation.mutate();

  const content = (
    <>
      {mutation.isPending ? <Spinner /> : <LogOut />}
      {t("logout.label")}
    </>
  );

  if (!isAuthenticated) {
    return null;
  }

  if (variant === "dropdown") {
    return (
      <DropdownMenuItem onClick={handleLogoutClick} className={className}>
        {content}
      </DropdownMenuItem>
    );
  }

  return (
    <Button disabled={mutation.isPending} onClick={handleLogoutClick} className={className}>
      {content}
    </Button>
  );
}
