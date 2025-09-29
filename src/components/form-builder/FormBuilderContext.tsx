"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
} from "react";
import { FieldType } from "@prisma/client";

// Types for form builder state
export interface FieldConfiguration {
  id: string;
  sectionId: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  required: boolean;
  order: number;

  // Field-specific configurations
  options?: Array<{ value: string; label: string }>;
  minLength?: number;
  maxLength?: number;
  minWords?: number;
  minCharacters?: number;
  pattern?: string;
  min?: number;
  max?: number;
  step?: number;
  minDate?: Date;
  maxDate?: Date;
  minSelections?: number;
  maxSelections?: number;
  acceptedFormats?: string[];
  maxFileSize?: number;
  maxFiles?: number;
  defaultValue?: unknown;

  // UI state
  isEditing?: boolean;
  validationErrors?: Record<string, string>;
}

export interface SectionConfiguration {
  id: string;
  formId: string;
  title: string;
  order: number;
  fields: FieldConfiguration[];
  isEditing?: boolean;
}

export interface FormBuilderState {
  formId: string;
  formName: string;
  sections: SectionConfiguration[];
  selectedField: string | null;
  draggedFieldType: FieldType | null;
  isDragging: boolean;
  isLoading: boolean;
  error: string | null;
}

// Action types
type FormBuilderAction =
  | {
      type: "SET_FORM";
      payload: {
        formId: string;
        formName: string;
        sections: SectionConfiguration[];
      };
    }
  | { type: "ADD_SECTION"; payload: SectionConfiguration }
  | { type: "UPDATE_SECTION"; payload: { sectionId: string; title: string } }
  | { type: "DELETE_SECTION"; payload: string }
  | {
      type: "ADD_FIELD";
      payload: { sectionId: string; field: FieldConfiguration };
    }
  | { type: "UPDATE_FIELD"; payload: FieldConfiguration }
  | { type: "DELETE_FIELD"; payload: { sectionId: string; fieldId: string } }
  | {
      type: "REORDER_FIELDS";
      payload: { sectionId: string; fields: FieldConfiguration[] };
    }
  | { type: "SELECT_FIELD"; payload: string | null }
  | {
      type: "SET_DRAGGING";
      payload: { fieldType: FieldType | null; isDragging: boolean };
    }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | {
      type: "SET_FIELD_EDITING";
      payload: { fieldId: string; isEditing: boolean };
    }
  | {
      type: "SET_FIELD_VALIDATION_ERRORS";
      payload: { fieldId: string; errors: Record<string, string> };
    };

// Reducer function
function formBuilderReducer(
  state: FormBuilderState,
  action: FormBuilderAction
): FormBuilderState {
  switch (action.type) {
    case "SET_FORM":
      return {
        ...state,
        formId: action.payload.formId,
        formName: action.payload.formName,
        sections: action.payload.sections,
        isLoading: false,
        error: null,
      };

    case "ADD_SECTION":
      return {
        ...state,
        sections: [...state.sections, action.payload],
      };

    case "UPDATE_SECTION":
      return {
        ...state,
        sections: state.sections.map((section) =>
          section.id === action.payload.sectionId
            ? { ...section, title: action.payload.title }
            : section
        ),
      };

    case "DELETE_SECTION":
      return {
        ...state,
        sections: state.sections.filter(
          (section) => section.id !== action.payload
        ),
      };

    case "ADD_FIELD":
      return {
        ...state,
        sections: state.sections.map((section) =>
          section.id === action.payload.sectionId
            ? { ...section, fields: [...section.fields, action.payload.field] }
            : section
        ),
      };

    case "UPDATE_FIELD":
      return {
        ...state,
        sections: state.sections.map((section) => ({
          ...section,
          fields: section.fields.map((field) =>
            field.id === action.payload.id ? action.payload : field
          ),
        })),
      };

    case "DELETE_FIELD":
      return {
        ...state,
        sections: state.sections.map((section) =>
          section.id === action.payload.sectionId
            ? {
                ...section,
                fields: section.fields.filter(
                  (field) => field.id !== action.payload.fieldId
                ),
              }
            : section
        ),
      };

    case "REORDER_FIELDS":
      return {
        ...state,
        sections: state.sections.map((section) =>
          section.id === action.payload.sectionId
            ? { ...section, fields: action.payload.fields }
            : section
        ),
      };

    case "SELECT_FIELD":
      return {
        ...state,
        selectedField: action.payload,
      };

    case "SET_DRAGGING":
      return {
        ...state,
        draggedFieldType: action.payload.fieldType,
        isDragging: action.payload.isDragging,
      };

    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.payload,
      };

    case "SET_ERROR":
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };

    case "SET_FIELD_EDITING":
      return {
        ...state,
        sections: state.sections.map((section) => ({
          ...section,
          fields: section.fields.map((field) =>
            field.id === action.payload.fieldId
              ? { ...field, isEditing: action.payload.isEditing }
              : field
          ),
        })),
      };

    case "SET_FIELD_VALIDATION_ERRORS":
      return {
        ...state,
        sections: state.sections.map((section) => ({
          ...section,
          fields: section.fields.map((field) =>
            field.id === action.payload.fieldId
              ? { ...field, validationErrors: action.payload.errors }
              : field
          ),
        })),
      };

    default:
      return state;
  }
}

// Context
interface FormBuilderContextType {
  state: FormBuilderState;
  dispatch: React.Dispatch<FormBuilderAction>;

  // Helper functions
  addField: (sectionId: string, fieldType: FieldType) => void;
  updateField: (field: FieldConfiguration) => void;
  deleteField: (sectionId: string, fieldId: string) => void;
  selectField: (fieldId: string | null) => void;
  setFieldEditing: (fieldId: string, isEditing: boolean) => void;
  setFieldValidationErrors: (
    fieldId: string,
    errors: Record<string, string>
  ) => void;
  getFieldById: (fieldId: string) => FieldConfiguration | null;
  getSectionById: (sectionId: string) => SectionConfiguration | null;
  generateFieldId: () => string;
}

const FormBuilderContext = createContext<FormBuilderContextType | null>(null);

export const useFormBuilder = () => {
  const context = useContext(FormBuilderContext);
  if (!context) {
    throw new Error("useFormBuilder must be used within a FormBuilderProvider");
  }
  return context;
};

// Provider component
interface FormBuilderProviderProps {
  children: React.ReactNode;
  initialForm?: {
    formId: string;
    formName: string;
    sections: SectionConfiguration[];
  };
}

export function FormBuilderProvider({
  children,
  initialForm,
}: FormBuilderProviderProps) {
  const initialState: FormBuilderState = {
    formId: initialForm?.formId || "",
    formName: initialForm?.formName || "New Form",
    sections: initialForm?.sections || [],
    selectedField: null,
    draggedFieldType: null,
    isDragging: false,
    isLoading: false,
    error: null,
  };

  const [state, dispatch] = useReducer(formBuilderReducer, initialState);

  // Helper functions
  const generateFieldId = useCallback(() => {
    return `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  const addField = useCallback(
    (sectionId: string, fieldType: FieldType) => {
      const section = state.sections.find((s) => s.id === sectionId);
      if (!section) return;

      const newField: FieldConfiguration = {
        id: generateFieldId(),
        sectionId,
        type: fieldType,
        label: `${
          fieldType.charAt(0).toUpperCase() +
          fieldType.slice(1).toLowerCase().replace("_", " ")
        } Field`,
        placeholder: `Enter ${fieldType.toLowerCase().replace("_", " ")}`,
        required: false,
        order: section.fields.length,
        isEditing: true, // Start in editing mode
        validationErrors: {},
      };

      // Set default configurations based on field type
      switch (fieldType) {
        case FieldType.SELECT:
        case FieldType.RADIO:
        case FieldType.CHECKBOX:
        case FieldType.MULTISELECT:
        case FieldType.COMBOBOX:
          newField.options = [
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
          ];
          break;
        case FieldType.SLIDER:
          newField.min = 0;
          newField.max = 100;
          newField.step = 1;
          newField.defaultValue = [50];
          break;
        case FieldType.FILE:
          newField.maxFiles = 1;
          newField.maxFileSize = 10; // MB
          newField.acceptedFormats = [".pdf", ".doc", ".docx", ".jpg", ".png"];
          break;
        case FieldType.INPUT:
        case FieldType.TEXTAREA:
          newField.minLength = 1;
          newField.maxLength = 255;
          break;
      }

      dispatch({ type: "ADD_FIELD", payload: { sectionId, field: newField } });
      dispatch({ type: "SELECT_FIELD", payload: newField.id });
    },
    [state.sections, generateFieldId]
  );

  const updateField = useCallback((field: FieldConfiguration) => {
    dispatch({ type: "UPDATE_FIELD", payload: field });
  }, []);

  const deleteField = useCallback((sectionId: string, fieldId: string) => {
    dispatch({ type: "DELETE_FIELD", payload: { sectionId, fieldId } });
    dispatch({ type: "SELECT_FIELD", payload: null });
  }, []);

  const selectField = useCallback((fieldId: string | null) => {
    dispatch({ type: "SELECT_FIELD", payload: fieldId });
  }, []);

  const setFieldEditing = useCallback((fieldId: string, isEditing: boolean) => {
    dispatch({ type: "SET_FIELD_EDITING", payload: { fieldId, isEditing } });
  }, []);

  const setFieldValidationErrors = useCallback(
    (fieldId: string, errors: Record<string, string>) => {
      dispatch({
        type: "SET_FIELD_VALIDATION_ERRORS",
        payload: { fieldId, errors },
      });
    },
    []
  );

  const getFieldById = useCallback(
    (fieldId: string): FieldConfiguration | null => {
      for (const section of state.sections) {
        const field = section.fields.find((f) => f.id === fieldId);
        if (field) return field;
      }
      return null;
    },
    [state.sections]
  );

  const getSectionById = useCallback(
    (sectionId: string): SectionConfiguration | null => {
      return state.sections.find((s) => s.id === sectionId) || null;
    },
    [state.sections]
  );

  const contextValue: FormBuilderContextType = {
    state,
    dispatch,
    addField,
    updateField,
    deleteField,
    selectField,
    setFieldEditing,
    setFieldValidationErrors,
    getFieldById,
    getSectionById,
    generateFieldId,
  };

  return (
    <FormBuilderContext.Provider value={contextValue}>
      {children}
    </FormBuilderContext.Provider>
  );
}

// Field type metadata helpers
export function getFieldTypeIcon(type: FieldType): string {
  const icons: Record<FieldType, string> = {
    [FieldType.INPUT]: "📝",
    [FieldType.TEXTAREA]: "📄",
    [FieldType.PASSWORD]: "🔒",
    [FieldType.PHONE]: "📞",
    [FieldType.CHECKBOX]: "☑️",
    [FieldType.RADIO]: "🔘",
    [FieldType.SELECT]: "📋",
    [FieldType.COMBOBOX]: "🔽",
    [FieldType.MULTISELECT]: "✅",
    [FieldType.SWITCH]: "🔄",
    [FieldType.DATE]: "📅",
    [FieldType.DATETIME]: "🕒",
    [FieldType.SMART_DATETIME]: "⏰",
    [FieldType.FILE]: "📎",
    [FieldType.OTP]: "🔢",
    [FieldType.LOCATION]: "📍",
    [FieldType.SIGNATURE]: "✍️",
    [FieldType.SLIDER]: "🎚️",
    [FieldType.TAGS]: "🏷️",
  };
  return icons[type] || "❓";
}

export function getFieldTypeLabel(type: FieldType): string {
  return type
    .replace(/_/g, " ")
    .replace(/\b\w/g, (l: string) => l.toUpperCase());
}

export function getFieldTypeDescription(type: FieldType): string {
  const descriptions: Record<FieldType, string> = {
    [FieldType.INPUT]: "Single line text input",
    [FieldType.TEXTAREA]: "Multi-line text input",
    [FieldType.PASSWORD]: "Password input with validation",
    [FieldType.PHONE]: "Phone number input with formatting",
    [FieldType.CHECKBOX]: "Multiple choice checkboxes",
    [FieldType.RADIO]: "Single choice from options",
    [FieldType.SELECT]: "Dropdown selection",
    [FieldType.COMBOBOX]: "Searchable dropdown",
    [FieldType.MULTISELECT]: "Multiple choice selection",
    [FieldType.SWITCH]: "On/off toggle switch",
    [FieldType.DATE]: "Date picker",
    [FieldType.DATETIME]: "Date and time picker",
    [FieldType.SMART_DATETIME]: "Smart date and time picker",
    [FieldType.FILE]: "File upload with validation",
    [FieldType.OTP]: "One-time password input",
    [FieldType.LOCATION]: "Location picker with map",
    [FieldType.SIGNATURE]: "Digital signature pad",
    [FieldType.SLIDER]: "Range slider input",
    [FieldType.TAGS]: "Tag input with autocomplete",
  };
  return descriptions[type] || "Unknown field type";
}
