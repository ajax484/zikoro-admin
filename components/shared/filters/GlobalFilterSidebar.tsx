"use client";

import React, { useCallback, useMemo, useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { FilterConfig } from "@/types/filters";
import { FilterInputMapper } from "./FilterInputMapper";
import { Funnel } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

interface GlobalFilterSidebarProps {
  configs: FilterConfig[];
  triggerLabel?: string;
  triggerClassName?: string;
  customTrigger?: React.ReactNode;
}

export const GlobalFilterSidebar: React.FC<GlobalFilterSidebarProps> = ({
  configs,
  triggerLabel = "Filter",
  triggerClassName,
  customTrigger,
}) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Local state for pending filters
  const [localFilters, setLocalFilters] = useState<Record<string, string[]>>(
    {},
  );
  const [isOpen, setIsOpen] = useState(false);

  // Track previous open state so we only re-initialize when the sidebar
  // *opens* (false → true), not every time configs re-renders while open.
  const prevIsOpenRef = useRef(false);

  useEffect(() => {
    if (isOpen && !prevIsOpenRef.current) {
      const initialFilters: Record<string, string[]> = {};
      configs.forEach((config) => {
        if (config.type === "date-range") {
          const start = searchParams.get(`${config.id}_start`) || "";
          const end   = searchParams.get(`${config.id}_end`)   || "";
          initialFilters[config.id] = (start || end) ? [start, end] : [];
        } else {
          const value = searchParams.get(config.id);
          initialFilters[config.id] = value ? value.split(",") : [];
        }
      });
      setLocalFilters(initialFilters);
    }
    prevIsOpenRef.current = isOpen;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, configs, searchParams]);

  const handleLocalChange = useCallback((id: string, values: string[]) => {
    setLocalFilters((prev) => ({
      ...prev,
      [id]: values,
    }));
  }, []);

  const applyFilters = useCallback(
    (filters: Record<string, string[]>) => {
      const params = new URLSearchParams(searchParams.toString());

      configs.forEach((config) => {
        const values = filters[config.id] ?? [];
        if (config.type === "date-range") {
          const [start = "", end = ""] = values;
          if (start) params.set(`${config.id}_start`, start);
          else params.delete(`${config.id}_start`);
          if (end) params.set(`${config.id}_end`, end);
          else params.delete(`${config.id}_end`);
          params.delete(config.id);
        } else if (!values || values.length === 0 || (values.length === 1 && values[0] === "")) {
          params.delete(config.id);
        } else {
          params.set(config.id, values.join(","));
        }
      });

      // Reset page to 1 whenever a filter changes
      if (params.has("page")) {
        params.set("page", "1");
      }

      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
      setIsOpen(false);
    },
    [searchParams, pathname, router, configs],
  );

  const handleApply = useCallback(() => {
    applyFilters(localFilters);
  }, [localFilters, applyFilters]);

  const handleReset = useCallback(() => {
    const clearedFilters: Record<string, string[]> = {};
    configs.forEach((config) => {
      clearedFilters[config.id] = [];
    });
    setLocalFilters(clearedFilters);
    applyFilters(clearedFilters);
  }, [configs, applyFilters]);

  // Count active filters in local state
  const activeFiltersCount = useMemo(() => {
    return Object.values(localFilters).filter(
      (values) => values && values.length > 0 && values[0] !== "",
    ).length;
  }, [localFilters]);

  // Count active filters in URL for the trigger badge
  const urlActiveFiltersCount = useMemo(() => {
    return configs.reduce((acc, config) => {
      if (config.type === "date-range") {
        return (searchParams.has(`${config.id}_start`) || searchParams.has(`${config.id}_end`)) ? acc + 1 : acc;
      }
      return searchParams.has(config.id) ? acc + 1 : acc;
    }, 0);
  }, [configs, searchParams]);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        {customTrigger ? (
          customTrigger
        ) : (
          <Button
            variant="ghost"
            className={cn(
              "h-9 group flex gap-1.5 items-center text-zinc-500 hover:text-zinc-900 border-0 shadow-none px-2 transition-all duration-300",
              triggerClassName,
            )}
          >
            <Funnel size={16} weight="bold" />
            <span className="text-xs font-bold transition-all duration-300 opacity-0 group-hover:opacity-100 whitespace-nowrap overflow-hidden max-w-0 group-hover:max-w-[100px]">
              {triggerLabel}
            </span>
            {urlActiveFiltersCount > 0 && (
              <span className="ml-1 flex h-4 w-4 items-center justify-center rounded-full bg-basePrimary text-[10px] text-white">
                {urlActiveFiltersCount}
              </span>
            )}
          </Button>
        )}
      </SheetTrigger>
      <SheetContent className="overflow-y-auto z-[100] flex flex-col px-4">
        <SheetHeader>
          <SheetTitle>Filter Results</SheetTitle>
        </SheetHeader>

        <div className="mt-4 flex-1 space-y-6 pb-48 h-[calc(100vh-100px)] overflow-auto no-scrollbar">
          {configs.map((config) => {
            const currentValue = localFilters[config.id] || [];

            return (
              <FilterInputMapper
                key={config.id}
                config={config}
                currentValue={currentValue}
                onChange={(newValues) =>
                  handleLocalChange(config.id, newValues)
                }
              />
            );
          })}
        </div>

        <div className="absolute bottom-0 left-0 flex w-full flex-col gap-3 border-t bg-white p-6 pb-8">
          <div className="flex gap-2 items-center">
            <Button
              size={"sm"}
              onClick={handleApply}
              variant="outline"
              className="w-full"
            >
              Apply
              <span className="rounded-full bg-basePrimary text-white px-2 py-0.5 ml-2">
                {activeFiltersCount}
              </span>
            </Button>

            <Button
              variant="destructive"
              size={"sm"}
              onClick={handleReset}
              className="w-full"
            >
              Reset All
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
