import { Suspense } from "react";
import { getAllUsers } from "@/actions/users";
import { UsersTable } from "./components/UsersTable";
import { UsersStats } from "./components/UsersStats";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

async function UsersTableWrapper() {
  const result = await getAllUsers();

  if (!result.success) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>Error loading users</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-destructive">{result.error}</p>
        </CardContent>
      </Card>
    );
  }

  return <UsersTable users={result.data || []} />;
}

export default async function UsersPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Users Management</h1>
        <p className="text-muted-foreground">
          Manage and monitor all users in your system
        </p>
      </div>

      {/* Users Statistics */}
      <Suspense
        fallback={
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Loading...
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-6 w-16 animate-pulse bg-muted rounded" />
                </CardContent>
              </Card>
            ))}
          </div>
        }
      >
        <UsersStats />
      </Suspense>

      {/* Users Table */}
      <Suspense
        fallback={
          <Card>
            <CardHeader>
              <CardTitle>Users</CardTitle>
              <CardDescription>Loading users...</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex space-x-4">
                    <div className="h-4 w-4 animate-pulse bg-muted rounded" />
                    <div className="h-4 flex-1 animate-pulse bg-muted rounded" />
                    <div className="h-4 w-20 animate-pulse bg-muted rounded" />
                    <div className="h-4 w-20 animate-pulse bg-muted rounded" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        }
      >
        <UsersTableWrapper />
      </Suspense>
    </div>
  );
}
