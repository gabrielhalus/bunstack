import type { Role } from "@bunstack/shared/schemas/roles";
import type { ColumnDef } from "@tanstack/react-table";

import { toast } from "sonner";

import { Checkbox } from "@/components/ui/checkbox";
import { ActionsCell, SortableHeader } from "@/components/ui/data-table";

export const columns: ColumnDef<Role>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
        onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={value => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
    size: 50,
  },
  {
    header: ({ column }) => <SortableHeader column={column} title="Name" />,
    accessorKey: "name",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const role = row.original;

      return (
        <ActionsCell items={[
          {
            label: "Copy Role ID",
            onClick: () => {
              navigator.clipboard.writeText(role.id);
              toast.success("Role ID copied to clipboard");
            },
          },
        ]}
        />
      );
    },
    enableSorting: false,
    enableHiding: false,
    size: 50,
  },
];
