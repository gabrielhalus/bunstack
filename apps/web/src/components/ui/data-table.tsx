import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from "@tanstack/react-table"
import { ChevronDown, Search, Settings2 } from "lucide-react"
import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[] | undefined
  isLoading?: boolean
  searchPlaceholder?: string
  onSearchChange?: (value: string) => void
  searchValue?: string
  pageCount?: number
  pagination?: {
    pageIndex: number
    pageSize: number
  }
  onPaginationChange?: (pagination: { pageIndex: number; pageSize: number }) => void
  manualPagination?: boolean
  enableRowReorder?: boolean
  onReorder?: (args: { from: TData, to: TData, position: "above" | "below" }) => void
}

function TableSkeleton({ columns }: { columns: ColumnDef<any, any>[] }) {
  return (
    <>
      {Array.from({ length: 5 }).map((_, rowIndex) => (
        <TableRow key={rowIndex}>
          {columns.map((_, colIndex) => (
            <TableCell key={colIndex}>
              <Skeleton className="h-4 w-full" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  )
}

export function DataTable<TData, TValue>({
  columns,
  data,
  isLoading = false,
  searchPlaceholder = "Search...",
  onSearchChange,
  searchValue = "",
  pageCount,
  pagination: externalPagination,
  onPaginationChange,
  manualPagination = false,
  enableRowReorder,
  onReorder,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [internalPagination, setInternalPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  })
  const [draggingIndex, setDraggingIndex] = React.useState<number | null>(null)
  const [overIndex, setOverIndex] = React.useState<number | null>(null)
  const [overPosition, setOverPosition] = React.useState<'above' | 'below' | null>(null)
  const dragImageRef = React.useRef<HTMLDivElement | null>(null)

  const containerRef = React.useRef<HTMLDivElement>(null)

  const cleanupDnd = React.useCallback(() => {
    setDraggingIndex(null)
    setOverIndex(null)
    setOverPosition(null)
    if (dragImageRef.current) {
      document.body.removeChild(dragImageRef.current)
      dragImageRef.current = null
    }
  }, [])

  const handleDragStart = (index: number) => (e: React.DragEvent) => {
    setDraggingIndex(index)
    e.dataTransfer.effectAllowed = "move"
    // needed for some browsers to initiate a drag
    try { e.dataTransfer.setData("text/plain", " "); } catch {}

    const rowEl = e.currentTarget as HTMLElement
    const rect = rowEl.getBoundingClientRect()

    // Build a proper table structure so the <tr> renders correctly
    const tableEl = document.createElement("table")
    tableEl.style.borderCollapse = "collapse"
    tableEl.style.width = rect.width + "px"

    const tbodyEl = document.createElement("tbody")
    tableEl.appendChild(tbodyEl)

    const clone = rowEl.cloneNode(true) as HTMLElement

    // Fix clone cell widths so layout stays identical
    const origCells = Array.from(rowEl.querySelectorAll("td")) as HTMLElement[]
    const cloneCells = Array.from(clone.querySelectorAll("td")) as HTMLElement[]
    origCells.forEach((cell, i) => {
      const w = cell.getBoundingClientRect().width
      if (cloneCells[i]) {
        cloneCells[i].style.width = w + "px"
        cloneCells[i].style.maxWidth = w + "px"
        cloneCells[i].style.minWidth = w + "px"
      }
    })
    tbodyEl.appendChild(clone)

    // Wrapper for styling and to be used as the drag image
    const wrapper = document.createElement("div")
    wrapper.className = "rounded-md shadow-xl ring-1 ring-primary/30 bg-background"
    wrapper.style.position = "absolute"
    wrapper.style.top = "-10000px"
    wrapper.style.left = "-10000px"
    wrapper.style.pointerEvents = "none"
    wrapper.style.overflow = "hidden"
    wrapper.appendChild(tableEl)
    document.body.appendChild(wrapper)
    dragImageRef.current = wrapper

    const offsetX = e.clientX - rect.left
    const offsetY = e.clientY - rect.top
    if (e.dataTransfer.setDragImage) {
      e.dataTransfer.setDragImage(wrapper, Math.max(16, Math.min(offsetX, rect.width - 16)), Math.max(12, Math.min(offsetY, rect.height - 12)))
    }
  }

  const handleDragOver = (rowIndex: number) => (e: React.DragEvent) => {
    e.preventDefault();

    // If dragging over the row we're already dragging, clear the overIndex and exit
    if (draggingIndex === rowIndex) {
      setOverIndex(null);
      return;
    }

    setOverIndex(rowIndex);

    // Determine if the mouse is in the upper or lower half of the row
    const rowElement = e.currentTarget as HTMLElement;
    const rowRect = rowElement.getBoundingClientRect();
    const rowMiddleY = rowRect.top + rowRect.height / 2;
    const mouseY = e.clientY;

    if (mouseY < rowMiddleY) {
      setOverPosition('above');
      // If dragging from immediately above, don't show indicator
      if (draggingIndex === rowIndex - 1) {
        setOverIndex(null);
      }
    } else {
      setOverPosition('below');
      // If dragging from immediately below, don't show indicator
      if (draggingIndex === rowIndex + 1) {
        setOverIndex(null);
      }
    }

    // Indicate a move operation for the drag
    e.dataTransfer.dropEffect = "move";
  }

  const handleContainerDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    if (!enableRowReorder) return
    e.preventDefault()
    const container = containerRef.current
    if (!container) return
    const rowsEls = Array.from(container.querySelectorAll('tbody tr')) as HTMLElement[]
    if (rowsEls.length === 0) return
    const lastEl = rowsEls[rowsEls.length - 1]
    const lastRect = lastEl.getBoundingClientRect()
    if (e.clientY > lastRect.bottom) {
      setOverIndex(rowsEls.length - 1)
      setOverPosition('below')
    }
  }

  const handleDrop = (index: number) => (e: React.DragEvent) => {
    e.preventDefault()
    if (draggingIndex === null) {
      return cleanupDnd()
    }

    const rowCount = table.getRowModel().rows.length
    const targetIndex = Math.max(0, Math.min(rowCount, index))

    if (draggingIndex === targetIndex || draggingIndex === (overPosition === "above" ? targetIndex - 1 : targetIndex + 1)) {
      return cleanupDnd()
    }
    
    const originals = table.getRowModel().rows.map(r => r.original as TData);
    onReorder?.({ from: originals[draggingIndex], to: originals[targetIndex], position: overPosition! });
    cleanupDnd()
  }

  const currentPagination = externalPagination || internalPagination
  const handlePaginationChange = React.useCallback(
    (updaterOrValue: any) => {
      const newPagination = typeof updaterOrValue === 'function' 
        ? updaterOrValue(currentPagination) 
        : updaterOrValue
      
      if (onPaginationChange) {
        onPaginationChange(newPagination)
      } else {
        setInternalPagination(newPagination)
      }
    },
    [currentPagination, onPaginationChange]
  )

  const rows = React.useMemo(() => {
    return data || []
  }, [data])

  const table = useReactTable({
    data: rows,
    columns,
    defaultColumn: {
      size: undefined,
      maxSize: undefined,
      minSize: undefined,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
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
  })

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(event) => onSearchChange?.(event.target.value)}
              className="pl-8 max-w-sm"
              disabled={isLoading}
            />
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto bg-transparent" disabled={isLoading}>
              <Settings2 className="mr-2 h-4 w-4" />
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div
        ref={containerRef}
        className="relative rounded-md border"
        onDragOver={enableRowReorder ? handleContainerDragOver : undefined}
      >
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
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
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableSkeleton columns={columns} />
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, idx) => (
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
                    draggingIndex === idx && "cursor-grabbing opacity-50 bg-muted/40 ring-1 ring-primary/20",
                  )}
                >
                  {row.getVisibleCells().map((cell) => (
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
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )} 
          </TableBody>
        </Table>
        
        {/* Unified indicator system - handles all cases outside the table structure */}
        {enableRowReorder && overIndex !== null && draggingIndex !== null && draggingIndex !== overIndex && (
          <div 
            className={cn(
              "absolute left-0 right-0 h-1 bg-primary rounded-full mx-2",
            )}
            style={{
              top: (() => {
                if (overPosition === 'above') {
                  // Position above the target row - center on the top border
                  const targetRow = containerRef.current?.querySelector(`tbody tr:nth-child(${overIndex + 1}`) as HTMLElement
                  if (targetRow) {
                    return overIndex === 0 
                      ? `${targetRow.offsetTop - 0.5}px` // Above first row - use actual row position
                      : `${targetRow.offsetTop - 0.5}px` // Above other rows
                    } 
                  return '0px'
                } else {
                  // Position below the target row - center on the bottom border
                  const targetRow = containerRef.current?.querySelector(`tbody tr:nth-child(${overIndex + 1}`) as HTMLElement
                  if (targetRow) {
                    return overIndex === table.getRowModel().rows.length - 1 
                      ? 'calc(100% - 0.5rem)' // Below last row
                      : `${targetRow.offsetTop + targetRow.offsetHeight - 1}px` // Below the row
                  }
                  return '0px'
                }
              })()
            }}
          />
        )}
      </div>
      <div className="flex items-center justify-between space-x-2">
        <div className="flex-1 text-sm text-muted-foreground">
          {isLoading ? (
            <Skeleton className="h-4 w-32" />
          ) : (
            <>
              {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s)
              selected.
            </>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {isLoading ? (
            <Skeleton className="h-4 w-24" />
          ) : (
            <p className="text-sm font-medium">
              Page {currentPagination.pageIndex + 1} of {table.getPageCount()}
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
  )
}
