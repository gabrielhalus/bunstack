import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, LogOut } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { logoutMutationOptions } from "@/lib/queries/auth";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

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
      toast.success("Successfully signed out");
      navigate({ to: "/login" })
    },
    onError: () =>{
      toast.error("Failed to sign out")
    }
  })
  
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
