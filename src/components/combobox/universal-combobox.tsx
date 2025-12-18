"use client";

import * as React from "react";
import { CheckIcon, ChevronsUpDownIcon, XIcon } from "lucide-react";
import { useFormContext, Controller } from "react-hook-form";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";

export interface ComboboxOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface UniversalComboboxProps {
  // Required
  options: ComboboxOption[];

  // Form-specific props
  name?: string;
  label?: string;
  description?: string;
  required?: boolean;

  // Standalone props
  value?: string;
  onValueChange?: (value: string) => void;
  values?: string[];
  onValuesChange?: (values: string[]) => void;

  // Common props
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  className?: string;
  buttonClassName?: string;
  contentClassName?: string;
  disabled?: boolean;
  clearable?: boolean;
  multiple?: boolean;

  // Form layout props
  showLabel?: boolean;
  showDescription?: boolean;
  orientation?: "vertical" | "horizontal";
}

// Core combobox logic component
function ComboboxCore({
  options,
  value,
  onValueChange,
  values,
  onValuesChange,
  placeholder = "Select option...",
  searchPlaceholder = "Search...",
  emptyText = "No option found.",
  buttonClassName,
  contentClassName,
  disabled = false,
  clearable = false,
  multiple = false,
}: Omit<
  UniversalComboboxProps,
  | "options"
  | "name"
  | "label"
  | "description"
  | "required"
  | "className"
  | "showLabel"
  | "showDescription"
  | "orientation"
> & {
  options: ComboboxOption[];
}) {
  const [open, setOpen] = React.useState(false);

  // Handle single select
  const selectedOption = React.useMemo(() => {
    if (multiple) return null;
    return options.find((option) => option.value === value);
  }, [options, value, multiple]);

  // Handle multiple select
  const selectedOptions = React.useMemo(() => {
    if (!multiple) return [];
    return options.filter((option) => values?.includes(option.value));
  }, [options, values, multiple]);

  const handleSelect = React.useCallback(
    (selectedValue: string) => {
      if (multiple) {
        const currentValues = values || [];
        const newValues = currentValues.includes(selectedValue)
          ? currentValues.filter((v) => v !== selectedValue)
          : [...currentValues, selectedValue];
        onValuesChange?.(newValues);
      } else {
        const newValue = value === selectedValue ? "" : selectedValue;
        onValueChange?.(newValue);
        setOpen(false);
      }
    },
    [multiple, values, value, onValuesChange, onValueChange]
  );

  const handleClear = React.useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (multiple) {
        onValuesChange?.([]);
      } else {
        onValueChange?.("");
      }
    },
    [multiple, onValuesChange, onValueChange]
  );

  const getDisplayValue = () => {
    if (multiple) {
      if (selectedOptions.length === 0) return placeholder;
      if (selectedOptions.length === 1) return selectedOptions[0].label;
      return `${selectedOptions.length} selected`;
    }
    return selectedOption?.label || placeholder;
  };

  const hasValue = multiple ? (values?.length || 0) > 0 : !!value;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between font-normal",
            !hasValue && "text-muted-foreground",
            buttonClassName
          )}
          disabled={disabled}
        >
          <span className="truncate">{getDisplayValue()}</span>
          <div className="flex items-center gap-2">
            {clearable && hasValue && (
              <button
                type="button"
                onClick={handleClear}
                className="flex h-4 w-4 items-center justify-center rounded-sm hover:bg-muted"
                tabIndex={-1}
              >
                <XIcon className="h-3 w-3" />
                <span className="sr-only">Clear selection</span>
              </button>
            )}
            <ChevronsUpDownIcon className="h-4 w-4 shrink-0 opacity-50" />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={cn(
          "w-[var(--radix-popover-trigger-width)] p-0",
          contentClassName
        )}
        align="start"
      >
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>{emptyText}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = multiple
                  ? values?.includes(option.value) || false
                  : value === option.value;

                return (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    disabled={option.disabled}
                    onSelect={() =>
                      !option.disabled && handleSelect(option.value)
                    }
                    className={cn(
                      "cursor-pointer",
                      option.disabled && "cursor-not-allowed opacity-50"
                    )}
                  >
                    <CheckIcon
                      className={cn(
                        "mr-2 h-4 w-4",
                        isSelected ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <span className="truncate">{option.label}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

// Universal Combobox Component
export function UniversalCombobox({
  options,
  name,
  label,
  description,
  required = false,
  value,
  onValueChange,
  values,
  onValuesChange,
  placeholder = "Select option...",
  searchPlaceholder = "Search...",
  emptyText = "No option found.",
  className,
  buttonClassName,
  contentClassName,
  disabled = false,
  clearable = false,
  multiple = false,
  showLabel = true,
  showDescription = true,
  orientation = "vertical",
}: UniversalComboboxProps) {
  // Check if component is used within a form context
  const formContext = useFormContext();
  const isInForm = formContext && name;

  // Standalone usage (not in form)
  if (!isInForm) {
    return (
      <div className={className}>
        {label && showLabel && (
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-2 block">
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </label>
        )}
        <ComboboxCore
          options={options}
          value={value}
          onValueChange={onValueChange}
          values={values}
          onValuesChange={onValuesChange}
          placeholder={placeholder}
          searchPlaceholder={searchPlaceholder}
          emptyText={emptyText}
          buttonClassName={buttonClassName}
          contentClassName={contentClassName}
          disabled={disabled}
          clearable={clearable}
          multiple={multiple}
        />
        {description && showDescription && (
          <p className="text-sm text-muted-foreground mt-2">{description}</p>
        )}
      </div>
    );
  }

  // Form usage (with React Hook Form)
  return (
    <Controller
      name={name!}
      control={formContext.control}
      render={({ field, fieldState }) => (
        <FormItem
          className={cn(
            orientation === "horizontal" &&
              "flex flex-row items-center space-y-0 space-x-3",
            className
          )}
        >
          {label && showLabel && (
            <FormLabel
              className={cn(orientation === "horizontal" && "min-w-0")}
            >
              {label}
              {required && <span className="text-destructive ml-1">*</span>}
            </FormLabel>
          )}
          <div className={cn(orientation === "horizontal" && "flex-1")}>
            <FormControl>
              <ComboboxCore
                options={options}
                value={multiple ? undefined : field.value}
                onValueChange={multiple ? undefined : field.onChange}
                values={multiple ? field.value : undefined}
                onValuesChange={multiple ? field.onChange : undefined}
                placeholder={placeholder}
                searchPlaceholder={searchPlaceholder}
                emptyText={emptyText}
                buttonClassName={cn(
                  fieldState.error &&
                    "border-destructive focus-visible:ring-destructive",
                  buttonClassName
                )}
                contentClassName={contentClassName}
                disabled={disabled}
                clearable={clearable}
                multiple={multiple}
              />
            </FormControl>
            <FormMessage />
            {description && showDescription && (
              <FormDescription>{description}</FormDescription>
            )}
          </div>
        </FormItem>
      )}
    />
  );
}

// Convenience exports for common use cases
export function SimpleCombobox({
  options,
  ...props
}: Omit<UniversalComboboxProps, "multiple">) {
  return <UniversalCombobox options={options} {...props} />;
}

export function MultiCombobox({
  options,
  ...props
}: Omit<UniversalComboboxProps, "multiple">) {
  return <UniversalCombobox options={options} multiple clearable {...props} />;
}
