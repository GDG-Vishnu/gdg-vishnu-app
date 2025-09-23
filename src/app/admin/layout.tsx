"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarRight } from "@/components/sidebar-right";
import { Button3D } from "@/components/ui/3d-button";
import { SidebarInset } from "@/components/ui/sidebar";
import { EnhancedSidebarProvider } from "@/components/enhanced-sidebar-provider";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Calendar } from "lucide-react";
import { useState, useEffect } from "react";

type Props = {
  children: React.ReactNode;
};

export default function Page({ children }: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <EnhancedSidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex flex-1 flex-col gap-4 h-full bg-background">
          {children}
        </div>
      </SidebarInset>

      {/* Floating Calendar Button3D - Only render after mount to avoid hydration issues */}
      {mounted && (
        <Sheet>
          <SheetTrigger asChild>
            <div className="fixed bottom-6 right-6 z-50">
              <Button3D
                variant="default"
                size="sm"
                className="rounded-full shadow-lg"
              >
                <Calendar className="h-4 w-4" />
              </Button3D>
            </div>
          </SheetTrigger>
          <SheetContent>
            <SidebarRight />
          </SheetContent>
        </Sheet>
      )}
    </EnhancedSidebarProvider>
  );
}
