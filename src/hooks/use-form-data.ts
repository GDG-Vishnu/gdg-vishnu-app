import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getFormById } from "@/actions/forms";
import type { FormData, CreateSectionInput } from "@/types/form-builder";

// Query keys for React Query
export const FORM_QUERY_KEYS = {
  form: (id: string) => ["form", id],
  forms: () => ["forms"],
} as const;

// Hook to fetch form by ID
export function useForm(formId: string | null) {
  return useQuery({
    queryKey: FORM_QUERY_KEYS.form(formId || ""),
    queryFn: async () => {
      if (!formId) throw new Error("Form ID is required");
      const result = await getFormById(formId);
      if (!result.success) {
        throw new Error(result.error || "Failed to fetch form");
      }
      return result.data;
    },
    enabled: !!formId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
  });
}

// Hook to create a new section
export function useCreateSection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateSectionInput) => {
      // TODO: Implement actual API call to create section
      console.log("Creating section:", input);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      return {
        success: true,
        data: {
          id: `section_${Date.now()}`,
          title: input.title,
          order: input.order || 0,
          formId: input.formId,
          fields: [],
        },
      };
    },
    onSuccess: (data, variables) => {
      // Invalidate and refetch form data
      queryClient.invalidateQueries({
        queryKey: FORM_QUERY_KEYS.form(variables.formId),
      });
    },
    onError: (error) => {
      console.error("Error creating section:", error);
    },
  });
}

// Hook to update form
export function useUpdateForm() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: Partial<FormData> & { id: string }) => {
      // TODO: Implement actual API call to update form
      console.log("Updating form:", formData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      return {
        success: true,
        data: formData,
      };
    },
    onSuccess: (data, variables) => {
      // Update the specific form in cache
      queryClient.setQueryData(
        FORM_QUERY_KEYS.form(variables.id),
        (oldData: FormData | undefined) => {
          if (!oldData) return oldData;
          return { ...oldData, ...variables };
        }
      );
    },
    onError: (error) => {
      console.error("Error updating form:", error);
    },
  });
}

// Hook to delete form
export function useDeleteForm() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formId: string) => {
      // TODO: Implement actual API call to delete form
      console.log("Deleting form:", formId);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      return { success: true };
    },
    onSuccess: (data, formId) => {
      // Remove form from cache
      queryClient.removeQueries({
        queryKey: FORM_QUERY_KEYS.form(formId),
      });

      // Invalidate forms list
      queryClient.invalidateQueries({
        queryKey: FORM_QUERY_KEYS.forms(),
      });
    },
    onError: (error) => {
      console.error("Error deleting form:", error);
    },
  });
}
