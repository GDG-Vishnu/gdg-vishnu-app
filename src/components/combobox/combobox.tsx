"use client";

import * as React from "react";
import { CheckIcon, ChevronsUpDownIcon, XIcon } from "lucide-react";

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

export interface ComboboxOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface ComboboxProps {
  options: ComboboxOption[];
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  className?: string;
  buttonClassName?: string;
  contentClassName?: string;
  disabled?: boolean;
  clearable?: boolean;
  multiple?: boolean;
  values?: string[];
  onValuesChange?: (values: string[]) => void;
}

export function Combobox({
  options,
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
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState("");

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
    <div className={cn("relative", className)}>
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
            <CommandInput
              placeholder={searchPlaceholder}
              value={searchValue}
              onValueChange={setSearchValue}
            />
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
    </div>
  );
}

// Simple combobox component for basic usage
export function SimpleCombobox({
  options,
  value,
  onValueChange,
  placeholder = "Select option...",
  className,
  disabled = false,
}: {
  options: ComboboxOption[];
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}) {
  return (
    <Combobox
      options={options}
      value={value}
      onValueChange={onValueChange}
      placeholder={placeholder}
      className={className}
      disabled={disabled}
    />
  );
}

// Multi-select combobox component
export function MultiCombobox({
  options,
  values,
  onValuesChange,
  placeholder = "Select options...",
  className,
  disabled = false,
}: {
  options: ComboboxOption[];
  values?: string[];
  onValuesChange?: (values: string[]) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}) {
  return (
    <Combobox
      options={options}
      values={values}
      onValuesChange={onValuesChange}
      placeholder={placeholder}
      className={className}
      disabled={disabled}
      multiple
      clearable
    />
  );
}
