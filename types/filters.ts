export type FilterType =
  | "multiselect"
  | "select"
  | "text"
  | "boolean"
  | "date-range"
  | "number"
  | "number-range";

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterConfig {
  id: string; // The URL query parameter key (e.g., 'status')
  label: string; // Display label (e.g., 'Status')
  type: FilterType; // How to render the input
  options?: FilterOption[]; // Required for select/multiselect
  asyncOptions?: () => Promise<FilterOption[]>; // For dynamically loading lists
  placeholder?: string; // e.g. "Search by name"
  min?: number; // Optional metadata for numeric ranges
  max?: number; // Optional metadata for numeric ranges
}
