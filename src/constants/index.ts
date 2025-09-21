export interface FieldType {
  name: string;
  isNew: boolean;
  section: string;
}

export const fieldTypes: FieldType[] = [
  // Basic Input Components
  { name: "Input", isNew: false, section: "Basic Inputs" },
  { name: "Textarea", isNew: false, section: "Basic Inputs" },
  { name: "Password", isNew: false, section: "Basic Inputs" },
  { name: "Phone", isNew: false, section: "Basic Inputs" },

  // Selection Components
  { name: "Checkbox", isNew: false, section: "Selection" },
  { name: "RadioGroup", isNew: false, section: "Selection" },
  { name: "Select", isNew: false, section: "Selection" },
  { name: "Combobox", isNew: false, section: "Selection" },
  { name: "Multi Select", isNew: false, section: "Selection" },
  { name: "Switch", isNew: false, section: "Selection" },

  // Date & Time Components
  { name: "Date Picker", isNew: false, section: "Date & Time" },
  { name: "Datetime Picker", isNew: false, section: "Date & Time" },
  { name: "Smart Datetime Input", isNew: false, section: "Date & Time" },

  // Advanced Components
  { name: "File Input", isNew: false, section: "Advanced" },
  { name: "Input OTP", isNew: false, section: "Advanced" },
  { name: "Location Input", isNew: false, section: "Advanced" },
  { name: "Signature Input", isNew: false, section: "Advanced" },
  { name: "Slider", isNew: false, section: "Advanced" },
  { name: "Tags Input", isNew: false, section: "Advanced" },
  { name: "Rating", isNew: false, section: "Advanced" },
  { name: "Credit Card", isNew: false, section: "Advanced" },
];
