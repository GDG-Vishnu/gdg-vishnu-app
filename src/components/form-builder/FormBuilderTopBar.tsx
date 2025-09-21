"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button3D } from "@/components/ui/3d-button";
import { Eye, Save, ArrowLeft, X, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

interface FormBuilderTopBarProps {
  formTitle?: string;
  activeTab?: string;
  onSave?: () => void;
  onPreview?: () => void;
  onCancel?: () => void;
  onTabChange?: (tab: string) => void;
  onAddTab?: () => void;
}

export const FormBuilderTopBar: React.FC<FormBuilderTopBarProps> = ({
  formTitle = "Website Audit",
  activeTab = "basic-details",
  onSave,
  onPreview,
  onCancel,
  onTabChange,
  onAddTab,
}) => {
  const router = useRouter();

  const handleBack = () => {
    router.push("/admin/forms");
  };

  const sections = [
    { id: "basic-details", name: "Basic Details" },
    { id: "fields", name: "Fields" },
    { id: "rules", name: "Rules" },
    { id: "scripts", name: "Scripts" },
  ];

  return (
    <div className="border-b bg-white">
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
            <h1 className="text-2xl font-semibold text-gray-900">
              {formTitle}
            </h1>
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
            className="flex items-center space-x-2"
          >
            <Eye className="h-4 w-4" />
            <span>View Form</span>
          </Button>

          <Button3D
            variant="destructive"
            size="sm"
            onClick={onCancel}
            className="flex items-center space-x-2 text-white"
          >
            <X className="h-4 w-4" />
            <span>Cancel</span>
          </Button3D>

          <Button3D
            variant="default"
            size="sm"
            onClick={onSave}
            className="flex items-center space-x-2"
          >
            <Save className="h-4 w-4" />
            <span>Save</span>
          </Button3D>
        </div>
      </div>

      {/* Second Line: Tabs only */}
      <div className="flex items-center px-6 h-12">
        <div className="flex items-center h-full">
          <Tabs
            value={activeTab}
            onValueChange={onTabChange}
            className="w-auto h-full"
          >
            <TabsList className="bg-transparent p-0 h-full">
              {sections.map((section) => (
                <TabsTrigger
                  key={section.id}
                  value={section.id}
                  className="border-b-2 border-transparent data-[state=active]:border-orange-500 data-[state=active]:bg-transparent rounded-none px-4 py-2 text-sm font-medium text-gray-600 data-[state=active]:text-gray-900 border-t-0 border-l-0 border-r-0 hover:text-gray-900 hover:bg-gray-50 data-[state=active]:shadow-none bg-white"
                >
                  {section.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <Button
            variant="ghost"
            size="sm"
            onClick={onAddTab}
            className="ml-2 h-8 w-8 p-0 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
