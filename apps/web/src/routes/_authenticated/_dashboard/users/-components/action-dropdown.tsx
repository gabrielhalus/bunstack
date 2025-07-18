import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { TimeoutButton } from "@/components/ui/timeout-button"
import { useAuth } from "@/hooks/use-auth"
import { can } from "@bunstack/shared/access"
import { User } from "@bunstack/shared/schemas/users"
import { Row } from "@tanstack/react-table"
import { Copy, MoreHorizontal, Trash } from "lucide-react"

export function ActionDropdown({ row }: { row: Row<User>}) {
  const { user } = useAuth()
  
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
          <DropdownMenuItem onClick={() => navigator.clipboard.writeText(row.original.id)}>
            <Copy className="h-4 w-4" />
            Copy User ID
          </DropdownMenuItem>
          {
            can(user, "users", "delete", row.original) && (
              <TimeoutButton variant="destructive" size="sm" noExpansion timeout={2000} onClick={() => console.log("Delete user")}>
                <Trash className="h-4 w-4" />
                Delete User
              </TimeoutButton>
            )
          }
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
