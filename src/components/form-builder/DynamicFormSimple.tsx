"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { DatetimePicker } from "@/components/ui/extension/date-time-picker";
import { PhoneInput } from "@/components/ui/extension/phone-input";
import { FieldType } from "@prisma/client";

// Define field configuration type
interface FieldConfig {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  required: boolean;
  order: number;

  // Field-specific configurations
  options?: Array<{ value: string; label: string }>; // For select, radio, multiselect, combobox
  minLength?: number; // For input, textarea
  maxLength?: number; // For input, textarea
  minWords?: number; // For textarea
  minCharacters?: number; // For textarea
  pattern?: string; // For input validation
  min?: number; // For number inputs, slider, date
  max?: number; // For number inputs, slider, date
  step?: number; // For number inputs, slider
  minDate?: Date; // For date/datetime
  maxDate?: Date; // For date/datetime
  minSelections?: number; // For multiselect
  maxSelections?: number; // For multiselect
  acceptedFormats?: string[]; // For file upload
  maxFileSize?: number; // For file upload (in MB)
  maxFiles?: number; // For file upload
  defaultValue?: unknown; // Default value for any field type
}

// Create dynamic Zod schema based on field configurations
const createDynamicSchema = (fields: FieldConfig[]) => {
  const schemaObject: Record<string, z.ZodTypeAny> = {};

  fields.forEach((field) => {
    let fieldSchema: z.ZodTypeAny;

    switch (field.type) {
      case FieldType.INPUT:
        let inputSchema = z.string();
        if (field.minLength) {
          inputSchema = inputSchema.min(field.minLength, {
            message: `${field.label} must be at least ${field.minLength} characters.`,
          });
        }
        if (field.maxLength) {
          inputSchema = inputSchema.max(field.maxLength, {
            message: `${field.label} must be no more than ${field.maxLength} characters.`,
          });
        }
        if (field.pattern) {
          inputSchema = inputSchema.regex(new RegExp(field.pattern), {
            message: `${field.label} format is invalid.`,
          });
        }
        fieldSchema = inputSchema;
        break;

      case FieldType.TEXTAREA:
        let textareaSchema = z.string();
        if (field.minCharacters) {
          textareaSchema = textareaSchema.min(field.minCharacters, {
            message: `${field.label} must be at least ${field.minCharacters} characters.`,
          });
        }
        if (field.minWords) {
          textareaSchema = textareaSchema.refine(
            (val) => {
              const wordCount = val
                .trim()
                .split(/\s+/)
                .filter((word) => word.length > 0).length;
              return wordCount >= (field.minWords || 0);
            },
            {
              message: `${field.label} must contain at least ${field.minWords} words.`,
            }
          );
        }
        fieldSchema = textareaSchema;
        break;

      case FieldType.PASSWORD:
        fieldSchema = z
          .string()
          .min(8, { message: "Password must be at least 8 characters." })
          .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
            message:
              "Password must contain at least one uppercase letter, one lowercase letter, and one number.",
          });
        break;

      case FieldType.PHONE:
        fieldSchema = z.string().regex(/^\+?[\d\s\-\(\)]+$/, {
          message: "Please enter a valid phone number.",
        });
        break;

      case FieldType.CHECKBOX:
        fieldSchema = z.boolean();
        break;

      case FieldType.RADIO:
        if (field.options && field.options.length > 0) {
          const optionValues = field.options.map((opt) => opt.value);
          fieldSchema = z.enum(optionValues as [string, ...string[]]);
        } else {
          fieldSchema = z.string();
        }
        break;

      case FieldType.SELECT:
        if (field.options && field.options.length > 0) {
          const optionValues = field.options.map((opt) => opt.value);
          fieldSchema = z.enum(optionValues as [string, ...string[]]);
        } else {
          fieldSchema = z.string();
        }
        break;

      case FieldType.MULTISELECT:
        let multiselectSchema = z.array(z.string());
        if (field.minSelections) {
          multiselectSchema = multiselectSchema.min(field.minSelections, {
            message: `Please select at least ${field.minSelections} options.`,
          });
        }
        if (field.maxSelections) {
          multiselectSchema = multiselectSchema.max(field.maxSelections, {
            message: `Please select no more than ${field.maxSelections} options.`,
          });
        }
        fieldSchema = multiselectSchema;
        break;

      case FieldType.COMBOBOX:
        if (field.options && field.options.length > 0) {
          const optionValues = field.options.map((opt) => opt.value);
          fieldSchema = z.enum(optionValues as [string, ...string[]]);
        } else {
          fieldSchema = z.string();
        }
        break;

      case FieldType.SWITCH:
        fieldSchema = z.boolean();
        break;

      case FieldType.SLIDER:
        let sliderSchema = z.array(z.number());
        if (field.min !== undefined) {
          sliderSchema = sliderSchema.refine(
            (val) => val[0] >= (field.min || 0),
            { message: `Value must be at least ${field.min}.` }
          );
        }
        if (field.max !== undefined) {
          sliderSchema = sliderSchema.refine(
            (val) => val[0] <= (field.max || 100),
            { message: `Value must be no more than ${field.max}.` }
          );
        }
        fieldSchema = sliderSchema;
        break;

      case FieldType.DATE:
        let dateSchema = z.date({
          message: "Please select a valid date.",
        });
        if (field.minDate) {
          dateSchema = dateSchema.min(field.minDate, {
            message: `Date must be after ${format(field.minDate, "PPP")}.`,
          });
        }
        if (field.maxDate) {
          dateSchema = dateSchema.max(field.maxDate, {
            message: `Date must be before ${format(field.maxDate, "PPP")}.`,
          });
        }
        fieldSchema = dateSchema;
        break;

      case FieldType.DATETIME:
        fieldSchema = z.date({
          message: "Please select a valid date and time.",
        });
        break;

      case FieldType.FILE:
        fieldSchema = z.array(z.instanceof(File)).optional();
        break;

      case FieldType.OTP:
        fieldSchema = z
          .string()
          .length(6, { message: "OTP must be exactly 6 digits." })
          .regex(/^\d+$/, { message: "OTP must contain only numbers." });
        break;

      case FieldType.TAGS:
        fieldSchema = z.array(z.string()).min(1, {
          message: "Please add at least one tag.",
        });
        break;

      case FieldType.LOCATION:
        fieldSchema = z.object({
          address: z.string().min(1, "Address is required."),
          latitude: z.number().optional(),
          longitude: z.number().optional(),
        });
        break;

      case FieldType.SIGNATURE:
        fieldSchema = z.string().min(1, {
          message: "Signature is required.",
        });
        break;

      default:
        fieldSchema = z.string();
    }

    // Apply required validation
    if (field.required) {
      if (field.type === FieldType.CHECKBOX) {
        fieldSchema = (fieldSchema as z.ZodBoolean).refine(
          (val) => val === true,
          {
            message: `${field.label} must be checked.`,
          }
        );
      } else if (
        field.type === FieldType.INPUT ||
        field.type === FieldType.TEXTAREA
      ) {
        fieldSchema = (fieldSchema as z.ZodString).min(1, {
          message: `${field.label} is required.`,
        });
      }
    } else {
      fieldSchema = fieldSchema.optional();
    }

    schemaObject[field.id] = fieldSchema;
  });

  return z.object(schemaObject);
};

interface DynamicFormProps {
  fields: FieldConfig[];
  onSubmit: (data: Record<string, unknown>) => void;
  defaultValues?: Record<string, unknown>;
  className?: string;
}

export function DynamicForm({
  fields,
  onSubmit,
  defaultValues = {},
  className = "",
}: DynamicFormProps) {
  // Create schema based on fields
  const schema = createDynamicSchema(fields);
  type FormData = z.infer<typeof schema>;

  // Get default value based on field type
  function getFieldDefaultValue(field: FieldConfig) {
    switch (field.type) {
      case FieldType.CHECKBOX:
      case FieldType.SWITCH:
        return false;
      case FieldType.MULTISELECT:
      case FieldType.TAGS:
      case FieldType.FILE:
        return [];
      case FieldType.SLIDER:
        return [field.min || 0];
      default:
        return "";
    }
  }

  // Initialize form with default values
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: fields.reduce((acc, field) => {
      acc[field.id] =
        defaultValues[field.id] ||
        field.defaultValue ||
        getFieldDefaultValue(field);
      return acc;
    }, {} as Record<string, unknown>),
  });

  // Sort fields by order
  const sortedFields = [...fields].sort((a, b) => a.order - b.order);

  const renderField = (field: FieldConfig) => {
    const { id, type, label, placeholder, required } = field;

    switch (type) {
      case FieldType.INPUT:
        return (
          <FormField
            key={id}
            control={form.control}
            name={id}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>
                  {label}
                  {required && <span className="text-red-500 ml-1">*</span>}
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={placeholder}
                    value={formField.value as string}
                    onChange={formField.onChange}
                    onBlur={formField.onBlur}
                    name={formField.name}
                    ref={formField.ref}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case FieldType.TEXTAREA:
        return (
          <FormField
            key={id}
            control={form.control}
            name={id}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>
                  {label}
                  {required && <span className="text-red-500 ml-1">*</span>}
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder={placeholder}
                    className="min-h-[100px]"
                    value={formField.value as string}
                    onChange={formField.onChange}
                    onBlur={formField.onBlur}
                    name={formField.name}
                    ref={formField.ref}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case FieldType.PASSWORD:
        return (
          <FormField
            key={id}
            control={form.control}
            name={id}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>
                  {label}
                  {required && <span className="text-red-500 ml-1">*</span>}
                </FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder={placeholder}
                    value={formField.value as string}
                    onChange={formField.onChange}
                    onBlur={formField.onBlur}
                    name={formField.name}
                    ref={formField.ref}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case FieldType.PHONE:
        return (
          <FormField
            key={id}
            control={form.control}
            name={id}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>
                  {label}
                  {required && <span className="text-red-500 ml-1">*</span>}
                </FormLabel>
                <FormControl>
                  <PhoneInput
                    placeholder={placeholder}
                    value={formField.value as string}
                    onChange={formField.onChange}
                    onBlur={formField.onBlur}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case FieldType.CHECKBOX:
        return (
          <FormField
            key={id}
            control={form.control}
            name={id}
            render={({ field: formField }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={formField.value as boolean}
                    onCheckedChange={formField.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                  </FormLabel>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case FieldType.RADIO:
        return (
          <FormField
            key={id}
            control={form.control}
            name={id}
            render={({ field: formField }) => (
              <FormItem className="space-y-3">
                <FormLabel>
                  {label}
                  {required && <span className="text-red-500 ml-1">*</span>}
                </FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={formField.onChange}
                    value={formField.value as string}
                    className="flex flex-col space-y-1"
                  >
                    {field.options?.map((option) => (
                      <div
                        key={option.value}
                        className="flex items-center space-x-2"
                      >
                        <RadioGroupItem
                          value={option.value}
                          id={option.value}
                        />
                        <Label htmlFor={option.value}>{option.label}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case FieldType.SELECT:
        return (
          <FormField
            key={id}
            control={form.control}
            name={id}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>
                  {label}
                  {required && <span className="text-red-500 ml-1">*</span>}
                </FormLabel>
                <Select
                  onValueChange={formField.onChange}
                  value={formField.value as string}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue
                        placeholder={placeholder || "Select an option"}
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {field.options?.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case FieldType.SWITCH:
        return (
          <FormField
            key={id}
            control={form.control}
            name={id}
            render={({ field: formField }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                  </FormLabel>
                </div>
                <FormControl>
                  <Switch
                    checked={formField.value as boolean}
                    onCheckedChange={formField.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case FieldType.SLIDER:
        return (
          <FormField
            key={id}
            control={form.control}
            name={id}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>
                  {label}
                  {required && <span className="text-red-500 ml-1">*</span>}
                </FormLabel>
                <FormControl>
                  <div className="space-y-2">
                    <Slider
                      min={field.min || 0}
                      max={field.max || 100}
                      step={field.step || 1}
                      value={formField.value as number[]}
                      onValueChange={formField.onChange}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>{field.min || 0}</span>
                      <span className="font-medium">
                        {(formField.value as number[])[0]}
                      </span>
                      <span>{field.max || 100}</span>
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case FieldType.DATE:
        return (
          <FormField
            key={id}
            control={form.control}
            name={id}
            render={({ field: formField }) => (
              <FormItem className="flex flex-col">
                <FormLabel>
                  {label}
                  {required && <span className="text-red-500 ml-1">*</span>}
                </FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !formField.value && "text-muted-foreground"
                        )}
                      >
                        {formField.value ? (
                          format(formField.value as Date, "PPP")
                        ) : (
                          <span>{placeholder || "Pick a date"}</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formField.value as Date}
                      onSelect={formField.onChange}
                      disabled={(date) => {
                        if (field.minDate && date < field.minDate) return true;
                        if (field.maxDate && date > field.maxDate) return true;
                        return false;
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case FieldType.DATETIME:
        return (
          <FormField
            key={id}
            control={form.control}
            name={id}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>
                  {label}
                  {required && <span className="text-red-500 ml-1">*</span>}
                </FormLabel>
                <FormControl>
                  <DatetimePicker
                    value={formField.value as Date}
                    onChange={formField.onChange}
                    format={[
                      ["months", "days", "years"],
                      ["hours", "minutes", "am/pm"],
                    ]}
                    className="w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case FieldType.OTP:
        return (
          <FormField
            key={id}
            control={form.control}
            name={id}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>
                  {label}
                  {required && <span className="text-red-500 ml-1">*</span>}
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter 6-digit code"
                    maxLength={6}
                    className="text-center text-lg tracking-widest"
                    value={formField.value as string}
                    onChange={formField.onChange}
                    onBlur={formField.onBlur}
                    name={formField.name}
                    ref={formField.ref}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      default:
        return (
          <FormField
            key={id}
            control={form.control}
            name={id}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>
                  {label}
                  {required && <span className="text-red-500 ml-1">*</span>}
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={placeholder}
                    value={formField.value as string}
                    onChange={formField.onChange}
                    onBlur={formField.onBlur}
                    name={formField.name}
                    ref={formField.ref}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={`space-y-6 ${className}`}
      >
        {sortedFields.map(renderField)}
        <Button type="submit" className="w-full">
          Submit
        </Button>
      </form>
    </Form>
  );
}

// Example usage component
export function ExampleDynamicForm() {
  const exampleFields: FieldConfig[] = [
    {
      id: "username",
      type: FieldType.INPUT,
      label: "Username",
      placeholder: "Enter your username",
      required: true,
      order: 1,
      minLength: 3,
      maxLength: 20,
    },
    {
      id: "email",
      type: FieldType.INPUT,
      label: "Email Address",
      placeholder: "Enter your email",
      required: true,
      order: 2,
      pattern: "^[^@]+@[^@]+\\.[^@]+$",
    },
    {
      id: "password",
      type: FieldType.PASSWORD,
      label: "Password",
      placeholder: "Enter your password",
      required: true,
      order: 3,
    },
    {
      id: "bio",
      type: FieldType.TEXTAREA,
      label: "Biography",
      placeholder: "Tell us about yourself",
      required: false,
      order: 4,
      minWords: 10,
    },
    {
      id: "age",
      type: FieldType.SLIDER,
      label: "Age",
      required: false,
      order: 5,
      min: 18,
      max: 100,
      step: 1,
      defaultValue: [25],
    },
    {
      id: "country",
      type: FieldType.SELECT,
      label: "Country",
      required: true,
      order: 6,
      options: [
        { value: "us", label: "United States" },
        { value: "ca", label: "Canada" },
        { value: "uk", label: "United Kingdom" },
        { value: "de", label: "Germany" },
      ],
    },
    {
      id: "newsletter",
      type: FieldType.CHECKBOX,
      label: "Subscribe to newsletter",
      required: false,
      order: 7,
    },
    {
      id: "birthdate",
      type: FieldType.DATE,
      label: "Birth Date",
      required: false,
      order: 8,
      maxDate: new Date(),
    },
  ];

  const handleSubmit = (data: Record<string, unknown>) => {
    console.log("Form submitted with data:", data);
    // Handle form submission here
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Dynamic Form Example</h1>
      <DynamicForm
        fields={exampleFields}
        onSubmit={handleSubmit}
        className="space-y-4"
      />
    </div>
  );
}
