import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { LogOut } from "lucide-react";
import { useTranslation } from "react-i18next";

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

  async function handleLogout() {
    const { success } = await logout();

    if (success) {
      localStorage.removeItem("accessToken");
      queryClient.clear();
      navigate({ to: "/login" });
    }
  }

  const content = (
    <>
      <LogOut />
      {t("sign-out")}
    </>
  );

  if (variant === "dropdown") {
    return (
      <DropdownMenuItem onClick={handleLogout} className={className}>
        {content}
      </DropdownMenuItem>
    );
  }

  return (
    <Button onClick={handleLogout} className={className}>
      {content}
    </Button>
  );
}
