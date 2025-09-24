"use client";

import { useParams } from "next/navigation";
import React from "react";
import { useForm, useUpdateSection } from "@/hooks/use-form-data";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Save, RotateCcw, Loader2 } from "lucide-react";
import FormComponentRender from "@/components/form-builder/FormComponentRender";

const FormBuilderPage = () => {
  const { id } = useParams();
  const formId = id as string;

  const { data: formData, isLoading, error } = useForm(formId);
  const updateSectionMutation = useUpdateSection();

  // Track section title edits - section ID -> current edited title
  const [sectionTitles, setSectionTitles] = React.useState<
    Record<string, string>
  >({});

  // Initialize section titles when form data loads
  React.useEffect(() => {
    if (formData?.sections) {
      const initialTitles: Record<string, string> = {};
      formData.sections.forEach((section) => {
        initialTitles[section.id] = section.title || "";
      });
      setSectionTitles(initialTitles);
    }
  }, [formData]);

  const handleSectionTitleChange = (sectionId: string, value: string) => {
    setSectionTitles((prev) => ({
      ...prev,
      [sectionId]: value,
    }));
  };

  const handleSaveSection = async (sectionId: string) => {
    const title = sectionTitles[sectionId]?.trim();
    if (title) {
      try {
        await updateSectionMutation.mutateAsync({
          sectionId,
          title,
        });
      } catch (error) {
        console.error("Error updating section:", error);
      }
    }
  };

  const handleResetSection = (sectionId: string, originalTitle: string) => {
    setSectionTitles((prev) => ({
      ...prev,
      [sectionId]: originalTitle || "",
    }));
  };

  if (isLoading) {
    return (
      <div className="h-full bg-background">
        <div className="p-6 space-y-6">
          {/* Section skeleton */}
          {[...Array(2)].map((_, index) => (
            <div
              key={index}
              className="bg-card border border-border rounded-lg p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-16" />
              </div>
              <div className="space-y-4">
                {/* Field skeletons */}
                {[...Array(3)].map((_, fieldIndex) => (
                  <div key={fieldIndex} className="p-4 bg-muted rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <Skeleton className="h-5 w-24" />
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-40" />
                      </div>
                      <Skeleton className="h-4 w-12" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full p-6 flex items-center justify-center">
        <div className="text-destructive">
          {error instanceof Error ? error.message : "Failed to load form"}
        </div>
      </div>
    );
  }

  if (!formData) {
    return (
      <div className="h-full p-6 flex items-center justify-center">
        <div className="text-muted-foreground">Form not found</div>
      </div>
    );
  }

  // Render form sections sequentially
  const sections = formData.sections || [];

  return (
    <div className="h-full bg-background">
      <div className="p-6 space-y-6">
        {sections.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No sections found in this form.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Click on the + button in the tabs to add a new section.
            </p>
          </div>
        ) : (
          sections.map((section, index: number) => {
            const fields = section.fields || [];
            const currentTitle =
              sectionTitles[section.id] || section.title || "";
            const originalTitle = section.title || "";
            const hasChanges = currentTitle !== originalTitle;

            console.log({
              sections,
            });

            return (
              <div key={section.id} className="space-y-4">
                {/* Always Visible Edit Section Card */}
                <Card className="p-4 bg-muted/50 border-dashed ">
                  <div className="flex items-center gap-3">
                    <Input
                      value={currentTitle}
                      onChange={(e) =>
                        handleSectionTitleChange(section.id, e.target.value)
                      }
                      disabled={updateSectionMutation.isPending}
                      placeholder="Enter section name..."
                      className="flex-1 h-8 text-sm"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleSaveSection(section.id);
                        } else if (e.key === "Escape") {
                          handleResetSection(section.id, originalTitle);
                        }
                      }}
                    />
                    <Button
                      size="sm"
                      onClick={() => handleSaveSection(section.id)}
                      disabled={
                        !currentTitle.trim() ||
                        updateSectionMutation.isPending ||
                        !hasChanges
                      }
                      className="h-8 px-3"
                    >
                      {updateSectionMutation.isPending ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <Save className="w-3 h-3" />
                      )}
                      Save
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        handleResetSection(section.id, originalTitle)
                      }
                      disabled={updateSectionMutation.isPending || !hasChanges}
                      className="h-8 px-3"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Reset
                    </Button>
                  </div>
                </Card>

                {/* Section Content */}
                <div className="">
                  {/* <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-foreground">
                      {originalTitle || `Section ${index + 1}`}
                    </h2>
                    <span className="text-sm text-muted-foreground">
                      {fields.length} fields
                    </span>
                  </div> */}

                  {fields.length > 0 ? (
                    <div className="space-y-4">
                      {fields.map((field) => {
                        return (
                          <FormComponentRender
                            key={field.id}
                            type={field.type}
                          />
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>No fields in this section</p>
                      <p className="text-sm mt-1">
                        Drag fields from the sidebar to add them
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default FormBuilderPage;
