import type { User } from "@bunstack/shared/db/types/users";
import type { Row } from "@tanstack/react-table";

import { Copy, Loader2, MoreHorizontal, Trash } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/use-auth";
import { deleteUser } from "@/lib/api/users";
import { getAllUsersQueryOptions } from "@/lib/queries/users";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function ActionDropdown({ row }: { row: Row<User> }) {
  const { can, loading } = useAuth();
  const queryClient = useQueryClient();
  
  if (loading) {
    return null;
  }

  const user = row.original;

  const mutation = useMutation({
    mutationFn: deleteUser,
    onError: () => {
      toast.error("Failed to delete user");
    },
    onSuccess: () => {
      toast.success("User deleted");

      queryClient.setQueryData(getAllUsersQueryOptions.queryKey, (existingUsers) => {
        return existingUsers?.filter((u) => u.id !== user.id) ?? [];
      });
    },
  })

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
          <Button disabled={mutation.isPending} onClick={() => mutation.mutate(user)} variant="destructive" size="sm">
            {mutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash className="h-4 w-4" />}
            Delete User
          </Button>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
