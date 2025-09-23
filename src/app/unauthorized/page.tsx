import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-100 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <AlertTriangle className="h-12 w-12 text-red-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-red-600">
            Access Denied
          </CardTitle>
          <CardDescription>
            You don&apos;t have permission to access this page.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600 text-center">
            If you believe this is an error, please contact your administrator
            to request the appropriate permissions.
          </p>

          <div className="flex flex-col space-y-2">
            <Button asChild>
              <Link href="/client">Go to Dashboard</Link>
            </Button>

            <Button variant="outline" asChild>
              <Link href="/auth/login">Sign in with different account</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
