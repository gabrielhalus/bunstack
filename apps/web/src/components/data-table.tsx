import type {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table";

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronDown, Search, Settings2 } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

// Enhanced types for better callback support
export type EditableCellProps<TData = any> = {
  value: any;
  row: { original: TData; index: number };
  column: { id: string };
  onSave: (value: any, row: TData, columnId: string) => void;
  onCancel: () => void;
  isEditing: boolean;
  onStartEdit: () => void;
};

export type DataTableCallbacks<TData> = {
  onSearchChange?: (value: string) => void;
  onPaginationChange?: (pagination: { pageIndex: number; pageSize: number }) => void;
  onRowReorder?: (args: { from: TData; to: TData; position: "above" | "below" }) => void;
  onCellEdit?: (value: any, row: TData, columnId: string) => void;
  onBatchSave?: (updatedItems: Array<{ row: TData; changes: Record<string, any> }>) => void;
  onRowSelect?: (selectedRows: TData[]) => void;
  onColumnVisibilityChange?: (columnVisibility: VisibilityState) => void;
  onSortingChange?: (sorting: SortingState) => void;
  onColumnFiltersChange?: (columnFilters: ColumnFiltersState) => void;
};

const DEFAULT_PAGE_SIZE_OPTIONS = [10, 20, 30, 40, 50];

export type EditableColumnDef<TData, TValue = unknown> = ColumnDef<TData, TValue> & {
  editable?: boolean;
};

type DataTableProps<TData, TValue> = {
  columns: EditableColumnDef<TData, TValue>[];
  data: TData[] | undefined;
  isLoading?: boolean;
  searchPlaceholder?: string;
  searchValue?: string;
  pageCount?: number;
  pagination?: {
    pageIndex: number;
    pageSize: number;
  };
  manualPagination?: boolean;
  enableRowReorder?: boolean;
  enableCellEditing?: boolean;
  callbacks?: DataTableCallbacks<TData>;
  className?: string;
  emptyMessage?: string;
  pageSizeOptions?: number[];
};

// Editable Cell Component
function EditableCell<TData>({
  value,
  row,
  column,
  onSave,
  onCancel,
  isEditing,
  onStartEdit,
}: EditableCellProps<TData>) {
  const [editValue, setEditValue] = React.useState(() => value);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  if (!isEditing && value !== editValue) {
    setEditValue(value);
  }

  const handleSave = () => {
    onSave(editValue, row.original, column.id);
  };

  const handleCancel = () => {
    setEditValue(value);
    onCancel();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  if (isEditing) {
    return (
      <Input
        ref={inputRef}
        value={editValue}
        onChange={e => setEditValue(e.target.value)}
        onKeyDown={handleKeyDown}
        className="h-8 text-sm"
        onBlur={handleSave}
      />
    );
  }

  return (
    <div
      className="cursor-pointer"
      onDoubleClick={onStartEdit}
    >
      <span>{value}</span>
    </div>
  );
}

function TableSkeleton({ columns }: { columns: ColumnDef<any, any>[] }) {
  return (
    <>
      {Array.from({ length: 5 }).map((_, rowIndex) => (
        // eslint-disable-next-line react/no-array-index-key
        <TableRow key={`skeleton-row-${rowIndex}`}>
          {columns.map((_, colIndex) => (
            // eslint-disable-next-line react/no-array-index-key
            <TableCell key={`skeleton-cell-${rowIndex}-${colIndex}`}>
              <Skeleton className="h-4 w-full" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}

export function DataTable<TData, TValue>({
  columns,
  data,
  isLoading = false,
  searchPlaceholder = "Search...",
  searchValue = "",
  pageCount,
  pagination: externalPagination,
  manualPagination = false,
  enableRowReorder = false,
  enableCellEditing = false,
  callbacks,
  className,
  emptyMessage = "No results.",
  pageSizeOptions: _pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [internalPagination, setInternalPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [draggingIndex, setDraggingIndex] = React.useState<number | null>(null);
  const [overIndex, setOverIndex] = React.useState<number | null>(null);
  const [overPosition, setOverPosition] = React.useState<"above" | "below" | null>(null);
  const [editingCells, setEditingCells] = React.useState<Set<string>>(() => new Set());
  const [pendingChanges, setPendingChanges] = React.useState<Map<string, any>>(() => new Map());
  const dragImageRef = React.useRef<HTMLDivElement | null>(null);

  const containerRef = React.useRef<HTMLDivElement>(null);

  const rows = React.useMemo(() => {
    return data || [];
  }, [data]);

  const currentPagination = externalPagination || internalPagination;

  const handlePaginationChange = React.useCallback(
    (updaterOrValue: any) => {
      const newPagination = typeof updaterOrValue === "function"
        ? updaterOrValue(currentPagination)
        : updaterOrValue;

      if (callbacks?.onPaginationChange) {
        callbacks.onPaginationChange(newPagination);
      } else {
        setInternalPagination(newPagination);
      }
    },
    [currentPagination, callbacks],
  );

  const handleSortingChange = React.useCallback(
    (updaterOrValue: any) => {
      const newSorting = typeof updaterOrValue === "function"
        ? updaterOrValue(sorting)
        : updaterOrValue;

      setSorting(newSorting);
      callbacks?.onSortingChange?.(newSorting);
    },
    [sorting, callbacks],
  );

  const handleColumnFiltersChange = React.useCallback(
    (updaterOrValue: any) => {
      const newFilters = typeof updaterOrValue === "function"
        ? updaterOrValue(columnFilters)
        : updaterOrValue;

      setColumnFilters(newFilters);
      callbacks?.onColumnFiltersChange?.(newFilters);
    },
    [columnFilters, callbacks],
  );

  const handleColumnVisibilityChange = React.useCallback(
    (updaterOrValue: any) => {
      const newVisibility = typeof updaterOrValue === "function"
        ? updaterOrValue(columnVisibility)
        : updaterOrValue;

      setColumnVisibility(newVisibility);
      callbacks?.onColumnVisibilityChange?.(newVisibility);
    },
    [columnVisibility, callbacks],
  );

  const handleRowSelectionChange = React.useCallback(
    (updaterOrValue: any) => {
      const newSelection = typeof updaterOrValue === "function"
        ? updaterOrValue(rowSelection)
        : updaterOrValue;

      setRowSelection(newSelection);

      // Get selected rows and call callback
      const selectedRowIndices = Object.keys(newSelection).filter(key => newSelection[key]);
      const selectedRows = selectedRowIndices.map(index => rows[Number.parseInt(index)]).filter(Boolean);
      callbacks?.onRowSelect?.(selectedRows as TData[]);
    },
    [rowSelection, callbacks, rows],
  );

  // Enhanced column definitions with editable cells
  const enhancedColumns = React.useMemo(() => {
    if (!enableCellEditing)
      return columns;

    return columns.map((column) => {
      // Check if column has editable property set to true
      if (!(column as any).editable)
        return column;

      return {
        ...column,
        cell: ({ getValue, row, column: col }: { getValue: () => any; row: { original: TData; index: number }; column: { id: string } }) => {
          const cellKey = `${row.index}-${col.id}`;
          const originalValue = getValue();
          const pendingValue = pendingChanges.get(cellKey);
          const value = pendingValue !== undefined ? pendingValue : originalValue;
          const isEditing = editingCells.has(cellKey);

          return (
            <EditableCell
              value={value}
              row={row}
              column={col}
              isEditing={isEditing}
              onStartEdit={() => setEditingCells(prev => new Set(prev).add(cellKey))}
              onSave={(newValue) => {
                // Only add to pending changes if the value actually changed
                if (newValue !== originalValue) {
                  setPendingChanges(prev => new Map(prev).set(cellKey, newValue));
                } else {
                  // If value is the same as original, remove from pending changes
                  setPendingChanges((prev) => {
                    const newMap = new Map(prev);
                    newMap.delete(cellKey);
                    return newMap;
                  });
                }
                setEditingCells((prev) => {
                  const newSet = new Set(prev);
                  newSet.delete(cellKey);
                  return newSet;
                });
              }}
              onCancel={() => {
                setPendingChanges((prev) => {
                  const newMap = new Map(prev);
                  newMap.delete(cellKey);
                  return newMap;
                });
                setEditingCells((prev) => {
                  const newSet = new Set(prev);
                  newSet.delete(cellKey);
                  return newSet;
                });
              }}
            />
          );
        },
      };
    });
  }, [columns, enableCellEditing, editingCells, pendingChanges]);

  const table = useReactTable({
    data: rows,
    columns: enhancedColumns,
    defaultColumn: {
      size: undefined,
      maxSize: undefined,
      minSize: undefined,
    },
    onSortingChange: handleSortingChange,
    onColumnFiltersChange: handleColumnFiltersChange,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: handleColumnVisibilityChange,
    onRowSelectionChange: handleRowSelectionChange,
    onPaginationChange: handlePaginationChange,
    manualPagination,
    pageCount: pageCount || (data ? Math.ceil(data.length / currentPagination.pageSize) : 0),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination: currentPagination,
    },
  });

  const cleanupDnd = React.useCallback(() => {
    setDraggingIndex(null);
    setOverIndex(null);
    setOverPosition(null);
    if (dragImageRef.current) {
      document.body.removeChild(dragImageRef.current);
      dragImageRef.current = null;
    }
  }, []);

  const handleDragStart = (index: number) => (e: React.DragEvent) => {
    setDraggingIndex(index);
    e.dataTransfer.effectAllowed = "move";
    try {
      e.dataTransfer.setData("text/plain", " ");
    } catch {
      // Ignore error
    }

    const rowEl = e.currentTarget as HTMLElement;
    const rect = rowEl.getBoundingClientRect();

    const tableEl = document.createElement("table");
    tableEl.style.borderCollapse = "collapse";
    tableEl.style.width = `${rect.width}px`;

    const tbodyEl = document.createElement("tbody");
    tableEl.appendChild(tbodyEl);

    const clone = rowEl.cloneNode(true) as HTMLElement;

    const origCells = Array.from(rowEl.querySelectorAll("td")) as HTMLElement[];
    const cloneCells = Array.from(clone.querySelectorAll("td")) as HTMLElement[];
    origCells.forEach((cell, i) => {
      const w = cell.getBoundingClientRect().width;
      if (cloneCells[i]) {
        cloneCells[i].style.width = `${w}px`;
        cloneCells[i].style.maxWidth = `${w}px`;
        cloneCells[i].style.minWidth = `${w}px`;
      }
    });
    tbodyEl.appendChild(clone);

    const wrapper = document.createElement("div");
    wrapper.className = "rounded-md shadow-xl ring-1 ring-primary/30 bg-background";
    wrapper.style.position = "absolute";
    wrapper.style.top = "-10000px";
    wrapper.style.left = "-10000px";
    wrapper.style.pointerEvents = "none";
    wrapper.style.overflow = "hidden";
    wrapper.appendChild(tableEl);
    document.body.appendChild(wrapper);
    dragImageRef.current = wrapper;

    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;
    if (e.dataTransfer.setDragImage) {
      e.dataTransfer.setDragImage(wrapper, Math.max(16, Math.min(offsetX, rect.width - 16)), Math.max(12, Math.min(offsetY, rect.height - 12)));
    }
  };

  const handleDragOver = (rowIndex: number) => (e: React.DragEvent) => {
    e.preventDefault();

    if (draggingIndex === rowIndex) {
      setOverIndex(null);
      return;
    }

    setOverIndex(rowIndex);

    const rowElement = e.currentTarget as HTMLElement;
    const rowRect = rowElement.getBoundingClientRect();
    const rowMiddleY = rowRect.top + rowRect.height / 2;
    const mouseY = e.clientY;

    if (mouseY < rowMiddleY) {
      setOverPosition("above");
      if (draggingIndex === rowIndex - 1) {
        setOverIndex(null);
      }
    } else {
      setOverPosition("below");
      if (draggingIndex === rowIndex + 1) {
        setOverIndex(null);
      }
    }

    e.dataTransfer.dropEffect = "move";
  };

  const handleContainerDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    if (!enableRowReorder)
      return;
    e.preventDefault();
    const container = containerRef.current;
    if (!container)
      return;
    const rowsEls = Array.from(container.querySelectorAll("tbody tr")) as HTMLElement[];
    if (rowsEls.length === 0)
      return;
    const lastEl = rowsEls[rowsEls.length - 1];
    const lastRect = lastEl.getBoundingClientRect();
    if (e.clientY > lastRect.bottom) {
      setOverIndex(rowsEls.length - 1);
      setOverPosition("below");
    }
  };

  const handleDrop = (index: number) => (e: React.DragEvent) => {
    e.preventDefault();
    if (draggingIndex === null) {
      return cleanupDnd();
    }

    const rowCount = table.getRowModel().rows.length;
    const targetIndex = Math.max(0, Math.min(rowCount, index));

    if (draggingIndex === targetIndex || draggingIndex === (overPosition === "above" ? targetIndex - 1 : targetIndex + 1)) {
      return cleanupDnd();
    }

    const originals = table.getRowModel().rows.map((r: any) => r.original as TData);
    callbacks?.onRowReorder?.({ from: originals[draggingIndex], to: originals[targetIndex], position: overPosition! });
    cleanupDnd();
  };

  const handleBatchSave = () => {
    if (pendingChanges.size === 0)
      return;

    const updatedItems: Array<{ row: TData; changes: Record<string, any> }> = [];
    const changesByRow = new Map<number, Record<string, any>>();

    // Group changes by row
    pendingChanges.forEach((value, cellKey) => {
      const [rowIndexStr, columnId] = cellKey.split("-");
      const rowIndex = Number.parseInt(rowIndexStr);

      if (!changesByRow.has(rowIndex)) {
        changesByRow.set(rowIndex, {});
      }
      changesByRow.get(rowIndex)![columnId] = value;
    });

    // Create updated items array
    changesByRow.forEach((changes, rowIndex) => {
      const row = rows[rowIndex];
      if (row) {
        updatedItems.push({ row, changes });
      }
    });

    callbacks?.onBatchSave?.(updatedItems);
    setPendingChanges(new Map());
  };

  const handleBatchCancel = () => {
    setPendingChanges(new Map());
    setEditingCells(new Set());
  };

  return (
    <div className={cn("w-full space-y-4", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={event => callbacks?.onSearchChange?.(event.target.value)}
              className="pl-8 max-w-sm"
              disabled={isLoading}
            />
          </div>

          {/* Inline Save/Cancel buttons */}
          {enableCellEditing && pendingChanges.size > 0 && (
            <>
              <div className="text-sm text-muted-foreground">
                {pendingChanges.size}
                {" "}
                pending
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleBatchCancel}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleBatchSave}
                disabled={isLoading}
              >
                Save
              </Button>
            </>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="bg-transparent" disabled={isLoading}>
                <Settings2 className="mr-2 h-4 w-4" />
                Columns
                {" "}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {table
                .getAllColumns()
                .filter((column: any) => column.getCanHide())
                .map((column: any) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={value => column.toggleVisibility(!!value)}
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div
        ref={containerRef}
        className="relative rounded-md border"
        onDragOver={enableRowReorder ? handleContainerDragOver : undefined}
      >
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup: any) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header: any) => {
                  return (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      style={{
                        width: header.column.columnDef.size !== undefined
                          ? header.getSize()
                          : undefined,
                      }}
                    >
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading
              ? (
                  <TableSkeleton columns={enhancedColumns} />
                )
              : table.getRowModel().rows?.length
                ? (
                    table.getRowModel().rows.map((row: any, idx: number) => (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                        draggable={enableRowReorder}
                        onDragStart={enableRowReorder ? handleDragStart(idx) : undefined}
                        onDragOver={enableRowReorder ? handleDragOver(idx) : undefined}
                        onDrop={enableRowReorder ? handleDrop(idx) : undefined}
                        onDragEnd={enableRowReorder ? cleanupDnd : undefined}
                        className={cn(
                          enableRowReorder && "cursor-grab",
                          draggingIndex === idx && "cursor-grabbing opacity-30 bg-muted/20",
                        )}
                      >
                        {row.getVisibleCells().map((cell: any) => (
                          <TableCell
                            key={cell.id}
                            style={{
                              width: cell.column.columnDef.size,
                              maxWidth: cell.column.columnDef.maxSize,
                              minWidth: cell.column.columnDef.minSize,
                            }}
                          >
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  )
                : (
                    <TableRow>
                      <TableCell colSpan={enhancedColumns.length} className="h-24 text-center">
                        {emptyMessage}
                      </TableCell>
                    </TableRow>
                  )}
          </TableBody>
        </Table>

        {/* Drag and drop indicator */}
        {enableRowReorder && overIndex !== null && draggingIndex !== null && draggingIndex !== overIndex && (
          <div
            className={cn(
              "absolute left-0 right-0 h-1 bg-primary rounded-full mx-2",
            )}
            style={{
              top: (() => {
                if (overPosition === "above") {
                  const targetRow = containerRef.current?.querySelector(`tbody tr:nth-child(${overIndex + 1}`) as HTMLElement;
                  if (targetRow) {
                    return overIndex === 0
                      ? `${targetRow.offsetTop - 0.5}px`
                      : `${targetRow.offsetTop - 0.5}px`;
                  }
                  return "0px";
                } else {
                  const targetRow = containerRef.current?.querySelector(`tbody tr:nth-child(${overIndex + 1}`) as HTMLElement;
                  if (targetRow) {
                    return overIndex === table.getRowModel().rows.length - 1
                      ? "calc(100% - 0.5rem)"
                      : `${targetRow.offsetTop + targetRow.offsetHeight - 1}px`;
                  }
                  return "0px";
                }
              })(),
            }}
          />
        )}
      </div>
      <div className="flex items-center justify-between space-x-2">
        <div className="flex-1 text-sm text-muted-foreground">
          {isLoading
            ? (
                <Skeleton className="h-4 w-32" />
              )
            : (
                <>
                  {table.getFilteredSelectedRowModel().rows.length}
                  {" "}
                  of
                  {table.getFilteredRowModel().rows.length}
                  {" "}
                  row(s)
                  selected.
                </>
              )}
        </div>
        <div className="flex items-center space-x-2">
          {isLoading
            ? (
                <Skeleton className="h-4 w-24" />
              )
            : (
                <p className="text-sm font-medium">
                  Page
                  {" "}
                  {currentPagination.pageIndex + 1}
                  {" "}
                  of
                  {" "}
                  {table.getPageCount()}
                </p>
              )}
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage() || isLoading}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage() || isLoading}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
