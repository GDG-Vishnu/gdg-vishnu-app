"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button3D } from "@/components/ui/3d-button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Eye, Save, ArrowLeft, X, Plus, Trash2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDeleteForm } from "@/hooks/use-forms";
import { FormDeletionLoading } from "./loading-pages";

interface FormBuilderTopBarProps {
  formId?: string;
  formTitle?: string;
  activeTab?: string;
  sections?: Array<{ id: string; title: string }>;
  onSave?: () => void;
  onPreview?: () => void;
  onCancel?: () => void;
  onTabChange?: (tab: string) => void;
  onAddTab?: () => void;
  isLoading?: boolean;
}

export const FormBuilderTopBar: React.FC<FormBuilderTopBarProps> = ({
  formId,
  formTitle,
  activeTab = "basic-details",
  sections = [],
  onSave,
  onPreview,
  onCancel,
  onTabChange,
  onAddTab,
  isLoading = false,
}) => {
  const router = useRouter();
  const deleteFormMutation = useDeleteForm();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Debug log to check if formId is being passed
  console.log("FormBuilderTopBar props:", { formId, formTitle });

  const handleBack = () => {
    router.push("/admin/forms");
  };

  const handleCancelClick = () => {
    console.log("Cancel clicked, formId:", formId);
    if (formId) {
      console.log("Opening delete dialog for form:", formId);
      setIsDeleteDialogOpen(true);
    } else {
      console.log("No formId, calling onCancel or going back");
      // If no formId, just call the original onCancel or go back
      onCancel?.() || handleBack();
    }
  };

  const handleDeleteConfirm = async () => {
    console.log("Delete confirm clicked for formId:", formId);
    if (!formId) {
      console.log("No formId available for deletion");
      return;
    }

    // Close dialog immediately and show loading
    setIsDeleteDialogOpen(false);

    try {
      console.log("Calling deleteFormMutation with formId:", formId);
      const result = await deleteFormMutation.mutateAsync(formId);
      console.log("Delete result:", result);
      if (result.success) {
        router.push("/admin/forms");
      }
    } catch (error) {
      console.error("Error deleting form:", error);
      // You might want to show a toast notification here
    }
  };

  // Use dynamic sections if provided, otherwise fall back to default sections
  const defaultSections = [
    { id: "basic-details", title: "Basic Details" },
    { id: "fields", title: "Fields" },
    { id: "rules", title: "Rules" },
    { id: "scripts", title: "Scripts" },
  ];

  const displaySections = sections.length > 0 ? sections : defaultSections;

  return (
    <div className="border-b bg-background border-border">
      {/* First Line: Back button, Form name, Draft badge, and Action buttons */}
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
            className="h-8 w-8"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>

          <div className="flex items-center space-x-3">
            {isLoading ? (
              <Skeleton className="h-8 w-48" />
            ) : (
              <h1 className="text-2xl font-semibold text-foreground">
                {formTitle || "Untitled Form"}
              </h1>
            )}
            <Badge variant="outline" className="text-xs">
              Draft
            </Badge>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={onPreview}
            className="gap-2"
          >
            <Eye className="h-4 w-4" />
            <span>View Form</span>
          </Button>

          <Button3D
            variant="destructive"
            size="sm"
            onClick={handleCancelClick}
            disabled={deleteFormMutation.isPending}
            className="gap-2 text-white"
          >
            {deleteFormMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
            <span>
              {deleteFormMutation.isPending ? "Deleting..." : "Delete"}
            </span>
          </Button3D>

          <Button3D
            variant="default"
            size="sm"
            onClick={onSave}
            className="gap-2"
          >
            <Save className="h-4 w-4" />
            <span>Save</span>
          </Button3D>
        </div>
      </div>

      {/* Second Line: Tabs only */}
      <div className="flex items-center px-6 h-12">
        <div className="flex items-center h-full">
          {isLoading ? (
            <div className="flex items-center space-x-4">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-18" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
          ) : (
            <>
              <Tabs
                value={activeTab}
                onValueChange={onTabChange}
                className="w-auto h-full"
              >
                <TabsList className="bg-transparent p-0 h-full">
                  {displaySections.map((section) => (
                    <TabsTrigger
                      key={section.id}
                      value={section.id}
                      className="border-b-2 border-orange-400 data-[state=active]:border-orange-400 data-[state=active]:bg-transparent rounded-none px-4 py-2 text-sm font-medium text-muted-foreground data-[state=active]:text-foreground border-t-0 border-l-0 border-r-0 hover:text-foreground hover:bg-muted data-[state=active]:shadow-none bg-background"
                    >
                      {section.title}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>

              <Button
                variant="ghost"
                size="sm"
                onClick={onAddTab}
                className="ml-2 h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-muted"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Form</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{formTitle || "this form"}"? This
              action cannot be undone. All form data, sections, fields, and
              submissions will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={deleteFormMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteFormMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Form
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Form Deletion Loading */}
      {deleteFormMutation.isPending && (
        <FormDeletionLoading formName={formTitle || "form"} />
      )}
    </div>
  );
};
