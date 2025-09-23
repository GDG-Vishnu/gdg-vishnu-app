"use client";

import { useParams } from "next/navigation";
import React from "react";
import { getFormById } from "@/actions/forms";

const FormBuilderPage = () => {
  const { id } = useParams();
  const [formData, setFormData] = React.useState<Record<
    string,
    unknown
  > | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchFormData = async () => {
      if (id && typeof id === "string") {
        try {
          const result = await getFormById(id);
          if (result.success && result.data) {
            setFormData(result.data);
          } else {
            setError(result.error || "Failed to load form");
          }
        } catch (error) {
          console.error("Error fetching form:", error);
          setError("Failed to load form data");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchFormData();
  }, [id]);

  if (loading) {
    return (
      <div className="h-full p-6 flex items-center justify-center">
        <div className="text-muted-foreground">Loading form data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full p-6 flex items-center justify-center">
        <div className="text-destructive">{error}</div>
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
  const sections = (formData.sections as unknown[]) || [];

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
          sections.map((section: unknown, index: number) => {
            const sectionData = section as Record<string, unknown>;
            const fields = (sectionData.fields as unknown[]) || [];

            return (
              <div
                key={sectionData.id as string}
                className="bg-card border border-border rounded-lg p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-foreground">
                    {(sectionData.name as string) || `Section ${index + 1}`}
                  </h2>
                  <span className="text-sm text-muted-foreground">
                    {fields.length} fields
                  </span>
                </div>

                {fields.length > 0 ? (
                  <div className="space-y-4">
                    {fields.map((field: unknown) => {
                      const fieldData = field as Record<string, unknown>;
                      return (
                        <div
                          key={fieldData.id as string}
                          className="p-4 bg-muted rounded-lg"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-medium text-foreground">
                                {fieldData.label as string}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                Type: {fieldData.type as string}{" "}
                                {(fieldData.required as boolean) &&
                                  "• Required"}
                              </p>
                              {(fieldData.placeholder as string) && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  Placeholder: {fieldData.placeholder as string}
                                </p>
                              )}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Order: {fieldData.order as number}
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
