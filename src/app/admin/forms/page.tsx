"use client";

import React from "react";
import { useForms } from "@/hooks/use-forms";
import GradientCard from "@/components/global/GradientCard";
import { CreateFormSheet } from "@/components/forms/CreateFormSheet";
import { Button } from "@/components/ui/button";
import { Plus, Loader2, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

const FormsPage = () => {
  const { data: forms, isLoading, error, isError } = useForms();
  const router = useRouter();

  const handleFormClick = (formId: string) => {
    router.push(`/admin/forms/${formId}`);
  };

  const getVariantForIndex = (index: number) => {
    const variants = [
      "blue",
      "green",
      "yellow",
      "red",
      "purple",
      "orange",
    ] as const;
    return variants[index % variants.length];
  };

  return (
    <div className="p-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Form Builder
          </h1>
          <p className="text-gray-600">
            Create, manage, and analyze your forms
          </p>
        </div>

        <CreateFormSheet>
          <Button variant="default" size="lg">
            <Plus className="w-5 h-5 mr-2" />
            Add Form
          </Button>
        </CreateFormSheet>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
            <p className="text-gray-600">Loading forms...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <AlertCircle className="w-8 h-8 mx-auto mb-4 text-red-500" />
            <p className="text-gray-600 mb-4">
              {error instanceof Error ? error.message : "Failed to load forms"}
            </p>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </div>
      )}

      {/* Forms Grid */}
      {!isLoading && !isError && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {forms && forms.length > 0 ? (
            forms.map((form, index) => (
              <GradientCard
                key={form.id}
                variant={getVariantForIndex(index)}
                form={form}
                onClick={() => handleFormClick(form.id)}
              />
            ))
          ) : (
            <div className="col-span-full">
              <div className="text-center py-12">
                <div className="mb-4">
                  <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                    <Plus className="w-12 h-12 text-gray-400" />
                  </div>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No forms yet
                </h3>
                <p className="text-gray-600 mb-6">
                  Get started by creating your first form
                </p>
                <CreateFormSheet>
                  <Button variant="default">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Form
                  </Button>
                </CreateFormSheet>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Stats Section (if forms exist) */}
      {!isLoading && !isError && forms && forms.length > 0 && (
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-md">
                  <Plus className="w-5 h-5 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Total Forms
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {forms.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-md">
                  <Plus className="w-5 h-5 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Total Responses
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {forms.reduce(
                      (total, form) => total + form._count.submissions,
                      0
                    )}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-md">
                  <Plus className="w-5 h-5 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Total Sections
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {forms.reduce(
                      (total, form) => total + form._count.sections,
                      0
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormsPage;
