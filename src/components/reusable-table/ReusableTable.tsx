"use client";

import {
  createColumnHelper,
  type ColumnDef,
  flexRender,
} from "@tanstack/react-table";
import { Search, Download } from "lucide-react";
import { useMemo } from "react";

import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { DataTableViewOptions } from "@/components/data-table/data-table-view-options";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useDataTable } from "@/hooks/use-data-table";
import { getCommonPinningStyles } from "@/lib/data-table";
import { cn } from "@/lib/utils";
import type {
  TableConfig,
  QuickColumn,
  QuickColumnType,
  TablePreset,
} from "@/types/reusable-table";

// Preset configurations
const tablePresets: Record<TablePreset, Partial<TableConfig>> = {
  default: {
    enableSearch: true,
    enableFilters: true,
    enableSorting: true,
    enablePagination: true,
    enableColumnVisibility: true,
    initialPageSize: 10,
    pageSizeOptions: [10, 20, 30, 40, 50],
  },
  compact: {
    enableSearch: true,
    enableSorting: true,
    enablePagination: true,
    initialPageSize: 20,
    pageSizeOptions: [20, 50, 100],
    tableClassName: "text-sm",
  },
  comfortable: {
    enableSearch: true,
    enableFilters: true,
    enableSorting: true,
    enablePagination: true,
    enableColumnVisibility: true,
    enableRowSelection: true,
    initialPageSize: 10,
    pageSizeOptions: [5, 10, 20, 30],
    tableClassName: "text-base",
  },
  "data-heavy": {
    enableSearch: true,
    enableFilters: true,
    enableAdvancedFilters: true,
    enableSorting: true,
    enablePagination: true,
    enableColumnVisibility: true,
    enableExport: true,
    initialPageSize: 50,
    pageSizeOptions: [25, 50, 100, 200],
  },
  admin: {
    enableSearch: true,
    enableFilters: true,
    enableSorting: true,
    enablePagination: true,
    enableColumnVisibility: true,
    enableRowSelection: true,
    enableExport: true,
    initialPageSize: 20,
    pageSizeOptions: [10, 20, 50, 100],
  },
  dashboard: {
    enableSearch: false,
    enableFilters: false,
    enableSorting: true,
    enablePagination: false,
    enableColumnVisibility: false,
    tableClassName: "text-sm",
  },
  report: {
    enableSearch: true,
    enableFilters: true,
    enableSorting: true,
    enablePagination: true,
    enableExport: true,
    initialPageSize: 25,
    pageSizeOptions: [25, 50, 100, 500],
  },
};

// Quick column type renderers
const renderQuickColumn = (
  type: QuickColumnType,
  value: unknown,
  options?: QuickColumn["options"]
) => {
  switch (type) {
    case "text":
      return <span className="font-medium">{String(value || "")}</span>;

    case "number":
      return (
        <span className="font-mono text-right">
          {Number(value).toLocaleString()}
        </span>
      );

    case "currency":
      return (
        <span className="font-mono text-right">
          {new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: options?.currency || "USD",
          }).format(Number(value) || 0)}
        </span>
      );

    case "date":
      return (
        <span className="text-muted-foreground">
          {value ? new Date(value as string).toLocaleDateString() : ""}
        </span>
      );

    case "datetime":
      return (
        <span className="text-muted-foreground text-sm">
          {value ? new Date(value as string).toLocaleString() : ""}
        </span>
      );

    case "boolean":
      return (
        <Badge variant={value ? "default" : "secondary"}>
          {value ? "Yes" : "No"}
        </Badge>
      );

    case "status":
      const statusValue = String(value || "");
      const statusOption = options?.statusOptions?.find(
        (opt) => opt.value === statusValue
      );
      return (
        <Badge variant={(statusOption?.variant as never) || "default"}>
          {statusOption?.label || statusValue}
        </Badge>
      );

    case "badge":
      return (
        <Badge variant={(options?.badgeVariant as never) || "default"}>
          {String(value || "")}
        </Badge>
      );

    case "avatar":
      return (
        <Avatar className="h-8 w-8">
          <AvatarImage src={String(value || "")} />
          <AvatarFallback>{options?.avatarFallback || "?"}</AvatarFallback>
        </Avatar>
      );

    default:
      return String(value || "");
  }
};

// Helper to create columns from quick column definitions
const createQuickColumns = <TData,>(
  quickColumns: QuickColumn[]
): ColumnDef<TData>[] => {
  return quickColumns.map(
    (col): ColumnDef<TData> => ({
      id: col.key,
      accessorKey: col.key as keyof TData,
      header: col.label,
      cell: (info) => renderQuickColumn(col.type, info.getValue(), col.options),
      enableSorting: true,
      enableColumnFilter: true,
      meta: {
        label: col.label,
      },
    })
  );
};

export interface ReusableTableProps<TData = unknown>
  extends Omit<TableConfig<TData>, "quickColumns"> {
  preset?: TablePreset;
  quickColumns?: QuickColumn[];
}

export function ReusableTable<TData = unknown>({
  // Data and configuration
  data,
  columns: customColumns,
  preset = "default",

  // Quick columns
  quickColumns,

  // Table settings
  title,
  description,
  searchPlaceholder = "Search...",
  searchColumnKey,
  emptyStateMessage = "No results.",
  emptyStateDescription,

  // Features
  enableSearch,
  enableFilters,
  enableSorting,
  enablePagination,
  enableRowSelection,
  enableColumnVisibility,
  enableExport,
  enableAdvancedFilters,

  // Pagination
  initialPageSize,
  pageSizeOptions,

  // Initial state
  initialFilters,
  initialColumnVisibility,
  initialRowSelection,

  // Styling
  className,
  tableClassName,
  containerClassName,

  // Actions
  onRowClick,
  onRowDoubleClick,
  onSelectionChange,

  // Custom components
  toolbar,
  actionBar,
  footer,

  // Loading and error states
  isLoading,
  loadingRowCount = 10,
  error,

  ...restConfig
}: ReusableTableProps<TData>) {
  // Apply preset configuration
  const presetConfig = tablePresets[preset];
  const config = { ...presetConfig, ...restConfig };

  // Resolve final configuration values
  const finalConfig = {
    enableSearch: enableSearch ?? config.enableSearch ?? false,
    enableFilters: enableFilters ?? config.enableFilters ?? false,
    enableSorting: enableSorting ?? config.enableSorting ?? true,
    enablePagination: enablePagination ?? config.enablePagination ?? true,
    enableRowSelection:
      enableRowSelection ?? config.enableRowSelection ?? false,
    enableColumnVisibility:
      enableColumnVisibility ?? config.enableColumnVisibility ?? false,
    enableExport: enableExport ?? config.enableExport ?? false,
    enableAdvancedFilters:
      enableAdvancedFilters ?? config.enableAdvancedFilters ?? false,
    initialPageSize: initialPageSize ?? config.initialPageSize ?? 10,
    pageSizeOptions: pageSizeOptions ??
      config.pageSizeOptions ?? [10, 20, 30, 40, 50],
  };

  // Generate columns based on configuration
  const columns = useMemo(() => {
    const generatedColumns: ColumnDef<TData>[] = [];

    // Add selection column if enabled
    if (finalConfig.enableRowSelection) {
      const columnHelper = createColumnHelper<TData>();
      generatedColumns.push(
        columnHelper.display({
          id: "select",
          header: ({ table }) => (
            <Checkbox
              checked={
                table.getIsAllPageRowsSelected() ||
                (table.getIsSomePageRowsSelected() && "indeterminate")
              }
              onCheckedChange={(value) =>
                table.toggleAllPageRowsSelected(!!value)
              }
              aria-label="Select all"
              className="translate-y-0.5"
            />
          ),
          cell: ({ row }) => (
            <Checkbox
              checked={row.getIsSelected()}
              onCheckedChange={(value) => row.toggleSelected(!!value)}
              aria-label="Select row"
              className="translate-y-0.5"
            />
          ),
          enableSorting: false,
          enableHiding: false,
          enableColumnFilter: false,
          size: 40,
        })
      );
    }

    // Add columns from quick columns or custom columns
    if (quickColumns && quickColumns.length > 0) {
      generatedColumns.push(...createQuickColumns<TData>(quickColumns));
    } else if (customColumns) {
      generatedColumns.push(...customColumns);
    }

    return generatedColumns;
  }, [customColumns, quickColumns, finalConfig.enableRowSelection]);

  // Initialize the data table
  const safeData = data || [];
  const { table } = useDataTable({
    data: safeData,
    columns,
    pageCount: finalConfig.enablePagination
      ? Math.ceil(safeData.length / finalConfig.initialPageSize)
      : -1,
    initialState: {
      columnFilters: initialFilters,
      columnVisibility: initialColumnVisibility,
      rowSelection: initialRowSelection,
      pagination: {
        pageIndex: 0,
        pageSize: finalConfig.initialPageSize,
      },
    },
    enableAdvancedFilter: finalConfig.enableAdvancedFilters,
  });

  // Determine search column
  const searchColumn = useMemo(() => {
    // Use provided searchColumnKey if available
    if (searchColumnKey && table.getColumn(searchColumnKey)) {
      return searchColumnKey;
    }

    // Find first filterable column as fallback
    const filterableColumns = table
      .getAllColumns()
      .filter(
        (col) =>
          col.getCanFilter() && col.id !== "select" && col.id !== "actions"
      );

    return filterableColumns.length > 0 ? filterableColumns[0].id : null;
  }, [searchColumnKey, table]);

  // Handle selection change
  const selectedRows = table.getFilteredSelectedRowModel().rows;
  if (onSelectionChange && selectedRows.length > 0) {
    onSelectionChange(selectedRows);
  }

  // Loading state
  if (isLoading) {
    return (
      <div className={cn("space-y-4", className)}>
        {title && (
          <div>
            <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
            {description && (
              <p className="text-muted-foreground">{description}</p>
            )}
          </div>
        )}
        <div className="flex items-center space-x-2">
          <div className="h-10 w-64 animate-pulse bg-muted rounded" />
          <div className="h-10 w-20 animate-pulse bg-muted rounded" />
        </div>
        <div className="border rounded-md">
          <div className="p-4">
            {Array.from({ length: loadingRowCount }).map((_, i) => (
              <div key={i} className="flex space-x-4 mb-4">
                <div className="h-4 w-4 animate-pulse bg-muted rounded" />
                <div className="h-4 flex-1 animate-pulse bg-muted rounded" />
                <div className="h-4 w-20 animate-pulse bg-muted rounded" />
                <div className="h-4 w-20 animate-pulse bg-muted rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={cn("space-y-4", className)}>
        {title && (
          <div>
            <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
            {description && (
              <p className="text-muted-foreground">{description}</p>
            )}
          </div>
        )}
        <div className="border border-destructive rounded-md p-4">
          <p className="text-destructive">
            {typeof error === "string" ? error : error.message}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Header */}
      {title && (
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
          {description && (
            <p className="text-muted-foreground">{description}</p>
          )}
        </div>
      )}

      {/* Custom toolbar */}
      {toolbar}

      {/* Table controls */}
      <div
        className={cn(
          "flex w-full flex-col gap-2.5 overflow-auto",
          containerClassName
        )}
      >
        <div className="flex items-center justify-between gap-2 p-1 bg-background">
          <div className="flex flex-1 items-center space-x-2">
            {/* Search */}
            {finalConfig.enableSearch && searchColumn && (
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={searchPlaceholder}
                  value={
                    (table
                      .getColumn(searchColumn)
                      ?.getFilterValue() as string) ?? ""
                  }
                  onChange={(event) =>
                    table
                      .getColumn(searchColumn)
                      ?.setFilterValue(event.target.value)
                  }
                  className="pl-8 max-w-sm bg-background border-border"
                />
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {/* Export */}
            {finalConfig.enableExport && (
              <Button
                variant="outline"
                size="sm"
                className="border-border bg-background hover:bg-muted"
              >
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            )}

            {/* Column visibility */}
            {finalConfig.enableColumnVisibility && (
              <DataTableViewOptions table={table} />
            )}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-md border border-border bg-background">
          <Table className={cn("bg-background", tableClassName)}>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow
                  key={headerGroup.id}
                  className="border-border bg-muted/50 hover:bg-muted/50"
                >
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      className="text-muted-foreground font-medium text-xs uppercase tracking-wider px-4 py-3"
                      style={{
                        ...getCommonPinningStyles({ column: header.column }),
                      }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className={cn(
                      "border-border bg-background hover:bg-muted/30 transition-colors",
                      onRowClick && "cursor-pointer",
                      row.getIsSelected() && "bg-muted"
                    )}
                    onClick={() => onRowClick?.(row)}
                    onDoubleClick={() => onRowDoubleClick?.(row)}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className="px-4 py-3 text-sm"
                        style={{
                          ...getCommonPinningStyles({ column: cell.column }),
                        }}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow className="border-border">
                  <TableCell
                    colSpan={table.getAllColumns().length}
                    className="h-24 text-center"
                  >
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <p className="text-muted-foreground">
                        {emptyStateMessage}
                      </p>
                      {emptyStateDescription && (
                        <p className="text-sm text-muted-foreground">
                          {emptyStateDescription}
                        </p>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {finalConfig.enablePagination && <DataTablePagination table={table} />}

        {/* Action bar for selected items */}
        {actionBar && selectedRows.length > 0 && actionBar}

        {/* Custom footer */}
        {footer}
      </div>
    </div>
  );
}
