"use client";

import { Moon, SunDim } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { flushSync } from "react-dom";
import { cn } from "@/lib/utils";

type props = {
  className?: string;
};

export const AnimatedThemeToggler = ({ className }: props) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  // Initialize theme state on mount from localStorage and current DOM
  useEffect(() => {
    // Get saved theme from localStorage or default to light
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    let shouldBeDark = false;

    if (savedTheme) {
      // Use saved preference
      shouldBeDark = savedTheme === "dark";
    } else {
      // Use system preference
      shouldBeDark = prefersDark;
    }

    // Apply theme to DOM
    if (shouldBeDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    // Update state
    setIsDarkMode(shouldBeDark);
    setIsInitialized(true);

    // Save initial preference if not already saved
    if (!savedTheme) {
      localStorage.setItem("theme", shouldBeDark ? "dark" : "light");
    }
  }, []);

  const changeTheme = async () => {
    if (!buttonRef.current) return;

    const newTheme = !isDarkMode;

    try {
      await document.startViewTransition(() => {
        flushSync(() => {
          if (newTheme) {
            document.documentElement.classList.add("dark");
          } else {
            document.documentElement.classList.remove("dark");
          }
          setIsDarkMode(newTheme);
          // Save to localStorage
          localStorage.setItem("theme", newTheme ? "dark" : "light");
        });
      }).ready;

      const { top, left, width, height } =
        buttonRef.current.getBoundingClientRect();
      const y = top + height / 2;
      const x = left + width / 2;

      const right = window.innerWidth - left;
      const bottom = window.innerHeight - top;
      const maxRad = Math.hypot(Math.max(left, right), Math.max(top, bottom));

      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${maxRad}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: 700,
          easing: "ease-in-out",
          pseudoElement: "::view-transition-new(root)",
        }
      );
    } catch (error) {
      // Fallback for browsers that don't support view transitions
      console.warn(
        "View transition not supported, falling back to direct toggle",
        error
      );
      if (newTheme) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      setIsDarkMode(newTheme);
      localStorage.setItem("theme", newTheme ? "dark" : "light");
    }
  };

  // Don't render until theme is initialized to prevent flash
  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-transparent">
        <div className="h-5 w-5 animate-pulse bg-muted rounded" />
      </div>
    );
  }

  return (
    <button
      ref={buttonRef}
      onClick={changeTheme}
      className={cn(
        "flex items-center justify-center w-10 h-10 rounded-lg",
        "bg-transparent border-0",
        "hover:bg-accent/50 hover:text-accent-foreground",
        "transition-all duration-200 ease-in-out",
        "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        className
      )}
      aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDarkMode ? (
        <SunDim className="h-5 w-5 text-foreground" />
      ) : (
        <Moon className="h-5 w-5 text-foreground" />
      )}
    </button>
  );
};
