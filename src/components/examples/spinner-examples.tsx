// Example usage patterns for the Spinner component

import { Spinner } from "@/components/ui/spinner";
import { Loading, InlineSpinner } from "@/components/ui/loading";
import { Button } from "@/components/ui/button";
import { useState } from "react";

// 1. Basic Spinner Usage
export function BasicSpinnerExample() {
  return (
    <div className="space-y-4">
      <h3>Basic Spinner Sizes</h3>
      <div className="flex items-center gap-4">
        <Spinner size="sm" message="Small" />
        <Spinner size="md" message="Medium" />
        <Spinner size="lg" message="Large" />
      </div>
    </div>
  );
}

// 2. Loading Component Usage
export function LoadingExample() {
  const [showOverlay, setShowOverlay] = useState(false);

  return (
    <div className="space-y-4">
      <Button onClick={() => setShowOverlay(true)}>Show Overlay Loading</Button>

      {/* Regular loading */}
      <Loading text="Fetching data..." />

      {/* Overlay loading */}
      {showOverlay && <Loading overlay text="Processing..." size="lg" />}
    </div>
  );
}

// 3. Button with Loading State
export function LoadingButtonExample() {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsLoading(false);
  };

  return (
    <Button onClick={handleClick} disabled={isLoading}>
      {isLoading ? (
        <>
          <InlineSpinner className="mr-2" />
          Loading...
        </>
      ) : (
        "Click me"
      )}
    </Button>
  );
}

// 4. Page Loading Component
export function PageLoadingExample() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Spinner
        size="lg"
        message="Loading page content..."
        messagePlacement="bottom"
      />
    </div>
  );
}

// 5. Card Loading State
export function CardLoadingExample() {
  return (
    <div className="border rounded-lg p-6 min-h-[200px]">
      <Loading text="Loading card data..." size="md" />
    </div>
  );
}
