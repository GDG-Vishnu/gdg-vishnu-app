"use client";

import { UserRole } from "@prisma/client";
import { ReusableTable } from "@/components/reusable-table/ReusableTable";
import { formatDate } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Mail, Shield, Eye } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { updateUserRole } from "@/actions/users";
import { toast } from "sonner";
import { useTransition } from "react";
import { ColumnDef } from "@tanstack/react-table";

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

interface UsersTableProps {
  users: UserFromAPI[];
}

export function UsersTable({ users }: UsersTableProps) {
  const [isPending, startTransition] = useTransition();

  const handleRoleUpdate = (userId: string, newRole: UserRole) => {
    startTransition(async () => {
      const result = await updateUserRole(userId, newRole);
      if (result.success) {
        toast.success("User role updated successfully");
      } else {
        toast.error(result.error || "Failed to update user role");
      }
    });
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "destructive";
      case "ORGANIZER":
      case "CO_ORGANIZER":
        return "default";
      case "FACILITATOR":
      case "TEAM_MEMBER":
        return "secondary";
      default:
        return "outline";
    }
  };

  const columns: ColumnDef<UserFromAPI>[] = [
    {
      accessorKey: "name",
      header: "Name",
      enableSorting: true,
      size: 200,
    },
    {
      accessorKey: "email",
      header: "Email",
      enableSorting: true,
      size: 250,
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-muted-foreground" />
          <span className="truncate">{row.original.email}</span>
        </div>
      ),
    },
    {
      accessorKey: "role",
      header: "Role",
      enableSorting: true,
      size: 120,
      cell: ({ row }) => (
        <Badge variant={getRoleBadgeVariant(row.original.role) as never}>
          {row.original.role.replace("_", " ")}
        </Badge>
      ),
    },
    {
      accessorKey: "emailVerified",
      header: "Verified",
      enableSorting: true,
      size: 100,
      cell: ({ row }) => (
        <Badge variant={row.original.emailVerified ? "default" : "outline"}>
          {row.original.emailVerified ? "Yes" : "No"}
        </Badge>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Joined",
      enableSorting: true,
      size: 120,
      cell: ({ row }) => formatDate(row.original.createdAt),
    },
    {
      id: "actions",
      header: "Actions",
      size: 60,
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(row.original.id)}
            >
              <Eye className="mr-2 h-4 w-4" />
              Copy user ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Change Role</DropdownMenuLabel>
            {Object.values(UserRole).map((role) => (
              <DropdownMenuItem
                key={role}
                onClick={() => handleRoleUpdate(row.original.id, role)}
                disabled={isPending || row.original.role === role}
              >
                <Shield className="mr-2 h-4 w-4" />
                {role.replace("_", " ")}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <ReusableTable
      data={users}
      columns={columns}
      preset="default"
      title="Users Management"
      description="Manage user accounts and roles"
      enableSearch={true}
      enableFilters={true}
      enableSorting={true}
      enablePagination={true}
      enableColumnVisibility={true}
      enableRowSelection={false}
      enableExport={true}
      searchPlaceholder="Search users..."
      emptyStateMessage="No users found"
      emptyStateDescription="No users match your search criteria"
      initialPageSize={10}
      pageSizeOptions={[10, 20, 50, 100]}
    />
  );
}
