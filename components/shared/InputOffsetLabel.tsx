import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import React from "react";
import { cn } from "@/lib/utils";

export default function InputOffsetLabel({
  children,
  label,
  isRequired,
  append,
  prepend,
  className,
  showMessage = true,
}: {
  children: React.ReactNode;
  label: string;
  isRequired?: boolean;
  append?: React.ReactNode;
  prepend?: React.ReactNode;
  className?: string;
  showMessage?: boolean;
}) {
  return (
    <FormItem className={cn("relative space-y-4 w-full", className)}>
      <FormLabel className="font-medium text-xs text-gray-600 capitalize">
        {label}
        {isRequired && <sup className="text-red-700">*</sup>}
      </FormLabel>
      <FormControl className="!mt-0">
        <div
          className={`w-full bg-gray-50 rounded-lg placeholder-gray-600 relative h-fit border flex gap-0.5 p-0.5 items-center`}
        >
          {append && <div>{append}</div>}
          {prepend && <div>{prepend}</div>}
          <div className="flex-1 min-w-0">{children}</div>
        </div>
      </FormControl>

      {showMessage && <FormMessage />}
    </FormItem>
  );
}
