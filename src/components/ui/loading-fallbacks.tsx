"use client";

import React from "react";
import { Loading } from "@/components/ui/loading";

// Page-level loading fallback
export function PageLoading({
  message = "Loading page...",
}: {
  message?: string;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loading text={message} size="lg" />
    </div>
  );
}

// Section/Card loading fallback
export function SectionLoading({
  message = "Loading...",
  minHeight = "200px",
}: {
  message?: string;
  minHeight?: string;
}) {
  return (
    <div
      className="flex items-center justify-center w-full"
      style={{ minHeight }}
    >
      <Loading text={message} size="md" />
    </div>
  );
}

// Dashboard card loading
export function CardLoading({
  message = "Loading data...",
}: {
  message?: string;
}) {
  return (
    <div className="border rounded-lg p-6 min-h-[200px] flex items-center justify-center">
      <Loading text={message} size="md" />
    </div>
  );
}

// Table loading
export function TableLoading({
  message = "Loading table data...",
}: {
  message?: string;
}) {
  return (
    <div className="border rounded-lg min-h-[400px] flex items-center justify-center">
      <Loading text={message} size="md" />
    </div>
  );
}

// Modal/Dialog loading
export function ModalLoading({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="flex items-center justify-center p-8 min-h-[300px]">
      <Loading text={message} size="md" />
    </div>
  );
}

// Full screen overlay loading
export function OverlayLoading({
  message = "Processing...",
}: {
  message?: string;
}) {
  return <Loading overlay text={message} size="lg" />;
}
