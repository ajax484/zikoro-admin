import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

interface TablePaginationProps {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  isLoading?: boolean;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  className?: string;
  children?: React.ReactNode;
  isMinified?: boolean;
}

export const TablePagination = ({
  total,
  page,
  limit,
  totalPages,
  isLoading,
  onPageChange,
  onLimitChange,
  className,
  children,
  isMinified,
}: TablePaginationProps) => {
  return (
    <div
      className={cn("flex items-center justify-between py-3 px-2 h-16", className)}
    >
      {!isMinified && (
        <div className="text-xs text-gray-600">Total Records {total}</div>
      )}
      <div className="flex items-center gap-4">
        <div className={cn("flex items-center gap-2 text-xs text-gray-600")}>
          {!isMinified && <span>Records per page:</span>}
          <Select
            value={(limit || 10).toString()}
            onValueChange={(value) => {
              onLimitChange(parseInt(value));
            }}
          >
            <SelectTrigger className="w-20 h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <button
              className="p-1 hover:bg-gray-100 rounded disabled:opacity-50 transition-colors"
              onClick={() => onPageChange(Math.max(1, page - 1))}
              disabled={page === 1 || isLoading}
            >
              <CaretLeft size={16} weight="bold" />
            </button>

            <span>
              Page {page} of {totalPages || 1}
            </span>

            <button
              className="p-1 hover:bg-gray-100 rounded disabled:opacity-50 transition-colors"
              onClick={() => onPageChange(Math.min(totalPages, page + 1))}
              disabled={page >= totalPages || isLoading}
            >
              <CaretRight size={16} weight="bold" />
            </button>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};
