import { Column } from "@tanstack/react-table";
import { ArrowUpNarrowWide, ArrowDownNarrowWide, ArrowUpDown } from "lucide-react";
import { Button } from "./button";

type SortableHeaderProps<TData> = {
  column: Column<TData, unknown>;
  title: string;
  className?: string;
}

export function SortableHeader<TData>({ column, title, className }: SortableHeaderProps<TData>) {
  const sortState = column.getIsSorted() as false | "asc" | "desc";
  
  const getSortIcon = () => {
    if (sortState === "asc") return <ArrowUpNarrowWide className="ml-2 h-4 w-4 text-muted-foreground" />;
    if (sortState === "desc") return <ArrowDownNarrowWide className="ml-2 h-4 w-4 text-muted-foreground" />;
    return <ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground" />;
  };

  const handleSort = () => {
    if (sortState === "asc") {
      column.toggleSorting(true);
    } else if (sortState === "desc") {
      column.clearSorting();
    } else {
      column.toggleSorting(false);
    }
  };

  return (
    <Button
      variant="ghost"
      onClick={handleSort}
      className={`h-8 -ml-3 p-0 hover:bg-transparent ${className || ""}`}
    >
      {title}
      {getSortIcon()}
    </Button>
  );
}
