"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarRight } from "@/components/sidebar-right";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Calendar } from "lucide-react";
import { useState } from "react";

type Props = {
  children: React.ReactNode;
};

export default function Page({ children }: Props) {
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Building Your Application
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="ml-auto px-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsRightSidebarOpen(!isRightSidebarOpen)}
            >
              <Calendar className="h-4 w-4" />
              <span className="sr-only">Toggle right sidebar</span>
            </Button>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
      </SidebarInset>

      {/* Right Sidebar */}
      <div
        className={`${isRightSidebarOpen ? "block" : "hidden"} lg:${
          isRightSidebarOpen ? "block" : "hidden"
        }`}
      >
        <SidebarRight />
      </div>
    </SidebarProvider>
  );
}
