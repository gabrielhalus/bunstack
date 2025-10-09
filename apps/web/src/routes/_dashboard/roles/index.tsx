import type { SortingState } from "@tanstack/react-table";

import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { columns } from "./-components/columns";
import { getRolesPaginatedQueryOptions } from "@/queries/roles";
import { debounceSync } from "@bunstack/shared/lib/debounce";
import { DataTable } from "@bunstack/ui/components/data-table";

export const Route = createFileRoute("/_dashboard/roles/")({
  component: Roles,
});

function Roles() {
  const { t } = useTranslation("web");

  const [globalFilter, setGlobalFilter] = useState("");
  const [debouncedFilter, setDebouncedFilter] = useState("");
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [sorting, setSorting] = useState<SortingState>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Create debounced search function once
  const debouncedSearch = useMemo(
    () => debounceSync((searchValue: string) => {
      setDebouncedFilter(searchValue);
      // Reset to first page when searching
      setPagination(prev => ({ ...prev, page: 0 }));
    }, 300),
    [],
  );

  // Handle search input changes with debouncing
  const handleSearchChange = useCallback((value: string) => {
    setGlobalFilter(value);
    debouncedSearch(value);
  }, [debouncedSearch]);

  // Convert sorting state to API parameters
  const sortField = sorting.length ? sorting[0]?.id : undefined;
  const sortDirection = sorting.length ? (sorting[0]?.desc ? "desc" : "asc") : undefined;

  const { isPending, data } = useQuery(getRolesPaginatedQueryOptions({
    page: String(pagination.pageIndex),
    pageSize: String(pagination.pageSize),
    sortField,
    sortDirection,
    search: debouncedFilter || undefined,
  }));

  // Keep search input focused during data fetching
  useEffect(() => {
    if (isPending) {
      searchInputRef.current?.focus();
    }
  }, [isPending]);

  const pageCount = data?.total ? Math.ceil(data.total / pagination.pageSize) : 0;

  return (
    <div className="w-full py-10 px-10">
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold">{t("pages.roles.list.title")}</h1>
          <p className="text-muted-foreground">{t("pages.roles.list.subtitle")}</p>
        </div>
        <DataTable
          columns={columns}
          data={data?.roles}
          isLoading={isPending}
          searchPlaceholder="Search roles..."
          searchValue={globalFilter}
          onSearchChange={handleSearchChange}
          searchInputRef={searchInputRef}
          pagination={pagination}
          onPaginationChange={setPagination}
          pageCount={pageCount}
          manualPagination={true}
          sorting={sorting}
          onSortingChange={setSorting}
          manualSorting={true}
          manualFiltering={true}
        />
      </div>
    </div>
  );
}
