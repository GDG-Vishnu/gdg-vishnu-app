import { FieldType } from "@/types/form-builder";

export interface FieldTypeInfo {
  name: string;
  isNew: boolean;
  section: string;
  type: FieldType;
}

export const fieldTypes: FieldTypeInfo[] = [
  // Basic Input Components
  {
    name: "Input",
    isNew: false,
    section: "Basic Inputs",
    type: FieldType.INPUT,
  },
  {
    name: "Textarea",
    isNew: false,
    section: "Basic Inputs",
    type: FieldType.TEXTAREA,
  },
  {
    name: "Password",
    isNew: false,
    section: "Basic Inputs",
    type: FieldType.PASSWORD,
  },
  {
    name: "Phone",
    isNew: false,
    section: "Basic Inputs",
    type: FieldType.PHONE,
  },

  // Selection Components
  {
    name: "Checkbox",
    isNew: false,
    section: "Selection",
    type: FieldType.CHECKBOX,
  },
  {
    name: "RadioGroup",
    isNew: false,
    section: "Selection",
    type: FieldType.RADIO,
  },
  {
    name: "Select",
    isNew: false,
    section: "Selection",
    type: FieldType.SELECT,
  },
  {
    name: "Combobox",
    isNew: false,
    section: "Selection",
    type: FieldType.COMBOBOX,
  },
  {
    name: "Multi Select",
    isNew: false,
    section: "Selection",
    type: FieldType.MULTISELECT,
  },
  {
    name: "Switch",
    isNew: false,
    section: "Selection",
    type: FieldType.SWITCH,
  },

  // Date & Time Components
  {
    name: "Date Picker",
    isNew: false,
    section: "Date & Time",
    type: FieldType.DATE,
  },
  {
    name: "Datetime Picker",
    isNew: false,
    section: "Date & Time",
    type: FieldType.DATETIME,
  },
  {
    name: "Smart Datetime Input",
    isNew: false,
    section: "Date & Time",
    type: FieldType.SMART_DATETIME,
  },

  // Advanced Components
  {
    name: "File Input",
    isNew: false,
    section: "Advanced",
    type: FieldType.FILE,
  },
  { name: "Input OTP", isNew: false, section: "Advanced", type: FieldType.OTP },
  {
    name: "Location Input",
    isNew: false,
    section: "Advanced",
    type: FieldType.LOCATION,
  },
  {
    name: "Signature Input",
    isNew: false,
    section: "Advanced",
    type: FieldType.SIGNATURE,
  },
  { name: "Slider", isNew: false, section: "Advanced", type: FieldType.SLIDER },
  {
    name: "Tags Input",
    isNew: false,
    section: "Advanced",
    type: FieldType.TAGS,
  },
];
