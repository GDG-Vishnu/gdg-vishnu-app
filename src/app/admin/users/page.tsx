"use client";

import { Suspense, useState, useEffect } from "react";
import { UserRole } from "@prisma/client";
import { getAllUsers } from "@/actions/users";
import { UsersTable } from "./components/UsersTable";
import { UsersStats } from "./components/UsersStats";
import { PageLoading } from "@/components/ui/loading-fallbacks";
import {
  StatsGridSkeleton,
  UsersTableSkeleton,
} from "@/components/ui/skeleton-loaders";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Type for users returned from getAllUsers
type UserFromAPI = {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
  emailVerified: Date | null;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
  _count: {
    accounts: number;
    sessions: number;
  };
};

function UsersStatsWrapper() {
  return (
    <Suspense fallback={<StatsGridSkeleton />}>
      <UsersStats />
    </Suspense>
  );
}

function UsersTableWrapper() {
  const [users, setUsers] = useState<UserFromAPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Add a small delay to better show the skeleton loader
        await new Promise((resolve) => setTimeout(resolve, 800));

        const result = await getAllUsers();
        if (result.success) {
          setUsers(result.data || []);
        } else {
          setError(result.error || "Failed to load users");
        }
      } catch {
        setError("An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return <UsersTableSkeleton />;
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>Error loading users</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-destructive">{error}</p>
        </CardContent>
      </Card>
    );
  }

  return <UsersTable users={users} />;
}

export default function UsersPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Simulate component mounting delay
    const timer = setTimeout(() => {
      setMounted(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  if (!mounted) {
    return <PageLoading message="Loading users page..." />;
  }

  return (
    <div className="space-y-6 p-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Users Management</h1>
        <p className="text-muted-foreground">
          Manage and monitor all users in your system
        </p>
      </div>

      {/* Users Statistics */}
      <UsersStatsWrapper />

      {/* Users Table */}
      <UsersTableWrapper />
    </div>
  );
}
