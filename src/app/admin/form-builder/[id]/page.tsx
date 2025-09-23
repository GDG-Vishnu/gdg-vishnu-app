"use client";

import { useParams } from "next/navigation";
import React from "react";
import { useForm } from "@/hooks/use-form-data";
import { Skeleton } from "@/components/ui/skeleton";

const FormBuilderPage = () => {
  const { id } = useParams();
  const formId = id as string;

  const { data: formData, isLoading, error } = useForm(formId);

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

            return (
              <div
                key={section.id}
                className="bg-card border border-border rounded-lg p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-foreground">
                    {section.title || `Section ${index + 1}`}
                  </h2>
                  <span className="text-sm text-muted-foreground">
                    {fields.length} fields
                  </span>
                </div>

                {fields.length > 0 ? (
                  <div className="space-y-4">
                    {fields.map((field) => {
                      return (
                        <div key={field.id} className="p-4 bg-muted rounded-lg">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-medium text-foreground">
                                {field.label}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                Type: {field.type}{" "}
                                {field.required && "• Required"}
                              </p>
                              {field.placeholder && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  Placeholder: {field.placeholder}
                                </p>
                              )}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Order: {field.order}
                            </div>
                          </div>
                        </div>
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
            );
          })
        )}
      </div>
    </div>
  );
};

export default FormBuilderPage;
