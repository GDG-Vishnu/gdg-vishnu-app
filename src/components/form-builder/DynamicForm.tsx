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
import {
  MultiSelector,
  MultiSelectorTrigger,
  MultiSelectorInput,
  MultiSelectorContent,
  MultiSelectorList,
  MultiSelectorItem,
} from "@/components/ui/extension/multi-select";
import {
  FileUploader,
  FileInput,
  FileUploaderContent,
  FileUploaderItem,
} from "@/components/ui/extension/file-input";
import { CloudUpload, Paperclip } from "lucide-react";
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
  defaultValue?:
    | string
    | number
    | boolean
    | Date
    | string[]
    | number[]
    | File[]
    | { address: string; latitude?: number; longitude?: number }; // Default value for any field type
}

// Create dynamic Zod schema based on field configurations
const createDynamicSchema = (fields: FieldConfig[]) => {
  const schemaObject: Record<string, z.ZodTypeAny> = {};

  fields.forEach((field) => {
    let fieldSchema: z.ZodTypeAny;

    switch (field.type) {
      case FieldType.INPUT:
        fieldSchema = z.string();
        if (field.minLength) {
          fieldSchema = (fieldSchema as z.ZodString).min(field.minLength, {
            message: `${field.label} must be at least ${field.minLength} characters.`,
          });
        }
        if (field.maxLength) {
          fieldSchema = (fieldSchema as z.ZodString).max(field.maxLength, {
            message: `${field.label} must be no more than ${field.maxLength} characters.`,
          });
        }
        if (field.pattern) {
          fieldSchema = (fieldSchema as z.ZodString).regex(
            new RegExp(field.pattern),
            {
              message: `${field.label} format is invalid.`,
            }
          );
        }
        break;

      case FieldType.TEXTAREA:
        fieldSchema = z.string();
        if (field.minCharacters) {
          fieldSchema = (fieldSchema as z.ZodString).min(field.minCharacters, {
            message: `${field.label} must be at least ${field.minCharacters} characters.`,
          });
        }
        if (field.minWords) {
          fieldSchema = (fieldSchema as z.ZodString).refine(
            (val: string) => {
              const wordCount = val.trim().split(/\s+/).length;
              return wordCount >= (field.minWords || 0);
            },
            {
              message: `${field.label} must contain at least ${field.minWords} words.`,
            }
          );
        }
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
        fieldSchema = z.string();
        if (field.options && field.options.length > 0) {
          fieldSchema = z.enum(
            field.options.map((opt) => opt.value) as [string, ...string[]]
          );
        }
        break;

      case FieldType.SELECT:
        fieldSchema = z.string();
        if (field.options && field.options.length > 0) {
          fieldSchema = z.enum(
            field.options.map((opt) => opt.value) as [string, ...string[]]
          );
        }
        break;

      case FieldType.MULTISELECT:
        fieldSchema = z.array(z.string());
        if (field.minSelections) {
          fieldSchema = (fieldSchema as z.ZodArray<z.ZodString>).min(
            field.minSelections,
            {
              message: `Please select at least ${field.minSelections} options.`,
            }
          );
        }
        if (field.maxSelections) {
          fieldSchema = (fieldSchema as z.ZodArray<z.ZodString>).max(
            field.maxSelections,
            {
              message: `Please select no more than ${field.maxSelections} options.`,
            }
          );
        }
        break;

      case FieldType.COMBOBOX:
        fieldSchema = z.string();
        if (field.options && field.options.length > 0) {
          fieldSchema = z.enum(
            field.options.map((opt) => opt.value) as [string, ...string[]]
          );
        }
        break;

      case FieldType.SWITCH:
        fieldSchema = z.boolean();
        break;

      case FieldType.SLIDER:
        fieldSchema = z.array(z.number());
        if (field.min !== undefined) {
          fieldSchema = (fieldSchema as z.ZodArray<z.ZodNumber>).refine(
            (val: number[]) => val[0] >= (field.min || 0),
            { message: `Value must be at least ${field.min}.` }
          );
        }
        if (field.max !== undefined) {
          fieldSchema = (fieldSchema as z.ZodArray<z.ZodNumber>).refine(
            (val: number[]) => val[0] <= (field.max || 100),
            { message: `Value must be no more than ${field.max}.` }
          );
        }
        break;

      case FieldType.DATE:
        fieldSchema = z.date({
          message: "Please select a valid date.",
        });
        if (field.minDate) {
          fieldSchema = (fieldSchema as z.ZodDate).min(field.minDate, {
            message: `Date must be after ${format(field.minDate, "PPP")}.`,
          });
        }
        if (field.maxDate) {
          fieldSchema = (fieldSchema as z.ZodDate).max(field.maxDate, {
            message: `Date must be before ${format(field.maxDate, "PPP")}.`,
          });
        }
        break;

      case FieldType.DATETIME:
        fieldSchema = z.date({
          message: "Please select a valid date and time.",
        });
        break;

      case FieldType.FILE:
        fieldSchema = z.array(z.instanceof(File));
        if (field.maxFiles) {
          fieldSchema = (fieldSchema as z.ZodArray<z.ZodType<File>>).max(
            field.maxFiles,
            {
              message: `Maximum ${field.maxFiles} files allowed.`,
            }
          );
        }
        if (field.maxFileSize) {
          fieldSchema = (fieldSchema as z.ZodArray<z.ZodType<File>>).refine(
            (files: File[]) =>
              files.every(
                (file: File) => file.size <= field.maxFileSize! * 1024 * 1024
              ),
            { message: `File size must be less than ${field.maxFileSize}MB.` }
          );
        }
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
      if (fieldSchema instanceof z.ZodString) {
        fieldSchema = fieldSchema.min(1, {
          message: `${field.label} is required.`,
        });
      } else if (
        fieldSchema instanceof z.ZodBoolean &&
        field.type === FieldType.CHECKBOX
      ) {
        fieldSchema = fieldSchema.refine((val) => val === true, {
          message: `${field.label} must be checked.`,
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
  defaultValues?: Record<
    string,
    | string
    | number
    | boolean
    | Date
    | string[]
    | number[]
    | File[]
    | { address: string; latitude?: number; longitude?: number }
  >;
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

      case FieldType.MULTISELECT:
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
                  <MultiSelector
                    values={
                      (formField.value as { value: string; label: string }[]) ||
                      []
                    }
                    onValuesChange={formField.onChange}
                  >
                    <MultiSelectorTrigger>
                      <MultiSelectorInput
                        placeholder={placeholder || "Select options..."}
                      />
                    </MultiSelectorTrigger>
                    <MultiSelectorContent>
                      <MultiSelectorList>
                        {field.options?.map((option) => (
                          <MultiSelectorItem
                            key={option.value}
                            value={option.value}
                            label={option.label}
                          >
                            {option.label}
                          </MultiSelectorItem>
                        ))}
                      </MultiSelectorList>
                    </MultiSelectorContent>
                  </MultiSelector>
                </FormControl>
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

      case FieldType.FILE:
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
                  <FileUploader
                    value={formField.value as File[] | null}
                    onValueChange={formField.onChange}
                    dropzoneOptions={{
                      multiple: (field.maxFiles || 1) > 1,
                      maxFiles: field.maxFiles || 1,
                      maxSize: (field.maxFileSize || 10) * 1024 * 1024,
                    }}
                    className="relative bg-background rounded-lg p-2"
                  >
                    <FileInput className="outline-dashed outline-1 outline-slate-500">
                      <div className="flex items-center justify-center flex-col p-8 w-full">
                        <CloudUpload className="text-gray-500 w-10 h-10" />
                        <p className="mb-1 text-sm text-gray-500">
                          <span className="font-semibold">Click to upload</span>
                          &nbsp; or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">
                          Max {field.maxFileSize || 10}MB, {field.maxFiles || 1}{" "}
                          file
                          {(field.maxFiles || 1) > 1 ? "s" : ""}
                        </p>
                      </div>
                    </FileInput>
                    <FileUploaderContent>
                      {Array.isArray(formField.value) &&
                        formField.value.length > 0 &&
                        formField.value.map((file: File, i: number) => (
                          <FileUploaderItem key={i} index={i}>
                            <Paperclip className="h-4 w-4 stroke-current" />
                            <span>{file.name}</span>
                          </FileUploaderItem>
                        ))}
                    </FileUploaderContent>
                  </FileUploader>
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
