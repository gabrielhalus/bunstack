import type { User } from "@bunstack/shared/database/types/users";
import type { Row } from "@tanstack/react-table";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Copy, Loader2, MoreHorizontal, Trash } from "lucide-react";
import { toast } from "sonner";

import { useAuth } from "@/hooks/use-auth";
import { deleteUser } from "@/lib/api/users";
import { Button } from "@bunstack/ui/components/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@bunstack/ui/components/dropdown-menu";
import sayno from "@bunstack/ui/lib/sayno";

export function ActionDropdown({ row }: { row: Row<User> }) {
  const { can, loading } = useAuth();
  const queryClient = useQueryClient();

  const user = row.original;

  const mutation = useMutation({
    mutationFn: deleteUser,
    onError: () => toast.error("Failed to delete user"),
    onSuccess: () => {
      toast.success("User deleted successfully");
      queryClient.refetchQueries({ queryKey: ["get-users-paginated"] });
    },
  });

  const handleDeleteClick = async () => {
    const confirmed = await sayno({
      title: "Delete User",
      description: "Are you sure you want to delete this user? This action cannot be undone.",
      variant: "destructive",
    });

    if (confirmed) {
      mutation.mutate(user);
    }
  };

  if (loading) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(user.id)}>
          <Copy className="h-4 w-4" />
          Copy User ID
        </DropdownMenuItem>
        {can("user:delete") && (
          <Button
            disabled={mutation.isPending}
            onClick={handleDeleteClick}
            variant="destructive"
            size="sm"
            className="w-full"
          >
            {mutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash className="h-4 w-4" />}
            Delete User
          </Button>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
