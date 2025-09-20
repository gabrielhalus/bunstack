import { Button } from "@bunstack/ui/components/button";
import { DropdownMenuItem } from "@bunstack/ui/components/dropdown-menu";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Loader2, LogOut } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { logoutMutationOptions } from "@/lib/queries/auth";

type Variant = "button" | "dropdown";

type CommonProps = {
  variant?: Variant;
  className?: string;
};

export function LogoutButton({ variant = "button", className }: CommonProps) {
  const { t } = useTranslation("auth");
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    ...logoutMutationOptions,
    onSuccess: () => {
      localStorage.removeItem("accessToken");
      queryClient.resetQueries();
      return navigate({ to: "/login" });
    },
    onError: () => {
      toast.error(t("sign-out.error"));
    },
  });

  const handleLogoutClick = () => mutation.mutate();

  const content = (
    <>
      {mutation.isPending ? <Loader2 className="size-4 animate-spin" /> : <LogOut />}
      {t("sign-out")}
    </>
  );

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
