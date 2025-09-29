"use client";

import * as React from "react";
import {
  ComboboxOption,
  Combobox,
  SimpleCombobox,
  MultiCombobox,
} from "./combobox";

// Example data
const frameworks: ComboboxOption[] = [
  {
    value: "next.js",
    label: "Next.js",
  },
  {
    value: "sveltekit",
    label: "SvelteKit",
  },
  {
    value: "nuxt.js",
    label: "Nuxt.js",
  },
  {
    value: "remix",
    label: "Remix",
  },
  {
    value: "astro",
    label: "Astro",
  },
  {
    value: "vue",
    label: "Vue.js",
  },
  {
    value: "angular",
    label: "Angular",
  },
];

const languages: ComboboxOption[] = [
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "csharp", label: "C#" },
  { value: "rust", label: "Rust" },
  { value: "go", label: "Go" },
];

// Basic combobox example - matches shadcn/ui spec
export function ComboboxDemo() {
  const [value, setValue] = React.useState("");

  return (
    <div className="w-[300px]">
      <SimpleCombobox
        options={frameworks}
        value={value}
        onValueChange={setValue}
        placeholder="Select framework..."
      />
    </div>
  );
}

// Multi-select combobox example
export function ComboboxMultiDemo() {
  const [selectedValues, setSelectedValues] = React.useState<string[]>([]);

  return (
    <div className="w-[300px]">
      <MultiCombobox
        options={languages}
        values={selectedValues}
        onValuesChange={setSelectedValues}
        placeholder="Select languages..."
      />
    </div>
  );
}

// Advanced combobox with custom styling
export function ComboboxAdvanced() {
  const [value, setValue] = React.useState("");

  return (
    <div className="w-[400px]">
      <Combobox
        options={frameworks}
        value={value}
        onValueChange={setValue}
        placeholder="Choose your framework"
        searchPlaceholder="Search frameworks..."
        emptyText="No framework found."
        clearable
        className="w-full"
        buttonClassName="h-12 text-left"
        contentClassName="w-[400px]"
      />
    </div>
  );
}

// Combobox with disabled options
export function ComboboxWithDisabled() {
  const [value, setValue] = React.useState("");

  const optionsWithDisabled: ComboboxOption[] = [
    ...frameworks,
    {
      value: "disabled-option",
      label: "Disabled Option",
      disabled: true,
    },
  ];

  return (
    <div className="w-[300px]">
      <SimpleCombobox
        options={optionsWithDisabled}
        value={value}
        onValueChange={setValue}
        placeholder="Select framework..."
      />
    </div>
  );
}

// Small combobox
export function ComboboxSmall() {
  const [value, setValue] = React.useState("");

  return (
    <div className="w-[200px]">
      <Combobox
        options={frameworks.slice(0, 4)}
        value={value}
        onValueChange={setValue}
        placeholder="Select..."
        buttonClassName="h-8 text-sm"
      />
    </div>
  );
}

export { frameworks, languages, type ComboboxOption };
