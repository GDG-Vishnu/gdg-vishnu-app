import type {
  ColumnDef,
  Row,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
  RowSelectionState,
} from "@tanstack/react-table";
import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

// Base table configuration
export interface TableConfig<TData = unknown> {
  // Data and columns
  data: TData[];
  columns: ColumnDef<TData>[];

  // Table settings
  title?: string;
  description?: string;
  searchPlaceholder?: string;
  emptyStateMessage?: string;
  emptyStateDescription?: string;

  // Features
  enableSearch?: boolean;
  enableFilters?: boolean;
  enableSorting?: boolean;
  enablePagination?: boolean;
  enableRowSelection?: boolean;
  enableColumnVisibility?: boolean;
  enableExport?: boolean;
  enableAdvancedFilters?: boolean;

  // Pagination
  initialPageSize?: number;
  pageSizeOptions?: number[];

  // Initial state
  initialSorting?: SortingState;
  initialFilters?: ColumnFiltersState;
  initialColumnVisibility?: VisibilityState;
  initialRowSelection?: RowSelectionState;

  // Styling
  className?: string;
  tableClassName?: string;
  containerClassName?: string;

  // Actions
  onRowClick?: (row: Row<TData>) => void;
  onRowDoubleClick?: (row: Row<TData>) => void;
  onSelectionChange?: (selectedRows: Row<TData>[]) => void;

  // Custom components
  toolbar?: ReactNode;
  actionBar?: ReactNode;
  footer?: ReactNode;

  // Row actions
  rowActions?: TableRowAction<TData>[];

  // Loading state
  isLoading?: boolean;
  loadingRowCount?: number;

  // Error state
  error?: string | Error;

  // Export options
  exportOptions?: ExportOptions;
}

// Column helper for easier column definition
export interface TableColumn<TData = unknown, TValue = unknown> {
  id: string;
  header: string;
  accessorKey?: keyof TData;
  accessorFn?: (row: TData) => TValue;
  cell?: (props: { getValue: () => TValue; row: Row<TData> }) => ReactNode;

  // Column properties
  sortable?: boolean;
  filterable?: boolean;
  searchable?: boolean;
  hideable?: boolean;
  width?: number;
  minWidth?: number;
  maxWidth?: number;

  // Filter configuration
  filterVariant?:
    | "text"
    | "select"
    | "multiSelect"
    | "range"
    | "date"
    | "boolean";
  filterOptions?: Array<{ label: string; value: string; icon?: LucideIcon }>;

  // Display
  align?: "left" | "center" | "right";
  className?: string;
  headerClassName?: string;
  cellClassName?: string;
}

// Row action configuration
export interface TableRowAction<TData = unknown> {
  id: string;
  label: string;
  icon?: LucideIcon;
  onClick: (row: Row<TData>) => void;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  disabled?: (row: Row<TData>) => boolean;
  hidden?: (row: Row<TData>) => boolean;
  tooltip?: string;
}

// Export configuration
export interface ExportOptions {
  filename?: string;
  formats?: Array<"csv" | "excel" | "pdf">;
  includeFiltered?: boolean;
  includeSelected?: boolean;
}

// Table theme configuration
export interface TableTheme {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    muted: string;
    border: string;
  };
  spacing: {
    padding: string;
    margin: string;
  };
  typography: {
    fontSize: string;
    fontWeight: string;
  };
}

// Preset configurations for common table types
export type TablePreset =
  | "default"
  | "compact"
  | "comfortable"
  | "data-heavy"
  | "admin"
  | "dashboard"
  | "report";

// Quick column builder utilities
export type QuickColumnType =
  | "text"
  | "number"
  | "currency"
  | "date"
  | "datetime"
  | "boolean"
  | "status"
  | "avatar"
  | "badge"
  | "actions";

export interface QuickColumn {
  key: string;
  label: string;
  type: QuickColumnType;
  options?: {
    format?: string;
    currency?: string;
    statusOptions?: Array<{ value: string; label: string; variant?: string }>;
    badgeVariant?: string;
    avatarFallback?: string;
  };
}

// Table builder configuration
export interface TableBuilder<TData = unknown> {
  data: TData[];
  preset?: TablePreset;
  theme?: TableTheme;
  quickColumns?: QuickColumn[];
  customColumns?: TableColumn<TData>[];
  config?: Partial<TableConfig<TData>>;
}
