"use client";

import React, { useState, useEffect } from "react";
import { FilterConfig, FilterOption } from "@/types/filters";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  CaretDown as CaretDownIcon,
  X as XIcon,
  MagnifyingGlass as MagnifyingGlassIcon,
  CalendarBlank as CalendarIcon,
} from "@phosphor-icons/react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Combobox } from "@/components/ui/combobox";

interface FilterInputMapperProps {
  config: FilterConfig;
  currentValue: string[];
  onChange: (newValues: string[]) => void;
}

export const FilterInputMapper: React.FC<FilterInputMapperProps> = ({
  config,
  currentValue,
  onChange,
}) => {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium uppercase text-gray-500">
        {config.label}
      </Label>
      {renderInput(config, currentValue, onChange)}
    </div>
  );
};

const renderInput = (
  config: FilterConfig,
  currentValue: string[],
  onChange: (newValues: string[]) => void,
) => {
  switch (config.type) {
    case "multiselect":
      return (
        <MultiSelectFilter
          config={config}
          currentValue={currentValue}
          onChange={onChange}
        />
      );
    case "select":
      return (
        <SelectFilter
          config={config}
          currentValue={currentValue}
          onChange={onChange}
        />
      );
    case "text":
      return (
        <TextSearchFilter
          config={config}
          currentValue={currentValue}
          onChange={onChange}
        />
      );
    case "date-range":
      return (
        <DateRangeFilter
          config={config}
          currentValue={currentValue}
          onChange={onChange}
        />
      );
    case "number":
      return (
        <NumberFilter
          config={config}
          currentValue={currentValue}
          onChange={onChange}
        />
      );
    case "number-range":
      return (
        <NumberRangeFilter
          config={config}
          currentValue={currentValue}
          onChange={onChange}
        />
      );
    case "boolean":
      return (
        <BooleanFilter
          config={config}
          currentValue={currentValue}
          onChange={onChange}
        />
      );
    default:
      return <div>Unsupported filter type: {config.type}</div>;
  }
};

const NumberFilter = ({
  config,
  currentValue,
  onChange,
}: {
  config: FilterConfig;
  currentValue: string[];
  onChange: (newValues: string[]) => void;
}) => {
  const minLimit = config.min ?? 0;
  const maxLimit = config.max ?? 1000;
  const step = 1;

  const valStr = currentValue[0] || "";
  const val =
    valStr === ""
      ? minLimit
      : Math.max(minLimit, Math.min(maxLimit, parseInt(valStr)));

  const handleInputChange = (newVal: string) => {
    onChange(newVal === "" ? [] : [newVal]);
  };

  const handleSliderChange = (vals: number[]) => {
    onChange([vals[0].toString()]);
  };

  return (
    <div className="space-y-4 px-1 pt-2">
      <Slider
        min={minLimit}
        max={maxLimit}
        step={step}
        value={[val]}
        onValueChange={handleSliderChange}
        className="mb-6"
      />
      <div className="relative">
        <Input
          type="number"
          placeholder={config.placeholder || "Enter value"}
          value={valStr}
          onChange={(e) => handleInputChange(e.target.value)}
          className="w-full text-sm"
          min={minLimit}
          max={maxLimit}
        />
      </div>
    </div>
  );
};

const SelectFilter = ({
  config,
  currentValue,
  onChange,
}: {
  config: FilterConfig;
  currentValue: string[];
  onChange: (newValues: string[]) => void;
}) => {
  const [options, setOptions] = useState<FilterOption[]>(config.options || []);
  const [loading, setLoading] = useState(
    !config.options && !!config.asyncOptions,
  );

  useEffect(() => {
    if (config.options) {
      setOptions(config.options);
    }
  }, [config.options]);

  useEffect(() => {
    if (config.asyncOptions) {
      setLoading(true);
      config.asyncOptions().then((opts) => {
        setOptions(opts);
        setLoading(false);
      });
    }
  }, [config.asyncOptions]);

  const value = currentValue[0] || "";

  return (
    <div className="space-y-2">
      <Combobox
        options={options}
        value={value}
        onChange={(val) => onChange(val === "" ? [] : [val])}
        placeholder={config.placeholder || "Select option..."}
        isLoading={loading}
        contentClassName="z-[105]"
      />
    </div>
  );
};

const NumberRangeFilter = ({
  config,
  currentValue,
  onChange,
}: {
  config: FilterConfig;
  currentValue: string[];
  onChange: (newValues: string[]) => void;
}) => {
  const minLimit = config.min ?? 0;
  const maxLimit = config.max ?? 1000; // Reasonable default for stock
  const step = 1;

  const minValStr = currentValue[0] || "";
  const maxValStr = currentValue[1] || "";

  const minVal =
    minValStr === "" ? minLimit : Math.max(minLimit, parseInt(minValStr));
  const maxVal =
    maxValStr === "" ? maxLimit : Math.min(maxLimit, parseInt(maxValStr));

  const handleMinChange = (val: string) => {
    if (!val && !maxValStr) {
      onChange([]);
    } else {
      onChange([val, maxValStr]);
    }
  };

  const handleMaxChange = (val: string) => {
    if (!minValStr && !val) {
      onChange([]);
    } else {
      onChange([minValStr, val]);
    }
  };

  const handleSliderChange = (vals: number[]) => {
    onChange([vals[0].toString(), vals[1].toString()]);
  };

  return (
    <div className="space-y-4 px-1 pt-2">
      <Slider
        min={minLimit}
        max={maxLimit}
        step={step}
        value={[minVal, maxVal]}
        onValueChange={handleSliderChange}
        className="mb-6"
      />
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Input
            type="number"
            placeholder="Min"
            value={minValStr}
            onChange={(e) => handleMinChange(e.target.value)}
            className="w-full text-sm"
            min={minLimit}
            max={maxVal}
          />
        </div>
        <span className="text-gray-400 text-sm">to</span>
        <div className="relative flex-1">
          <Input
            type="number"
            placeholder="Max"
            value={maxValStr}
            onChange={(e) => handleMaxChange(e.target.value)}
            className="w-full text-sm"
            min={minVal}
            max={maxLimit}
          />
        </div>
      </div>
    </div>
  );
};

const MultiSelectFilter = ({
  config,
  currentValue,
  onChange,
}: {
  config: FilterConfig;
  currentValue: string[];
  onChange: (newValues: string[]) => void;
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [options, setOptions] = useState<FilterOption[]>(config.options || []);
  const [loading, setLoading] = useState(
    !config.options && !!config.asyncOptions,
  );

  useEffect(() => {
    if (config.options) {
      setOptions(config.options);
    }
  }, [config.options]);

  useEffect(() => {
    if (config.asyncOptions) {
      setLoading(true);
      config.asyncOptions().then((opts) => {
        setOptions(opts);
        setLoading(false);
      });
    }
  }, [config.asyncOptions]);

  const toggleOption = (value: string) => {
    if (currentValue.includes(value)) {
      onChange(currentValue.filter((v) => v !== value));
    } else {
      onChange([...currentValue, value]);
    }
  };

  const removeOption = (value: string) => {
    onChange(currentValue.filter((v) => v !== value));
  };

  const filteredOptions = options.filter((o) =>
    (o.label ?? "").toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-between">
            <span className="text-sm text-gray-600 truncate mr-2">
              {currentValue.length === 0
                ? config.placeholder || "Select options..."
                : `${currentValue.length} selected`}
            </span>
            <CaretDownIcon
              size={16}
              weight="bold"
              className="text-gray-400 shrink-0"
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-2 z-[105]">
          <div className="space-y-2">
            <div className="relative">
              <Input
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
              <MagnifyingGlassIcon
                size={16}
                weight="bold"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
            </div>

            <div className="max-h-[300px] overflow-y-auto space-y-1">
              {loading ? (
                <div className="p-2 text-sm text-gray-500">Loading...</div>
              ) : filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <div
                    key={option.value}
                    className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
                    onClick={() => toggleOption(option.value)}
                  >
                    <Checkbox
                      checked={currentValue.includes(option.value)}
                      onCheckedChange={() => toggleOption(option.value)}
                    />
                    <Label className="text-sm cursor-pointer flex-1">
                      {option.label}
                    </Label>
                  </div>
                ))
              ) : (
                <div className="p-2 text-sm text-gray-500">
                  No results found
                </div>
              )}
            </div>
          </div>
        </PopoverContent>
      </Popover>
      {/* Selected chips */}
      {currentValue.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {currentValue.map((val) => {
            const option = options.find((o) => o.value === val);
            return (
              <Badge
                key={val}
                variant="secondary"
                className="flex items-center gap-1 pr-1 truncate max-w-[200px]"
                title={option?.label || val}
              >
                <span className="text-xs truncate">{option?.label || val}</span>
                <button
                  onClick={() => removeOption(val)}
                  className="ml-1 hover:bg-gray-300 rounded-full p-0.5 transition-colors shrink-0"
                >
                  <XIcon size={12} weight="bold" />
                </button>
              </Badge>
            );
          })}
        </div>
      )}
    </div>
  );
};

const TextSearchFilter = ({
  config,
  currentValue,
  onChange,
}: {
  config: FilterConfig;
  currentValue: string[];
  onChange: (newValues: string[]) => void;
}) => {
  const val = currentValue[0] || "";

  return (
    <div className="relative">
      <Input
        placeholder={config.placeholder || "Search..."}
        value={val}
        onChange={(e) => {
          const newVal = e.target.value;
          onChange(newVal.trim() === "" ? [] : [newVal]);
        }}
        className="pl-9"
        autoComplete="off"
      />
      <MagnifyingGlassIcon
        size={16}
        weight="bold"
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
      />
      {val && (
        <button
          onClick={() => onChange([])}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          <XIcon size={14} weight="bold" />
        </button>
      )}
    </div>
  );
};

const DateRangeFilter = ({
  config,
  currentValue,
  onChange,
}: {
  config: FilterConfig;
  currentValue: string[];
  onChange: (newValues: string[]) => void;
}) => {
  // We expect currentValue to be either empty or ["YYYY-MM-DD", "YYYY-MM-DD"]
  const startDate = currentValue[0] || "";
  const endDate = currentValue[1] || "";

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStart = e.target.value;
    if (!newStart && !endDate) {
      onChange([]);
    } else {
      onChange([newStart, endDate]);
    }
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEnd = e.target.value;
    if (!startDate && !newEnd) {
      onChange([]);
    } else {
      onChange([startDate, newEnd]);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <div className="relative flex-1">
        <Input
          type="date"
          value={startDate}
          onChange={handleStartDateChange}
          className="w-full text-sm"
          max={endDate || undefined}
        />
      </div>
      <span className="text-gray-400 text-sm">to</span>
      <div className="relative flex-1">
        <Input
          type="date"
          value={endDate}
          onChange={handleEndDateChange}
          className="w-full text-sm"
          min={startDate || undefined}
        />
      </div>
    </div>
  );
};

const BooleanFilter = ({
  config,
  currentValue,
  onChange,
}: {
  config: FilterConfig;
  currentValue: string[];
  onChange: (newValues: string[]) => void;
}) => {
  const value = currentValue[0] || "";

  const trueLabel =
    config.options?.find((o) => o.value === "true")?.label || "Yes";
  const falseLabel =
    config.options?.find((o) => o.value === "false")?.label || "No";

  return (
    <Select
      value={value}
      onValueChange={(val) => onChange(val === "clear" ? [] : [val])}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder={config.placeholder || "Select..."} />
      </SelectTrigger>
      <SelectContent className="z-[105]">
        <SelectItem value="clear" className="text-gray-500 italic">
          All
        </SelectItem>
        <SelectItem value="true">{trueLabel}</SelectItem>
        <SelectItem value="false">{falseLabel}</SelectItem>
      </SelectContent>
    </Select>
  );
};
