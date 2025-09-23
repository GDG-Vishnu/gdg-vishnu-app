"use client";

import React from "react";
import { FormBuilderTopBar } from "@/components/form-builder/FormBuilderTopBar";
import { FormBuilderRightSidebar } from "@/components/form-builder/FormBuilderRightSidebar";
import { type FieldType } from "@/constants";
import { useParams } from "next/navigation";
import { useForm, useCreateSection } from "@/hooks/use-form-data";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";

interface FormBuilderLayoutProps {
  children: React.ReactNode;
}

const FormBuilderLayout: React.FC<FormBuilderLayoutProps> = ({ children }) => {
  const { id } = useParams();
  const formId = id as string;

  const { data: formData, isLoading } = useForm(formId);
  const createSectionMutation = useCreateSection();

  const [activeTab, setActiveTab] = React.useState("basic-details");
  const [isAddSectionOpen, setIsAddSectionOpen] = React.useState(false);
  const [newSectionName, setNewSectionName] = React.useState("");

  const handleSave = () => {
    console.log("Save form");
    // TODO: Implement save functionality
  };

  const handlePreview = () => {
    console.log("Preview form");
    // TODO: Implement preview functionality
  };

  const handleCancel = () => {
    console.log("Cancel form");
    // TODO: Implement cancel functionality
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    console.log("Changed to tab:", tab);
    // TODO: Implement tab change functionality
  };

  const handleAddTab = () => {
    setIsAddSectionOpen(true);
  };

  const handleAddSection = async () => {
    if (newSectionName.trim()) {
      try {
        await createSectionMutation.mutateAsync({
          formId,
          title: newSectionName.trim(),
          order: (formData?.sections?.length || 0) + 1,
        });
        setNewSectionName("");
        setIsAddSectionOpen(false);
      } catch (error) {
        console.error("Error creating section:", error);
      }
    }
  };

  const handleFieldSelect = (fieldType: FieldType) => {
    console.log("Selected field:", fieldType);
    // TODO: Implement field selection functionality
  };

  // Get sections from form data
  const sections = React.useMemo(() => {
    if (!formData?.sections) return [];
    return formData.sections.map((section) => ({
      id: section.id,
      title: section.title || "Untitled Section", // Handle null titles
    }));
  }, [formData]);

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Top Bar */}
      <FormBuilderTopBar
        formTitle={formData?.name || "Loading..."}
        activeTab={activeTab}
        sections={sections}
        onSave={handleSave}
        onPreview={handlePreview}
        onCancel={handleCancel}
        onTabChange={handleTabChange}
        onAddTab={handleAddTab}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Form Builder Canvas */}
        <div className="flex-1 overflow-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-muted-foreground">Loading form...</div>
            </div>
          ) : (
            children
          )}
        </div>

        {/* Right Sidebar */}
        <FormBuilderRightSidebar onFieldSelect={handleFieldSelect} />
      </div>

      {/* Add Section Sheet */}
      <Sheet open={isAddSectionOpen} onOpenChange={setIsAddSectionOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Add New Section</SheetTitle>
            <SheetDescription>
              Create a new section for your form. You can add fields to it
              later.
            </SheetDescription>
          </SheetHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="section-name">Section Name</Label>
              <Input
                id="section-name"
                value={newSectionName}
                onChange={(e) => setNewSectionName(e.target.value)}
                placeholder="Enter section name..."
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setIsAddSectionOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddSection}
              disabled={!newSectionName.trim()}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Section
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default FormBuilderLayout;
