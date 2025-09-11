import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { DataTable } from "@/components/ui/data-table";
import { getRolesPaginatedQueryOptions } from "@/lib/queries/roles";

import { columns } from "./-components/columns";

export const Route = createFileRoute("/_authenticated/_dashboard/roles/")({
  component: Roles,
});

function Roles() {
  const [globalFilter, setGlobalFilter] = useState("");
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const { isPending, data } = useQuery(getRolesPaginatedQueryOptions({
    page: pagination.pageIndex,
    pageSize: pagination.pageSize
  }));

  const pageCount = data?.total ? Math.ceil(data.total / pagination.pageSize) : 0;
  
  return (
    <div className="w-full py-10 px-10">
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold">Roles Management</h1>
          <p className="text-muted-foreground">Manage your roles with advanced filtering and search capabilities.</p>
        </div>
        <DataTable
          columns={columns}
          data={data?.roles}
          isLoading={isPending}
          searchPlaceholder="Search roles..."
          searchValue={globalFilter}
          onSearchChange={setGlobalFilter}
          pagination={pagination}
          onPaginationChange={setPagination}
          pageCount={pageCount}
          manualPagination={true}
        />
      </div>
    </div>
  );
}
