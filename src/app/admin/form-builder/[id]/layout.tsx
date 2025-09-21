"use client";

import React from "react";
import { FormBuilderTopBar } from "@/components/form-builder/FormBuilderTopBar";
import { FormBuilderRightSidebar } from "@/components/form-builder/FormBuilderRightSidebar";
import { type FieldType } from "@/constants";

interface FormBuilderLayoutProps {
  children: React.ReactNode;
}

const FormBuilderLayout: React.FC<FormBuilderLayoutProps> = ({ children }) => {
  const [activeTab, setActiveTab] = React.useState("basic-details");

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
    const tabName = prompt("Enter new tab name:");
    if (tabName) {
      console.log("Add new tab:", tabName);
      // TODO: Implement add tab functionality
    }
  };

  const handleFieldSelect = (fieldType: FieldType) => {
    console.log("Selected field:", fieldType);
    // TODO: Implement field selection functionality
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Top Bar */}
      <FormBuilderTopBar
        formTitle="Website Audit"
        activeTab={activeTab}
        onSave={handleSave}
        onPreview={handlePreview}
        onCancel={handleCancel}
        onTabChange={handleTabChange}
        onAddTab={handleAddTab}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Form Builder Canvas */}
        <div className="flex-1 overflow-auto">{children}</div>

        {/* Right Sidebar */}
        <FormBuilderRightSidebar onFieldSelect={handleFieldSelect} />
      </div>
    </div>
  );
};

export default FormBuilderLayout;
