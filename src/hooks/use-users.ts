"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllUsers, getUsersCount, updateUserRole } from "@/actions/users";
import { UserRole } from "@prisma/client";
import { toast } from "sonner";

// Query keys
export const userKeys = {
  all: ["users"] as const,
  lists: () => [...userKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) =>
    [...userKeys.lists(), { filters }] as const,
  details: () => [...userKeys.all, "detail"] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
  stats: () => [...userKeys.all, "stats"] as const,
};

// Hook to fetch all users
export function useUsers() {
  return useQuery({
    queryKey: userKeys.lists(),
    queryFn: async () => {
      const result = await getAllUsers();
      if (!result.success) {
        throw new Error(result.error || "Failed to fetch users");
      }
      return result.data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Hook to fetch user statistics
export function useUsersStats() {
  return useQuery({
    queryKey: userKeys.stats(),
    queryFn: async () => {
      const result = await getUsersCount();
      if (!result.success) {
        throw new Error(result.error || "Failed to fetch user stats");
      }
      return result.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Hook to update user role
export function useUpdateUserRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      newRole,
    }: {
      userId: string;
      newRole: UserRole;
    }) => {
      const result = await updateUserRole(userId, newRole);
      if (!result.success) {
        throw new Error(result.error || "Failed to update user role");
      }
      return result;
    },
    onSuccess: () => {
      // Invalidate and refetch user data
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({ queryKey: userKeys.stats() });
      toast.success("User role updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update user role");
      console.error("Update user role error:", error);
    },
  });
}
