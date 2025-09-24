"use client";

import React, { useState, useCallback, useEffect } from "react";
import { FieldType } from "@prisma/client";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Trash2, GripVertical } from "lucide-react";
import {
  FieldConfiguration,
  useFormBuilder,
  getFieldTypeIcon,
  getFieldTypeLabel,
} from "./FormBuilderContext";
import { cn } from "@/lib/utils";

// Validation schemas for different field types
const baseFieldSchema = z.object({
  label: z.string().min(1, "Label is required").max(255, "Label is too long"),
  placeholder: z.string().max(255, "Placeholder is too long").optional(),
  required: z.boolean(),
});

const inputFieldSchema = baseFieldSchema
  .extend({
    minLength: z.number().min(0).optional(),
    maxLength: z.number().min(1).max(10000).optional(),
    pattern: z.string().optional(),
    defaultValue: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.minLength && data.maxLength) {
        return data.minLength <= data.maxLength;
      }
      return true;
    },
    {
      message: "Minimum length must be less than or equal to maximum length",
      path: ["minLength"],
    }
  );

const textareaFieldSchema = baseFieldSchema.extend({
  minLength: z.number().min(0).optional(),
  maxLength: z.number().min(1).max(50000).optional(),
  minWords: z.number().min(1).optional(),
  minCharacters: z.number().min(1).optional(),
  defaultValue: z.string().optional(),
});

const optionSchema = z.object({
  value: z.string().min(1, "Option value is required"),
  label: z.string().min(1, "Option label is required"),
});

const selectFieldSchema = baseFieldSchema.extend({
  options: z.array(optionSchema).min(1, "At least one option is required"),
  defaultValue: z.string().optional(),
});

const multiselectFieldSchema = baseFieldSchema
  .extend({
    options: z.array(optionSchema).min(1, "At least one option is required"),
    minSelections: z.number().min(1).optional(),
    maxSelections: z.number().min(1).optional(),
    defaultValue: z.array(z.string()).optional(),
  })
  .refine(
    (data) => {
      if (data.minSelections && data.maxSelections) {
        return data.minSelections <= data.maxSelections;
      }
      return true;
    },
    {
      message:
        "Minimum selections must be less than or equal to maximum selections",
      path: ["minSelections"],
    }
  );

const numberFieldSchema = baseFieldSchema
  .extend({
    min: z.number().optional(),
    max: z.number().optional(),
    step: z.number().min(0.001).optional(),
    defaultValue: z.number().optional(),
  })
  .refine(
    (data) => {
      if (data.min !== undefined && data.max !== undefined) {
        return data.min <= data.max;
      }
      return true;
    },
    {
      message: "Minimum value must be less than or equal to maximum value",
      path: ["min"],
    }
  );

const fileFieldSchema = baseFieldSchema.extend({
  maxFiles: z.number().min(1).max(100).default(1),
  maxFileSize: z.number().min(0.1).max(1000).default(10), // MB
  acceptedFormats: z
    .array(z.string())
    .min(1, "At least one file format is required"),
});

// Helper function to get validation schema for field type
function getValidationSchema(fieldType: FieldType) {
  switch (fieldType) {
    case FieldType.INPUT:
    case FieldType.PASSWORD:
    case FieldType.PHONE:
      return inputFieldSchema;
    case FieldType.TEXTAREA:
      return textareaFieldSchema;
    case FieldType.SELECT:
    case FieldType.RADIO:
    case FieldType.COMBOBOX:
      return selectFieldSchema;
    case FieldType.CHECKBOX:
    case FieldType.MULTISELECT:
      return multiselectFieldSchema;
    case FieldType.SLIDER:
      return numberFieldSchema;
    case FieldType.FILE:
      return fileFieldSchema;
    case FieldType.SWITCH:
      return baseFieldSchema.extend({
        defaultValue: z.boolean().optional(),
      });
    case FieldType.DATE:
    case FieldType.DATETIME:
    case FieldType.SMART_DATETIME:
      return baseFieldSchema.extend({
        minDate: z.date().optional(),
        maxDate: z.date().optional(),
        defaultValue: z.date().optional(),
      });
    case FieldType.OTP:
      return baseFieldSchema.extend({
        length: z.number().min(4).max(8).default(6),
      });
    case FieldType.TAGS:
      return baseFieldSchema.extend({
        maxTags: z.number().min(1).max(50).optional(),
        defaultValue: z.array(z.string()).optional(),
      });
    default:
      return baseFieldSchema;
  }
}

interface FieldConfigurationModalProps {
  isOpen: boolean;
  onClose: () => void;
  field: FieldConfiguration | null;
  onSave: (field: FieldConfiguration) => Promise<void>;
}

export function FieldConfigurationModal({
  isOpen,
  onClose,
  field,
  onSave,
}: FieldConfigurationModalProps) {
  const { setFieldValidationErrors } = useFormBuilder();

  const [formData, setFormData] = useState<Partial<FieldConfiguration>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Initialize form data when field changes
  useEffect(() => {
    if (field) {
      setFormData(field);
      setErrors({});
    }
  }, [field]);

  // Handle form field changes
  const handleChange = useCallback(
    (key: keyof FieldConfiguration, value: unknown) => {
      setFormData((prev) => ({ ...prev, [key]: value }));

      // Clear error for this field when user starts typing
      if (errors[key]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[key];
          return newErrors;
        });
      }
    },
    [errors]
  );

  // Handle options management
  const handleOptionsChange = useCallback(
    (options: Array<{ value: string; label: string }>) => {
      handleChange("options", options);
    },
    [handleChange]
  );

  const addOption = useCallback(() => {
    const currentOptions = formData.options || [];
    const newOption = {
      value: `option_${currentOptions.length + 1}`,
      label: `Option ${currentOptions.length + 1}`,
    };
    handleOptionsChange([...currentOptions, newOption]);
  }, [formData.options, handleOptionsChange]);

  const removeOption = useCallback(
    (index: number) => {
      const currentOptions = formData.options || [];
      handleOptionsChange(currentOptions.filter((_, i) => i !== index));
    },
    [formData.options, handleOptionsChange]
  );

  const updateOption = useCallback(
    (index: number, key: "value" | "label", value: string) => {
      const currentOptions = formData.options || [];
      const updatedOptions = currentOptions.map((option, i) =>
        i === index ? { ...option, [key]: value } : option
      );
      handleOptionsChange(updatedOptions);
    },
    [formData.options, handleOptionsChange]
  );

  // Handle form submission
  const handleSave = useCallback(async () => {
    if (!field || !formData.type) return;

    setIsLoading(true);
    setErrors({});

    try {
      // Get the appropriate validation schema
      const schema = getValidationSchema(formData.type as FieldType);

      // Validate the form data
      const validatedData = schema.parse(formData);

      // Create the complete field configuration
      const updatedField: FieldConfiguration = {
        ...field,
        ...validatedData,
        isEditing: false,
        validationErrors: {},
      };

      // Save the field
      await onSave(updatedField);
      setFieldValidationErrors(field.id, {});
      onClose();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.issues.forEach((err) => {
          const path = err.path.join(".");
          fieldErrors[path] = err.message;
        });
        setErrors(fieldErrors);
        setFieldValidationErrors(field.id, fieldErrors);
      } else {
        console.error("Error saving field:", error);
        setErrors({ general: "Failed to save field configuration" });
      }
    } finally {
      setIsLoading(false);
    }
  }, [field, formData, onSave, setFieldValidationErrors, onClose]);

  if (!field || !isOpen) return null;

  const fieldTypeSupportsOptions = (
    [
      FieldType.SELECT,
      FieldType.RADIO,
      FieldType.CHECKBOX,
      FieldType.MULTISELECT,
      FieldType.COMBOBOX,
    ] as FieldType[]
  ).includes(field.type);

  const fieldTypeSupportsValidation = (
    [FieldType.INPUT, FieldType.TEXTAREA, FieldType.PASSWORD] as FieldType[]
  ).includes(field.type);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-2xl">{getFieldTypeIcon(field.type)}</span>
            Configure {getFieldTypeLabel(field.type)} Field
          </DialogTitle>
          <DialogDescription>
            Configure the properties and validation rules for this field.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-6">
            {/* General errors */}
            {errors.general && (
              <div className="p-3 bg-destructive/10 border border-destructive rounded-md">
                <p className="text-sm text-destructive">{errors.general}</p>
              </div>
            )}

            {/* Basic Configuration */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Basic Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="label">Field Label *</Label>
                  <Input
                    id="label"
                    value={formData.label || ""}
                    onChange={(e) => handleChange("label", e.target.value)}
                    placeholder="Enter field label"
                    className={cn(errors.label && "border-destructive")}
                  />
                  {errors.label && (
                    <p className="text-sm text-destructive mt-1">
                      {errors.label}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="placeholder">Placeholder Text</Label>
                  <Input
                    id="placeholder"
                    value={formData.placeholder || ""}
                    onChange={(e) =>
                      handleChange("placeholder", e.target.value)
                    }
                    placeholder="Enter placeholder text"
                    className={cn(errors.placeholder && "border-destructive")}
                  />
                  {errors.placeholder && (
                    <p className="text-sm text-destructive mt-1">
                      {errors.placeholder}
                    </p>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="required"
                    checked={formData.required || false}
                    onCheckedChange={(checked) =>
                      handleChange("required", checked)
                    }
                  />
                  <Label htmlFor="required">Required field</Label>
                </div>
              </CardContent>
            </Card>

            {/* Field Options (for select-type fields) */}
            {fieldTypeSupportsOptions && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center justify-between">
                    Options Configuration
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addOption}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Option
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {(formData.options || []).map((option, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 border rounded-lg"
                      >
                        <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                        <div className="grid grid-cols-2 gap-3 flex-1">
                          <div>
                            <Label className="text-xs">Value</Label>
                            <Input
                              value={option.value}
                              onChange={(e) =>
                                updateOption(index, "value", e.target.value)
                              }
                              placeholder="option_value"
                              className="h-8"
                            />
                          </div>
                          <div>
                            <Label className="text-xs">Label</Label>
                            <Input
                              value={option.label}
                              onChange={(e) =>
                                updateOption(index, "label", e.target.value)
                              }
                              placeholder="Option Label"
                              className="h-8"
                            />
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeOption(index)}
                          disabled={(formData.options?.length || 0) <= 1}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}

                    {errors.options && (
                      <p className="text-sm text-destructive">
                        {errors.options}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Validation Rules */}
            {fieldTypeSupportsValidation && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Validation Rules</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {(field.type === FieldType.INPUT ||
                    field.type === FieldType.TEXTAREA) && (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="minLength">Minimum Length</Label>
                          <Input
                            id="minLength"
                            type="number"
                            value={formData.minLength || ""}
                            onChange={(e) =>
                              handleChange(
                                "minLength",
                                e.target.value
                                  ? parseInt(e.target.value)
                                  : undefined
                              )
                            }
                            placeholder="0"
                            min="0"
                            className={cn(
                              errors.minLength && "border-destructive"
                            )}
                          />
                          {errors.minLength && (
                            <p className="text-sm text-destructive mt-1">
                              {errors.minLength}
                            </p>
                          )}
                        </div>
                        <div>
                          <Label htmlFor="maxLength">Maximum Length</Label>
                          <Input
                            id="maxLength"
                            type="number"
                            value={formData.maxLength || ""}
                            onChange={(e) =>
                              handleChange(
                                "maxLength",
                                e.target.value
                                  ? parseInt(e.target.value)
                                  : undefined
                              )
                            }
                            placeholder="255"
                            min="1"
                            className={cn(
                              errors.maxLength && "border-destructive"
                            )}
                          />
                          {errors.maxLength && (
                            <p className="text-sm text-destructive mt-1">
                              {errors.maxLength}
                            </p>
                          )}
                        </div>
                      </div>

                      {field.type === FieldType.TEXTAREA && (
                        <div>
                          <Label htmlFor="minWords">Minimum Words</Label>
                          <Input
                            id="minWords"
                            type="number"
                            value={formData.minWords || ""}
                            onChange={(e) =>
                              handleChange(
                                "minWords",
                                e.target.value
                                  ? parseInt(e.target.value)
                                  : undefined
                              )
                            }
                            placeholder="0"
                            min="0"
                            className={cn(
                              errors.minWords && "border-destructive"
                            )}
                          />
                          {errors.minWords && (
                            <p className="text-sm text-destructive mt-1">
                              {errors.minWords}
                            </p>
                          )}
                        </div>
                      )}

                      {field.type === FieldType.INPUT && (
                        <div>
                          <Label htmlFor="pattern">
                            Validation Pattern (Regex)
                          </Label>
                          <Input
                            id="pattern"
                            value={formData.pattern || ""}
                            onChange={(e) =>
                              handleChange("pattern", e.target.value)
                            }
                            placeholder="^[A-Za-z0-9]+$"
                            className={cn(
                              errors.pattern && "border-destructive"
                            )}
                          />
                          {errors.pattern && (
                            <p className="text-sm text-destructive mt-1">
                              {errors.pattern}
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground mt-1">
                            Enter a regular expression to validate the input
                            format
                          </p>
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Field-specific configurations */}
            {field.type === FieldType.SLIDER && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Slider Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="min">Minimum Value</Label>
                      <Input
                        id="min"
                        type="number"
                        value={formData.min || 0}
                        onChange={(e) =>
                          handleChange("min", parseInt(e.target.value))
                        }
                        className={cn(errors.min && "border-destructive")}
                      />
                      {errors.min && (
                        <p className="text-sm text-destructive mt-1">
                          {errors.min}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="max">Maximum Value</Label>
                      <Input
                        id="max"
                        type="number"
                        value={formData.max || 100}
                        onChange={(e) =>
                          handleChange("max", parseInt(e.target.value))
                        }
                        className={cn(errors.max && "border-destructive")}
                      />
                      {errors.max && (
                        <p className="text-sm text-destructive mt-1">
                          {errors.max}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="step">Step</Label>
                      <Input
                        id="step"
                        type="number"
                        value={formData.step || 1}
                        onChange={(e) =>
                          handleChange("step", parseFloat(e.target.value))
                        }
                        min="0.001"
                        step="0.001"
                        className={cn(errors.step && "border-destructive")}
                      />
                      {errors.step && (
                        <p className="text-sm text-destructive mt-1">
                          {errors.step}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {field.type === FieldType.FILE && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    File Upload Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="maxFiles">Maximum Files</Label>
                      <Input
                        id="maxFiles"
                        type="number"
                        value={formData.maxFiles || 1}
                        onChange={(e) =>
                          handleChange("maxFiles", parseInt(e.target.value))
                        }
                        min="1"
                        max="100"
                        className={cn(errors.maxFiles && "border-destructive")}
                      />
                      {errors.maxFiles && (
                        <p className="text-sm text-destructive mt-1">
                          {errors.maxFiles}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="maxFileSize">Max File Size (MB)</Label>
                      <Input
                        id="maxFileSize"
                        type="number"
                        value={formData.maxFileSize || 10}
                        onChange={(e) =>
                          handleChange(
                            "maxFileSize",
                            parseFloat(e.target.value)
                          )
                        }
                        min="0.1"
                        max="1000"
                        step="0.1"
                        className={cn(
                          errors.maxFileSize && "border-destructive"
                        )}
                      />
                      {errors.maxFileSize && (
                        <p className="text-sm text-destructive mt-1">
                          {errors.maxFileSize}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="acceptedFormats">
                      Accepted File Formats
                    </Label>
                    <Textarea
                      id="acceptedFormats"
                      value={(formData.acceptedFormats || []).join(", ")}
                      onChange={(e) => {
                        const formats = e.target.value
                          .split(",")
                          .map((f) => f.trim())
                          .filter((f) => f.length > 0);
                        handleChange("acceptedFormats", formats);
                      }}
                      placeholder=".pdf, .doc, .docx, .jpg, .png"
                      className={cn(
                        errors.acceptedFormats && "border-destructive"
                      )}
                    />
                    {errors.acceptedFormats && (
                      <p className="text-sm text-destructive mt-1">
                        {errors.acceptedFormats}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      Comma-separated list of file extensions (e.g., .pdf, .jpg,
                      .png)
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </ScrollArea>

        <Separator />

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Field"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default FieldConfigurationModal;
