import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { DataTable } from "@/components/ui/data-table";
import { getAllRolesQueryOptions } from "@/lib/queries/roles";

import { columns } from "./-components/columns";

export const Route = createFileRoute("/_authenticated/_dashboard/roles/")({
  component: Roles,
});

function Roles() {
  const { isPending, data } = useQuery(getAllRolesQueryOptions);
  const [globalFilter, setGlobalFilter] = useState("");

  return (
    <div className="w-full py-10 px-10">
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold">Roles Management</h1>
          <p className="text-muted-foreground">Manage your roles with advanced filtering and search capabilities.</p>
        </div>
        <DataTable
          columns={columns}
          data={data}
          isLoading={isPending}
          searchPlaceholder="Search roles..."
          searchValue={globalFilter}
          onSearchChange={setGlobalFilter}
        />
      </div>
    </div>
  );
}
