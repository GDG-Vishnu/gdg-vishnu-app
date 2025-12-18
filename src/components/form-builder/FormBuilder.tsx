"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Save, Eye, Settings } from "lucide-react";

import { FormBuilderProvider, useFormBuilder } from "./FormBuilderContext";
import { ComponentPalette } from "./ComponentPalette";
import { SectionContainer } from "./SectionContainer";
import { FieldConfigurationModal } from "./FieldConfigurationModal";
import type {
  FieldConfiguration,
  SectionConfiguration,
} from "./FormBuilderContext";
import { useCreateField, useUpdateField } from "@/hooks/use-field-data";
import { useForm } from "@/hooks/use-form-data";
import { FieldType } from "@prisma/client";

// Server actions imports
import { updateForm } from "@/actions/forms";

interface FormBuilderProps {
  initialForm?: {
    formId: string;
    formName: string;
    sections: SectionConfiguration[];
  } | null;
  onSave?: (formId: string) => void;
  onPreview?: (formId: string) => void;
}

function FormBuilderContent({ onSave, onPreview }: FormBuilderProps) {
  const { state, dispatch, selectField, getFieldById } = useFormBuilder();

  const [isSaving, setIsSaving] = useState(false);
  const selectedField = getFieldById(state.selectedField || "");

  // Handle form metadata changes
  const handleFormNameChange = useCallback(
    (value: string) => {
      dispatch({
        type: "SET_FORM",
        payload: {
          formId: state.formId,
          formName: value,
          sections: state.sections,
        },
      });
    },
    [state.formId, state.sections, dispatch]
  );

  // Add new section
  const handleAddSection = useCallback(() => {
    const newSection: SectionConfiguration = {
      id: `section_${Date.now()}`,
      formId: state.formId,
      title: "New Section",
      order: state.sections.length,
      fields: [],
    };

    dispatch({ type: "ADD_SECTION", payload: newSection });
  }, [state.formId, state.sections.length, dispatch]);

  // Update section
  const handleSectionUpdate = useCallback(
    (sectionId: string, title: string) => {
      dispatch({ type: "UPDATE_SECTION", payload: { sectionId, title } });
    },
    [dispatch]
  );

  // Delete section
  const handleSectionDelete = useCallback(
    (sectionId: string) => {
      dispatch({ type: "DELETE_SECTION", payload: sectionId });
    },
    [dispatch]
  );

  // Save field configuration
  const handleFieldSave = useCallback(
    async (field: FieldConfiguration) => {
      try {
        // For now, just update in context
        dispatch({ type: "UPDATE_FIELD", payload: field });
      } catch (error) {
        console.error("Failed to save field:", error);
      }
    },
    [dispatch]
  );

  // Save entire form (placeholder)
  const handleSave = useCallback(async () => {
    setIsSaving(true);
    try {
      // Placeholder - integrate with server actions later
      console.log("Saving form:", state);
      onSave?.(state.formId);
    } catch (error) {
      console.error("Failed to save form:", error);
    } finally {
      setIsSaving(false);
    }
  }, [state, onSave]);

  // Preview form
  const handlePreview = useCallback(() => {
    onPreview?.(state.formId);
  }, [state.formId, onPreview]);

  return (
    <div className="flex h-full">
      {/* Main Form Builder Area */}
      <div className="flex-1 flex flex-col">
        {/* Form Header */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Form Configuration
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePreview}
                  className="flex items-center gap-2"
                >
                  <Eye className="h-4 w-4" />
                  Preview
                </Button>
                <Button
                  size="sm"
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  {isSaving ? "Saving..." : "Save Form"}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="form-title">Form Title</Label>
                <Input
                  id="form-title"
                  value={state.formName}
                  onChange={(e) => handleFormNameChange(e.target.value)}
                  placeholder="Enter form title"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sections Area */}
        <Card className="flex-1">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Form Sections
              </CardTitle>
              <Button
                size="sm"
                onClick={handleAddSection}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Section
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px]">
              {state.sections.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <Plus className="h-12 w-12 mx-auto" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No sections yet
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Add your first section to start building your form
                  </p>
                  <Button
                    onClick={handleAddSection}
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add First Section
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {state.sections.map(
                    (section: SectionConfiguration, index: number) => (
                      <div key={section.id} className="relative">
                        <SectionContainer
                          section={section}
                          onUpdateSection={(sectionId: string, title: string) =>
                            handleSectionUpdate(sectionId, title)
                          }
                          onDeleteSection={(sectionId: string) =>
                            handleSectionDelete(sectionId)
                          }
                        />
                        {index < state.sections.length - 1 && (
                          <Separator className="my-6" />
                        )}
                      </div>
                    )
                  )}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Component Palette Sidebar */}
      <div className="w-80 border-l bg-gray-50/50">
        <ComponentPalette />
      </div>

      {/* Field Configuration Modal */}
      <FieldConfigurationModal
        isOpen={state.selectedField !== null}
        onClose={() => selectField(null)}
        field={selectedField}
        onSave={handleFieldSave}
      />
    </div>
  );
}

export function FormBuilder({
  initialForm,
  onSave,
  onPreview,
}: FormBuilderProps) {
  return (
    <FormBuilderProvider initialForm={initialForm || undefined}>
      <FormBuilderContent onSave={onSave} onPreview={onPreview} />
    </FormBuilderProvider>
  );
}

export default FormBuilder;
