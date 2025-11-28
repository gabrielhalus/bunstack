import type { NotificationProvider } from "@bunstack/shared/database/types/notification-providers";
import type { ColumnDef } from "@tanstack/react-table";

import { SortableHeader } from "@bunstack/react/components/sortable-header";

export const columns: ColumnDef<NotificationProvider>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <SortableHeader column={column} title="Name" />,
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "enabled",
    header: ({ column }) => <SortableHeader column={column} title="Enabled" />,
  },
];
