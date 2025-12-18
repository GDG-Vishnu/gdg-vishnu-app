// Form Builder Components
export { FormBuilder as default, FormBuilder } from "./FormBuilder";
export { FormBuilderProvider, useFormBuilder } from "./FormBuilderContext";
export { ComponentPalette } from "./ComponentPalette";
export { SectionContainer } from "./SectionContainer";
export { FieldConfigurationModal } from "./FieldConfigurationModal";

// Legacy exports (if needed)
export { FormBuilderTopBar } from "./FormBuilderTopBar";
export { FormBuilderRightSidebar } from "./FormBuilderRightSidebar";

// Re-export types
export type {
  FieldConfiguration,
  SectionConfiguration,
  FormBuilderState,
} from "./FormBuilderContext";
