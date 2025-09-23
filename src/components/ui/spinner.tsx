"use client";

import React from "react";
import { cva } from "class-variance-authority";
import { motion } from "motion/react";

import { cn } from "@/lib/utils";

const spinnerVariants = cva("flex gap-2 items-center justify-center", {
  variants: {
    messagePlacement: {
      bottom: "flex-col",
      top: "flex-col-reverse",
      right: "flex-row",
      left: "flex-row-reverse",
    },
    size: {
      sm: "",
      md: "",
      lg: "",
    },
  },
  defaultVariants: {
    messagePlacement: "bottom",
    size: "md",
  },
});

const spinnerSizeVariants = {
  sm: "w-8 h-8",
  md: "w-16 h-16",
  lg: "w-24 h-24",
};

export interface SpinnerProps {
  message?: string;
  /**
   * Position of the message relative to the spinner.
   * @default bottom
   */
  messagePlacement?: "top" | "bottom" | "left" | "right";
  /**
   * Size of the spinner.
   * @default md
   */
  size?: "sm" | "md" | "lg";
}

export function Spinner({
  className,
  message,
  messagePlacement,
  size = "md",
  ...props
}: React.ComponentProps<"div"> & SpinnerProps) {
  const spinnerSize = spinnerSizeVariants[size];

  return (
    <div className={cn(spinnerVariants({ messagePlacement }))}>
      <div className={cn("relative", spinnerSize, className)} {...props}>
        {/* Green line - outermost orbit */}
        <motion.div
          className="absolute inset-0 border-2 border-transparent border-t-green-500 rounded-full"
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />

        {/* Red line - second orbit */}
        <motion.div
          className="absolute inset-2 border-2 border-transparent border-t-red-500 rounded-full"
          animate={{ rotate: -360 }}
          transition={{
            duration: 1.5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />

        {/* Blue line - third orbit */}
        <motion.div
          className="absolute inset-3 border-2 border-transparent border-t-blue-500 rounded-full"
          animate={{ rotate: 360 }}
          transition={{
            duration: 0.8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />

        {/* Yellow line - innermost orbit */}
        <motion.div
          className="absolute inset-4 border-2 border-transparent border-t-yellow-500 rounded-full"
          animate={{ rotate: -360 }}
          transition={{
            duration: 1.2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
      </div>
      {message && (
        <div className="text-sm text-muted-foreground font-medium">
          {message}
        </div>
      )}
    </div>
  );
}
