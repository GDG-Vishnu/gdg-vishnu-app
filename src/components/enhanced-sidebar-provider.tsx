"use client";

import { SidebarProvider as OriginalSidebarProvider } from "@/components/ui/sidebar";
import { useState, useEffect } from "react";

type EnhancedSidebarProviderProps = {
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
  style?: React.CSSProperties;
};

export function EnhancedSidebarProvider({
  children,
  defaultOpen = true,
  className,
  style,
  ...props
}: EnhancedSidebarProviderProps) {
  const [open, setOpen] = useState(defaultOpen);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize sidebar state from localStorage
  useEffect(() => {
    try {
      const savedState = localStorage.getItem("sidebar_state");
      if (savedState !== null) {
        const isOpen = savedState === "true";
        setOpen(isOpen);
      }
    } catch (error) {
      console.warn("Failed to read sidebar state from localStorage:", error);
    }
    setIsInitialized(true);
  }, []);

  // Save to localStorage whenever state changes
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    try {
      localStorage.setItem("sidebar_state", newOpen.toString());
    } catch (error) {
      console.warn("Failed to save sidebar state to localStorage:", error);
    }
  };

  // Render with initial state during SSR/hydration
  if (!isInitialized) {
    return (
      <OriginalSidebarProvider
        open={defaultOpen}
        className={className}
        style={style}
        {...props}
      >
        {children}
      </OriginalSidebarProvider>
    );
  }

  return (
    <OriginalSidebarProvider
      open={open}
      onOpenChange={handleOpenChange}
      className={className}
      style={style}
      {...props}
    >
      {children}
    </OriginalSidebarProvider>
  );
}
