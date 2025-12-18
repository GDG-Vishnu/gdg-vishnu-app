"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import Image from "next/image";

export function ForgotPasswordForm() {
  const router = useRouter();

  const handleContactEmail = () => {
    window.location.href =
      "mailto:gdg.dev@vishnu.edu.in?subject=Password Reset Request&body=Hello,%0D%0A%0D%0AI would like to request a password reset for my account.%0D%0A%0D%0AThank you.";
  };

  return (
    <div className="w-full space-y-8">
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

      {/* Forgot Password Section */}
      <div className="text-center space-y-6">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-gray-900">Forgot Password?</h1>
          <p className="text-gray-600">
            No worries! Contact our support team to reset your password.
          </p>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            For password reset requests and any login issues, please contact our
            support team:
          </p>

          <div className="bg-gray-50 p-4 rounded-lg border">
            <p className="font-semibold text-gray-800">GDG Development Team</p>
            <a
              href="mailto:gdg.dev@vishnu.edu.in"
              className="text-blue-600 hover:text-blue-500 underline font-medium"
            >
              gdg.dev@vishnu.edu.in
            </a>
          </div>

          <p className="text-xs text-gray-500">
            Please include your registered email address and any relevant
            details about your account.
          </p>
        </div>

        <div className="space-y-3">
          <Button
            onClick={handleContactEmail}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Mail className="mr-2 h-4 w-4" />
            Send Email Request
          </Button>

          <Button
            variant="outline"
            onClick={() => router.push("/auth/login")}
            className="w-full"
          >
            Back to Login
          </Button>
        </div>
      </div>
    </div>
  );
}
