import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Loader2, LogOut } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { logout } from "@/lib/api/auth";

type Variant = "button" | "dropdown";

type CommonProps = {
  variant?: Variant;
  className?: string;
};

export function LogoutButton({ variant = "button", className }: CommonProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { t } = useTranslation("auth");

  const mutation = useMutation({
    mutationFn: logout,
    onError: () => toast.error("Failed to sign out"),
    onSuccess: () => {
      localStorage.removeItem("accessToken");
      queryClient.clear();
      navigate({ to: "/login" });
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
