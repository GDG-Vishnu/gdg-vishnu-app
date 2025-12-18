"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { toast } from "sonner";
import { UniversalCombobox, ComboboxOption } from "./universal-combobox";

// Sample data
const frameworks: ComboboxOption[] = [
  { value: "next.js", label: "Next.js" },
  { value: "react", label: "React" },
  { value: "vue", label: "Vue.js" },
  { value: "svelte", label: "Svelte" },
  { value: "angular", label: "Angular" },
];

const languages: ComboboxOption[] = [
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "csharp", label: "C#" },
];

// 1. STANDALONE USAGE (No form context)
export function StandaloneExample() {
  const [framework, setFramework] = React.useState("");
  const [selectedLanguages, setSelectedLanguages] = React.useState<string[]>(
    []
  );

  return (
    <div className="space-y-6 max-w-md">
      <h3 className="text-lg font-semibold">Standalone Usage</h3>

      {/* Single select */}
      <UniversalCombobox
        options={frameworks}
        value={framework}
        onValueChange={setFramework}
        label="Framework"
        placeholder="Choose a framework..."
        description="Select your preferred framework"
        clearable
      />

      {/* Multi select */}
      <UniversalCombobox
        options={languages}
        values={selectedLanguages}
        onValuesChange={setSelectedLanguages}
        label="Programming Languages"
        placeholder="Choose languages..."
        description="Select multiple languages you know"
        multiple
        clearable
      />

      <div className="text-sm text-muted-foreground">
        <p>Selected Framework: {framework || "None"}</p>
        <p>Selected Languages: {selectedLanguages.join(", ") || "None"}</p>
      </div>
    </div>
  );
}

// 2. FORM USAGE (With React Hook Form)
const formSchema = z.object({
  framework: z.string().min(1, "Please select a framework"),
  languages: z.array(z.string()).min(1, "Please select at least one language"),
  experience: z.string().min(1, "Please select your experience level"),
});

type FormData = z.infer<typeof formSchema>;

const experienceLevels: ComboboxOption[] = [
  { value: "beginner", label: "Beginner (0-1 years)" },
  { value: "intermediate", label: "Intermediate (2-4 years)" },
  { value: "advanced", label: "Advanced (5-7 years)" },
  { value: "expert", label: "Expert (8+ years)" },
];

export function FormExample() {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      framework: "",
      languages: [],
      experience: "",
    },
  });

  function onSubmit(data: FormData) {
    toast.success("Form submitted successfully!", {
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  return (
    <div className="max-w-md">
      <h3 className="text-lg font-semibold mb-4">Form Usage</h3>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Single select in form */}
          <UniversalCombobox
            name="framework"
            options={frameworks}
            label="Primary Framework"
            placeholder="Select framework..."
            description="Choose your main development framework"
            required
            clearable
          />

          {/* Multi select in form */}
          <UniversalCombobox
            name="languages"
            options={languages}
            label="Programming Languages"
            placeholder="Select languages..."
            description="Choose all languages you're comfortable with"
            multiple
            required
          />

          {/* Another single select */}
          <UniversalCombobox
            name="experience"
            options={experienceLevels}
            label="Experience Level"
            placeholder="Select experience..."
            description="How many years of experience do you have?"
            required
          />

          <Button type="submit" className="w-full">
            Submit Form
          </Button>
        </form>
      </Form>
    </div>
  );
}

// 3. COMPACT USAGE (Just options)
export function CompactExample() {
  const [value, setValue] = React.useState("");

  return (
    <div className="max-w-md space-y-4">
      <h3 className="text-lg font-semibold">Compact Usage (Just Options)</h3>

      {/* Minimal props - just options */}
      <UniversalCombobox
        options={frameworks}
        value={value}
        onValueChange={setValue}
        placeholder="Select framework..."
      />

      {/* Even simpler with just options */}
      <UniversalCombobox
        options={languages}
        placeholder="Select language..."
        showLabel={false}
        showDescription={false}
      />
    </div>
  );
}

// 4. HORIZONTAL LAYOUT
export function HorizontalLayoutExample() {
  const form = useForm({
    defaultValues: {
      framework: "",
      language: "",
    },
  });

  return (
    <div className="max-w-2xl">
      <h3 className="text-lg font-semibold mb-4">Horizontal Layout</h3>

      <Form {...form}>
        <div className="space-y-4">
          <UniversalCombobox
            name="framework"
            options={frameworks}
            label="Framework"
            placeholder="Select..."
            orientation="horizontal"
            className="grid grid-cols-3 items-center gap-4"
          />

          <UniversalCombobox
            name="language"
            options={languages}
            label="Language"
            placeholder="Select..."
            orientation="horizontal"
            className="grid grid-cols-3 items-center gap-4"
          />
        </div>
      </Form>
    </div>
  );
}

// 5. CUSTOM STYLING
export function CustomStyledExample() {
  const [value, setValue] = React.useState("");

  return (
    <div className="max-w-md space-y-4">
      <h3 className="text-lg font-semibold">Custom Styling</h3>

      <UniversalCombobox
        options={frameworks}
        value={value}
        onValueChange={setValue}
        label="Custom Styled Combobox"
        placeholder="Choose framework..."
        buttonClassName="h-12 border-2 border-blue-200 hover:border-blue-300"
        contentClassName="w-80"
        className="p-4 border rounded-lg bg-blue-50"
        clearable
      />
    </div>
  );
}

export { frameworks, languages, experienceLevels };
