// Form Builder TypeScript Types

export enum FieldType {
  INPUT = "INPUT",
  TEXTAREA = "TEXTAREA",
  PASSWORD = "PASSWORD",
  PHONE = "PHONE",
  CHECKBOX = "CHECKBOX",
  RADIO = "RADIO",
  SELECT = "SELECT",
  COMBOBOX = "COMBOBOX",
  MULTISELECT = "MULTISELECT",
  SWITCH = "SWITCH",
  DATE = "DATE",
  DATETIME = "DATETIME",
  SMART_DATETIME = "SMART_DATETIME",
  FILE = "FILE",
  OTP = "OTP",
  LOCATION = "LOCATION",
  SIGNATURE = "SIGNATURE",
  SLIDER = "SLIDER",
  TAGS = "TAGS",
}

// Supported field values
export type FieldValue =
  | string
  | number
  | boolean
  | string[]
  | number[]
  | File
  | File[]
  | Date
  | null
  | undefined;

// Validation rules interface
export interface ValidationRules {
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string; // Regex pattern
  email?: boolean;
  url?: boolean;
  number?: boolean;
  integer?: boolean;
  custom?: string; // Custom validation function name
}

// Field styling options
export interface FieldStyling {
  width?: "full" | "half" | "third" | "quarter";
  className?: string;
  labelPosition?: "top" | "left" | "inside";
  size?: "sm" | "md" | "lg";
  variant?: "default" | "outlined" | "filled";
}

// Conditional logic for fields
export interface ConditionalLogic {
  showIf?: {
    fieldId: string;
    operator:
      | "equals"
      | "not_equals"
      | "contains"
      | "not_contains"
      | "greater_than"
      | "less_than";
    value: FieldValue;
  }[];
  requiredIf?: {
    fieldId: string;
    operator:
      | "equals"
      | "not_equals"
      | "contains"
      | "not_contains"
      | "greater_than"
      | "less_than";
    value: FieldValue;
  }[];
}

// Field option for select, radio, checkbox, etc.
export interface FieldOption {
  id: string;
  label: string;
  value: string;
  description?: string;
  disabled?: boolean;
  icon?: string;
}

// Field configuration interface
export interface FieldConfig {
  id: string;
  label: string;
  placeholder?: string;
  type: FieldType;
  required: boolean;
  options?: FieldOption[]; // For select, radio, checkbox, multi-select
  defaultValue?: FieldValue;
  order: number;
  sectionId: string;

  // Advanced configuration
  validation?: ValidationRules;
  styling?: FieldStyling;
  logic?: ConditionalLogic;

  // Field-specific props
  props?: {
    // Input/Textarea specific
    maxLength?: number;
    rows?: number; // For textarea

    // Number/Slider specific
    min?: number;
    max?: number;
    step?: number;

    // File specific
    accept?: string;
    multiple?: boolean;
    maxSize?: number; // in MB

    // Date specific
    minDate?: string;
    maxDate?: string;
    format?: string;

    // Location specific
    enableCurrentLocation?: boolean;
    showMap?: boolean;

    // OTP specific
    length?: number;

    // Tags specific
    maxTags?: number;
    suggestions?: string[];
  };
}

// Section configuration interface
export interface SectionConfig {
  id: string;
  title?: string;
  description?: string;
  order: number;
  formId: string;
  fields: FieldConfig[];

  // Section styling and behavior
  styling?: {
    className?: string;
    collapsible?: boolean;
    collapsed?: boolean;
    showTitle?: boolean;
  };
}

// Form configuration interface
export interface FormConfig {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  sections: SectionConfig[];

  // Form settings
  settings?: {
    allowMultipleSubmissions?: boolean;
    requireAuthentication?: boolean;
    showProgressBar?: boolean;
    submitButtonText?: string;
    successMessage?: string;
    redirectUrl?: string;
    notificationEmails?: string[];
    saveProgress?: boolean; // Allow saving draft
    theme?: {
      primaryColor?: string;
      backgroundColor?: string;
      textColor?: string;
      borderRadius?: string;
    };
  };
}

// Form submission types
export interface FieldResponse {
  fieldId: string;
  value: FieldValue;
}

export interface FormSubmissionData {
  id: string;
  formId: string;
  submittedAt: Date;
  submittedBy?: string;
  responses: FieldResponse[];
}

// Form builder state types (for the form builder UI)
export interface FormBuilderState {
  form: FormConfig;
  activeSection?: string;
  activeField?: string;
  draggedField?: FieldConfig;
  previewMode: boolean;
  saveStatus: "saved" | "saving" | "unsaved" | "error";
}

// Field type definitions for rendering
export interface FieldTypeDefinition {
  type: FieldType;
  label: string;
  icon: string;
  description: string;
  category: "basic" | "advanced" | "layout" | "special";
  defaultConfig: Partial<FieldConfig>;
  supportedValidation: (keyof ValidationRules)[];
  hasOptions: boolean; // Whether this field type supports options
}

// Form validation result
export interface FormValidationResult {
  isValid: boolean;
  errors: {
    sectionId?: string;
    fieldId?: string;
    message: string;
  }[];
}

// Export types for Prisma models (these would be generated by Prisma)
export type Form = {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
};

export type Section = {
  id: string;
  title?: string;
  order: number;
  formId: string;
};

export type Field = {
  id: string;
  label: string;
  placeholder?: string;
  type: FieldType;
  required: boolean;
  options?: FieldOption[]; // JSON stored as array of options
  defaultValue?: string;
  order: number;
  sectionId: string;
  validation?: ValidationRules; // JSON stored validation rules
  styling?: FieldStyling; // JSON stored styling config
  logic?: ConditionalLogic; // JSON stored logic rules
};

export type FormSubmission = {
  id: string;
  formId: string;
  submittedAt: Date;
  submittedBy?: string;
};

export type FieldResponseModel = {
  id: string;
  fieldId: string;
  submissionId: string;
  value: FieldValue; // JSON stored field value
};
