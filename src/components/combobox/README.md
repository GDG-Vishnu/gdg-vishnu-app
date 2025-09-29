# Universal Combobox Component

A single, flexible combobox component that works seamlessly with both standalone usage and React Hook Form integration. Just pass the options and it handles the rest!

## ✨ Key Features

- **🔄 Universal**: Works standalone or with React Hook Form automatically
- **📝 Simple**: Just pass `options` and it works
- **🎯 Smart**: Auto-detects form context
- **🎨 Flexible**: Supports single/multi-select, custom styling
- **♿ Accessible**: Full keyboard navigation and screen reader support

## 🚀 Quick Start

### Basic Usage (Just pass options!)

```tsx
import { UniversalCombobox } from "@/components/combobox/universal-combobox";

const options = [
  { value: "react", label: "React" },
  { value: "vue", label: "Vue.js" },
  { value: "angular", label: "Angular" },
];

// Standalone usage
function MyComponent() {
  const [value, setValue] = useState("");

  return (
    <UniversalCombobox
      options={options}
      value={value}
      onValueChange={setValue}
      placeholder="Select framework..."
    />
  );
}
```

### Form Usage (React Hook Form)

```tsx
import { Form } from "@/components/ui/form";
import { UniversalCombobox } from "@/components/combobox/universal-combobox";

function MyForm() {
  const form = useForm({
    defaultValues: { framework: "" },
  });

  return (
    <Form {...form}>
      <UniversalCombobox
        name="framework" // 👈 Just add name prop
        options={options}
        label="Framework"
        placeholder="Select framework..."
        required
      />
    </Form>
  );
}
```

## 📋 Examples

### 1. Minimal (Just Options)

```tsx
<UniversalCombobox options={frameworks} />
```

### 2. With Label & Description

```tsx
<UniversalCombobox
  options={frameworks}
  label="Framework"
  description="Choose your preferred framework"
  placeholder="Select framework..."
/>
```

### 3. Multi-Select

```tsx
<UniversalCombobox
  options={languages}
  multiple
  placeholder="Select languages..."
/>
```

### 4. Form Integration

```tsx
<Form {...form}>
  <UniversalCombobox
    name="framework"
    options={frameworks}
    label="Framework"
    required
  />
</Form>
```

### 5. Custom Styling

```tsx
<UniversalCombobox
  options={frameworks}
  buttonClassName="h-12 border-blue-200"
  className="w-full max-w-md"
  clearable
/>
```

## 🎛️ Props

| Prop              | Type                         | Description                              |
| ----------------- | ---------------------------- | ---------------------------------------- |
| `options`         | `ComboboxOption[]`           | **Required**. Array of options           |
| `name`            | `string`                     | Form field name (auto-enables form mode) |
| `label`           | `string`                     | Field label                              |
| `description`     | `string`                     | Help text                                |
| `placeholder`     | `string`                     | Placeholder text                         |
| `value`           | `string`                     | Controlled value (standalone)            |
| `onValueChange`   | `(value: string) => void`    | Change handler (standalone)              |
| `values`          | `string[]`                   | Multi-select values                      |
| `onValuesChange`  | `(values: string[]) => void` | Multi-select handler                     |
| `multiple`        | `boolean`                    | Enable multi-select                      |
| `clearable`       | `boolean`                    | Show clear button                        |
| `disabled`        | `boolean`                    | Disable component                        |
| `required`        | `boolean`                    | Mark as required                         |
| `className`       | `string`                     | Container styles                         |
| `buttonClassName` | `string`                     | Button styles                            |

## 🔧 How It Works

The component automatically detects its usage context:

- **Standalone**: Uses `value` and `onValueChange` props
- **Form Mode**: Uses React Hook Form's `Controller` when `name` prop is provided
- **Smart Detection**: Checks for `useFormContext()` to determine mode

## 💡 Tips

1. **Form Usage**: Just add `name` prop and it becomes a form field
2. **Multi-Select**: Add `multiple` prop for multi-selection
3. **Validation**: Works with Zod validation automatically
4. **Styling**: Use `className`, `buttonClassName` for custom styles
5. **Accessibility**: Fully keyboard navigable and screen reader friendly

## 🎯 Use Cases

- ✅ Country/State selectors
- ✅ Category dropdowns
- ✅ User/Team selection
- ✅ Technology stack selection
- ✅ Form fields with search
- ✅ Multi-tag selection

## 📦 Dependencies

- React Hook Form (for form mode)
- Radix UI (Command, Popover)
- Tailwind CSS
- Lucide React (icons)
