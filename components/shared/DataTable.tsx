"use client";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  Row,
  RowSelectionState,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import React, { Dispatch, SetStateAction, useMemo } from "react";
import { cn } from "@/lib/utils";
import { CaretDown, CaretUp, ArrowsDownUp } from "@phosphor-icons/react";

interface DataTableProps<TData> {
  columns: ColumnDef<TData>[];
  data: TData[];
  currentPage?: number;
  setCurrentPage?: (page: number) => void;
  limit?: number;
  refetch?: () => void;
  totalDocs?: number;
  isFetching: boolean;
  onClick?: (row: TData) => void;
  setRowSelection?: Dispatch<SetStateAction<RowSelectionState>>;
  rowSelection?: RowSelectionState;
  sorting?: SortingState;
  setSorting?: Dispatch<SetStateAction<SortingState>>;
  columnVisibility?: VisibilityState;
  onColumnVisibilityChange?: Dispatch<SetStateAction<VisibilityState>>;
  className?: string;
}

export function DataTable<TData>({
  columns,
  data,
  currentPage,
  setCurrentPage,
  limit,
  refetch,
  totalDocs = 1,
  isFetching,
  onClick,
  setRowSelection,
  rowSelection = {},
  sorting = [],
  setSorting,
  columnVisibility = {},
  onColumnVisibilityChange,
  className,
}: DataTableProps<TData>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnVisibilityChange: onColumnVisibilityChange,
    state: { rowSelection, sorting, columnVisibility },
    getRowId: (row) => ((row as any)?.id ? (row as any)?.id.toString() : ""),
    enableRowSelection: true,
    manualPagination: true,
    manualSorting: true,
    getSortedRowModel: getSortedRowModel(),
  });

  const gridTemplateColumns = useMemo(() => {
    return table
      .getVisibleLeafColumns()
      .map((col) => {
        return (col.columnDef.meta as any)?.width || "1fr";
      })
      .join(" ");
  }, [table.getVisibleLeafColumns()]);

  return (
    <div className={cn("flex flex-col h-full overflow-hidden", className)}>
      <div className="flex-1 w-full overflow-auto">
        <div className="w-full min-w-full">
          <div
            className="bg-white border-b grid items-center sticky top-0 z-10 font-medium text-black h-9"
            style={{
              gridTemplateColumns: gridTemplateColumns,
            }}
          >
            {table.getHeaderGroups().map((headerGroup) => (
              <React.Fragment key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <div
                    key={header.id}
                    className="py-4 px-4 flex items-center bg-white border-b h-[52px]"
                    style={{ gridColumn: `span ${header.colSpan}` }}
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        className={cn(
                          "flex items-center gap-1 group/header",
                          header.column.getCanSort()
                            ? "cursor-pointer select-none"
                            : "",
                        )}
                        onClick={header.column.getToggleSortingHandler()}
                        title={
                          header.column.getCanSort()
                            ? header.column.getNextSortingOrder() === "asc"
                              ? "Sort ascending"
                              : header.column.getNextSortingOrder() === "desc"
                                ? "Sort descending"
                                : "Clear sort"
                            : undefined
                        }
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                        {header.column.getCanSort() && (
                          <div
                            className={cn(
                              "ml-1 transition-all",
                              header.column.getIsSorted()
                                ? "opacity-100"
                                : "opacity-0 group-hover/header:opacity-50",
                            )}
                          >
                            {header.column.getIsSorted() === "asc" ? (
                              <CaretUp size={14} weight="bold" />
                            ) : header.column.getIsSorted() === "desc" ? (
                              <CaretDown size={14} weight="bold" />
                            ) : (
                              <ArrowsDownUp size={14} />
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>
          <div className="bg-white pt-4">
            {isFetching ? (
              <div className="py-24 text-center text-gray-500">Loading...</div>
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <div
                  key={row.id}
                  className={cn(
                    "grid items-center border-b hover:bg-gray-50 transition-colors cursor-pointer group data-[state=selected]:bg-gray-100",
                    onClick && "cursor-pointer",
                  )}
                  style={{
                    gridTemplateColumns: gridTemplateColumns,
                  }}
                  data-state={row.getIsSelected() && "selected"}
                  onClick={() => onClick && onClick(row.original)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <div
                      key={cell.id}
                      className="py-4 px-4 text-sm text-gray-700 font-medium overflow-hidden"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </div>
                  ))}
                </div>
              ))
            ) : (
              <div className="py-24 text-center text-gray-500">No results.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
