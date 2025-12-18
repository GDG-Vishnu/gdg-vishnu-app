"use client";

import React, { useCallback, createContext, useContext, useState } from "react";
import { useParams } from "next/navigation";
import { FieldType } from "@prisma/client";
import {
  useCreateField,
  useUpdateField,
  useDeleteField,
} from "@/hooks/use-field-data";
import { useForm } from "@/hooks/use-form-data";
import { ComponentPalette } from "./ComponentPalette";
import type { FieldConfiguration } from "./FormBuilderContext";
import { FormData } from "@/types/form-builder";
import { AddComponentLoading } from "./loading-pages";

// Context for form builder integration
interface FormBuilderIntegrationContextType {
  formId: string;
  formData: FormData | null;
  isLoading: boolean;
  isAdding: boolean;
  addingComponentName: string;

  // Actions
  addFieldToSection: (sectionId: string, fieldType: FieldType) => Promise<void>;
  saveField: (field: FieldConfiguration) => Promise<void>;
  deleteField: (fieldId: string, sectionId: string) => Promise<void>;
}

const FormBuilderIntegrationContext =
  createContext<FormBuilderIntegrationContextType | null>(null);

export function useFormBuilderIntegration() {
  const context = useContext(FormBuilderIntegrationContext);
  if (!context) {
    throw new Error(
      "useFormBuilderIntegration must be used within FormBuilderIntegrationProvider"
    );
  }
  return context;
}

interface FormBuilderIntegrationProviderProps {
  children: React.ReactNode;
}

export function FormBuilderIntegrationProvider({
  children,
}: FormBuilderIntegrationProviderProps) {
  const params = useParams();
  const formId = params?.id as string;

  // State for adding components
  const [isAdding, setIsAdding] = useState(false);
  const [addingComponentName, setAddingComponentName] = useState("");

  // React Query hooks - must be called before any returns
  const { data: formData, isLoading } = useForm(formId || "");
  const createFieldMutation = useCreateField();
  const updateFieldMutation = useUpdateField();
  const deleteFieldMutation = useDeleteField();

  // No local state needed - using inline configuration

  // Add field to section
  const addFieldToSection = useCallback(
    async (sectionId: string, fieldType: FieldType) => {
      try {
        // Set loading state
        const componentName = fieldType.replace(/_/g, " ").toLowerCase();
        setAddingComponentName(componentName);
        setIsAdding(true);

        // Get current fields in section to determine order
        const section = formData?.sections?.find((s) => s.id === sectionId);
        const currentFieldCount = section?.fields?.length || 0;

        await createFieldMutation.mutateAsync({
          sectionId,
          fieldType,
          label: `${fieldType.replace(/_/g, " ")} Field`,
          placeholder: `Enter ${fieldType.toLowerCase().replace(/_/g, " ")}`,
          required: false,
          order: currentFieldCount,
        });

        // No modal - fields will render with inline configuration
      } catch (error) {
        console.error("Error adding field:", error);
      } finally {
        setIsAdding(false);
        setAddingComponentName("");
      }
    },
    [formData, createFieldMutation]
  );

  // Save field configuration
  const saveField = useCallback(
    async (field: FieldConfiguration) => {
      try {
        await updateFieldMutation.mutateAsync({
          ...field,
          sectionId: field.sectionId,
        });
      } catch (error) {
        console.error("Error saving field:", error);
      }
    },
    [updateFieldMutation]
  );

  // Delete field
  const deleteField = useCallback(
    async (fieldId: string, sectionId: string) => {
      try {
        await deleteFieldMutation.mutateAsync({ fieldId, sectionId });
      } catch (error) {
        console.error("Error deleting field:", error);
      }
    },
    [deleteFieldMutation]
  );

  // No modal functions needed - using inline configuration

  // Handle missing form ID case
  if (!formId) {
    console.error("FormBuilderIntegrationProvider: No form ID found in params");
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center text-destructive">
          <h3 className="text-lg font-medium">Error: No Form ID</h3>
          <p className="text-sm mt-1">
            Unable to load form - missing form ID in URL
          </p>
        </div>
      </div>
    );
  }

  const value: FormBuilderIntegrationContextType = {
    formId,
    formData: (formData as FormData) || null,
    isLoading,
    isAdding,
    addingComponentName,
    addFieldToSection,
    saveField,
    deleteField,
  };

  return (
    <FormBuilderIntegrationContext.Provider value={value}>
      {children}
      {/* Add Component Loading */}
      {isAdding && <AddComponentLoading componentName={addingComponentName} />}
    </FormBuilderIntegrationContext.Provider>
  );
}

// Enhanced ComponentPalette that integrates with database
interface IntegratedComponentPaletteProps {
  className?: string;
}

export function IntegratedComponentPalette({
  className,
}: IntegratedComponentPaletteProps) {
  const { formData, addFieldToSection } = useFormBuilderIntegration();

  const handleAddField = useCallback(
    (fieldType: FieldType) => {
      // Add to the first section (or create one if none exist)
      const sections = formData?.sections || [];
      if (sections.length > 0) {
        addFieldToSection(sections[0].id, fieldType);
      } else {
        console.warn("No sections available to add field to");
      }
    },
    [formData, addFieldToSection]
  );

  return <ComponentPalette onAddField={handleAddField} className={className} />;
}

// Note: Modal configuration removed - using inline configuration with FormComponentWrapper
