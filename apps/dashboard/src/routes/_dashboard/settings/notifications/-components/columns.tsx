import type { NotificationProvider } from "@bunstack/shared/database/types/notification-providers";
import type { ColumnDef } from "@tanstack/react-table";

import Actions from "./actions";
import { Badge } from "@bunstack/react/components/badge";
import { SortableHeader } from "@bunstack/react/components/sortable-header";

export const columns: ColumnDef<NotificationProvider>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <SortableHeader column={column} title="Name" />,
  },
  {
    accessorKey: "type",
    header: ({ column }) => <SortableHeader column={column} title="Type" />,
    cell: ({ row }) => {
      return <Badge variant="outline">{row.original.type}</Badge>;
    },
  },
  {
    id: "actions",
    cell: Actions,
  },
];
