"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Stats card skeleton
export function StatsCardSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          <div className="h-4 w-20 animate-pulse bg-muted rounded" />
        </CardTitle>
        <div className="h-4 w-4 animate-pulse bg-muted rounded" />
      </CardHeader>
      <CardContent>
        <div className="h-8 w-16 animate-pulse bg-muted rounded mb-2" />
        <div className="h-3 w-24 animate-pulse bg-muted rounded" />
      </CardContent>
    </Card>
  );
}

// Stats grid skeleton
export function StatsGridSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <StatsCardSkeleton key={i} />
      ))}
    </div>
  );
}

// Table row skeleton
export function TableRowSkeleton() {
  return (
    <div className="flex items-center space-x-4 p-4 border-b">
      <div className="h-4 w-4 animate-pulse bg-muted rounded" />
      <div className="h-10 w-10 animate-pulse bg-muted rounded-full" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-32 animate-pulse bg-muted rounded" />
        <div className="h-3 w-48 animate-pulse bg-muted rounded" />
      </div>
      <div className="h-4 w-20 animate-pulse bg-muted rounded" />
      <div className="h-4 w-16 animate-pulse bg-muted rounded" />
      <div className="h-8 w-20 animate-pulse bg-muted rounded" />
    </div>
  );
}

// Table skeleton with header
export function TableSkeleton({
  title = "Loading...",
  description = "Please wait while we load the data",
  rows = 5,
}: {
  title?: string;
  description?: string;
  rows?: number;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        {/* Table header skeleton */}
        <div className="flex items-center space-x-4 p-4 border-b bg-muted/30">
          <div className="h-4 w-4 animate-pulse bg-muted rounded" />
          <div className="h-4 w-16 animate-pulse bg-muted rounded" />
          <div className="h-4 w-24 animate-pulse bg-muted rounded flex-1" />
          <div className="h-4 w-20 animate-pulse bg-muted rounded" />
          <div className="h-4 w-16 animate-pulse bg-muted rounded" />
          <div className="h-4 w-16 animate-pulse bg-muted rounded" />
        </div>

        {/* Table rows skeleton */}
        <div>
          {Array.from({ length: rows }).map((_, i) => (
            <TableRowSkeleton key={i} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Users table specific skeleton
export function UsersTableSkeleton() {
  return (
    <TableSkeleton title="Users" description="Loading users data..." rows={8} />
  );
}
