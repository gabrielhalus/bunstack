import type { Role } from "@bunstack/shared/db/types/roles";
import type { Row } from "@tanstack/react-table";

import { Button } from "@bunstack/ui/components/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@bunstack/ui/components/dropdown-menu";
import sayno from "@bunstack/ui/lib/sayno";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Copy, Loader2, MoreHorizontal, Trash } from "lucide-react";
import { toast } from "sonner";

import { useAuth } from "@/hooks/use-auth";
import { deleteRole } from "@/lib/api/roles";

export function ActionDropdown({ row }: { row: Row<Role> }) {
  const { can, loading } = useAuth();

  const queryClient = useQueryClient();

  const role = row.original;

  const mutation = useMutation({
    mutationFn: deleteRole,
    onError: () => toast.error("Failed to delete role"),
    onSuccess: () => {
      toast.success("User deleted successfully");
      queryClient.refetchQueries({ queryKey: ["get-roles-paginated"] });
    },
  });

  const handleDeleteClick = async () => {
    const confirmed = await sayno({
      title: "Delete Role",
      description: "Are you sure you want to delete this role? This action cannot be undone.",
      variant: "destructive",
    });

    if (confirmed) {
      mutation.mutate(role);
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
        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(role.id.toString())}>
          <Copy className="h-4 w-4" />
          Copy Role ID
        </DropdownMenuItem>
        {can("role:delete") && (
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
