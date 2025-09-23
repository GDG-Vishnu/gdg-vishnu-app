"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Mail } from "lucide-react";
import Image from "next/image";

export function AuthErrorContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const error = searchParams.get("error");

  const getErrorMessage = () => {
    switch (error) {
      case "OAuthAccountNotLinked":
        return {
          title: "Account Not Linked",
          message:
            "This email is already registered with a different sign-in method. Please use the same method you used to create your account, or contact support for assistance.",
          suggestion:
            "Try signing in with your email and password instead, or contact gdg.dev@vishnu.edu.in for help linking your accounts.",
        };
      case "AccessDenied":
        return {
          title: "Access Denied",
          message: "You don't have permission to access this application.",
          suggestion:
            "Only @vishnu.edu.in email addresses are allowed. Please contact gdg.dev@vishnu.edu.in if you believe this is an error.",
        };
      case "Verification":
        return {
          title: "Email Verification Required",
          message: "Please verify your email address to continue.",
          suggestion:
            "Check your email for a verification link, or contact gdg.dev@vishnu.edu.in for assistance.",
        };
      default:
        return {
          title: "Authentication Error",
          message: "An unexpected error occurred during authentication.",
          suggestion:
            "Please try again or contact gdg.dev@vishnu.edu.in if the problem persists.",
        };
    }
  };

  const errorInfo = getErrorMessage();

  const handleContactSupport = () => {
    window.location.href = `mailto:gdg.dev@vishnu.edu.in?subject=Authentication Error - ${error}&body=Hello,%0D%0A%0D%0AI'm experiencing an authentication error: ${error}%0D%0A%0D%0APlease help me resolve this issue.%0D%0A%0D%0AThank you.`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="flex justify-center">
          <div className="relative w-30 h-30">
            <Image
              src="/Logo.webp"
              alt="GDG Vishnu Logo"
              width={120}
              height={120}
              className="rounded-full object-cover"
            />
          </div>
        </div>

        {/* Error Section */}
        <div className="text-center space-y-6">
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              {errorInfo.title}
            </h1>
            <p className="text-gray-600">{errorInfo.message}</p>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <p className="text-sm text-yellow-800">
              <strong>Suggestion:</strong> {errorInfo.suggestion}
            </p>
          </div>

          {error === "OAuthAccountNotLinked" && (
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                <strong>Quick Fix:</strong> If you created your account with
                email and password, please use the &quot;Sign in with
                email&quot; option instead of Google.
              </p>
            </div>
          )}

          <div className="space-y-3">
            <Button
              onClick={() => router.push("/auth/login")}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              Try Again
            </Button>

            <Button
              variant="outline"
              onClick={handleContactSupport}
              className="w-full"
            >
              <Mail className="mr-2 h-4 w-4" />
              Contact Support
            </Button>

            <Button
              variant="ghost"
              onClick={() => router.push("/")}
              className="w-full"
            >
              Go to Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
