# Spinner Component Usage Guide

## Overview

The spinner component system provides a consistent loading experience across your application with 4 colorful orbiting balls (green, red, blue, yellow).

## Components Available

### 1. `Spinner` - Base spinner component

```tsx
import { Spinner } from "@/components/ui/spinner"

// Basic usage
<Spinner />

// With message and size
<Spinner
  size="lg"
  message="Loading data..."
  messagePlacement="bottom"
/>
```

### 2. `Loading` - Wrapper component for common loading scenarios

```tsx
import { Loading } from "@/components/ui/loading"

// Page/section loading
<Loading text="Fetching users..." />

// Full screen overlay
<Loading overlay text="Processing request..." size="lg" />
```

### 3. `InlineSpinner` - Small spinner for buttons and inline use

```tsx
import { InlineSpinner } from "@/components/ui/loading";

<Button disabled={loading}>
  {loading && <InlineSpinner className="mr-2" />}
  {loading ? "Saving..." : "Save"}
</Button>;
```

## Integration Examples

### 1. Page Loading States

```tsx
"use client";

import { useState, useEffect } from "react";
import { Loading } from "@/components/ui/loading";

export function UsersList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers().then((data) => {
      setUsers(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <Loading text="Loading users..." size="md" />;
  }

  return <div>{/* Your users list */}</div>;
}
```

### 2. Form Submission Loading

```tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { InlineSpinner } from "@/components/ui/loading";

export function ContactForm() {
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await submitForm(formData);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <Button type="submit" disabled={submitting}>
        {submitting && <InlineSpinner className="mr-2" />}
        {submitting ? "Submitting..." : "Submit"}
      </Button>
    </form>
  );
}
```

### 3. Data Table Loading

```tsx
import { Loading } from "@/components/ui/loading";

export function DataTable({ data, loading }) {
  if (loading) {
    return (
      <div className="border rounded-lg min-h-[400px]">
        <Loading text="Loading table data..." />
      </div>
    );
  }

  return <table>{/* Your table content */}</table>;
}
```

### 4. Card/Widget Loading

```tsx
export function StatsCard({ data, loading }) {
  return (
    <div className="border rounded-lg p-6 min-h-[200px]">
      {loading ? (
        <Loading text="Loading statistics..." size="sm" />
      ) : (
        <div>{/* Card content */}</div>
      )}
    </div>
  );
}
```

### 5. Modal/Dialog Loading

```tsx
import { Loading } from "@/components/ui/loading";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export function UserModal({ open, userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (open && userId) {
      setLoading(true);
      fetchUser(userId).then((data) => {
        setUser(data);
        setLoading(false);
      });
    }
  }, [open, userId]);

  return (
    <Dialog open={open}>
      <DialogContent>
        {loading ? (
          <Loading text="Loading user details..." />
        ) : (
          <div>{/* User details */}</div>
        )}
      </DialogContent>
    </Dialog>
  );
}
```

### 6. Navigation Loading (Route Changes)

```tsx
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loading } from "@/components/ui/loading";

export function NavigationWithLoading() {
  const [navigating, setNavigating] = useState(false);
  const router = useRouter();

  const handleNavigation = (path) => {
    setNavigating(true);
    router.push(path);
    // Note: You might want to use router events to handle this more elegantly
  };

  return (
    <>
      {navigating && <Loading overlay text="Loading page..." size="lg" />}

      <nav>
        <button onClick={() => handleNavigation("/dashboard")}>
          Dashboard
        </button>
      </nav>
    </>
  );
}
```

## Spinner Props

### Spinner Component

- `size`: "sm" | "md" | "lg" (default: "md")
- `message`: string (optional loading message)
- `messagePlacement`: "top" | "bottom" | "left" | "right" (default: "bottom")
- `className`: string (additional CSS classes)

### Loading Component

- `overlay`: boolean (full screen overlay, default: false)
- `text`: string (loading message, default: "Loading...")
- `size`: "sm" | "md" | "lg" (default: "md")
- `messagePlacement`: "top" | "bottom" | "left" | "right" (default: "bottom")
- `className`: string (additional CSS classes)

### InlineSpinner Component

- `size`: "sm" | "md" | "lg" (default: "sm")
- `className`: string (additional CSS classes)

## Best Practices

1. **Use Loading for page-level loading states**
2. **Use InlineSpinner for button loading states**
3. **Use Spinner directly when you need custom positioning**
4. **Always provide meaningful loading messages**
5. **Use overlay Loading for blocking operations**
6. **Match spinner size to the context (sm for buttons, md/lg for pages)**

## Already Integrated Components

The spinner is already integrated into:

- `Button3D` component (uses InlineSpinner when `isLoading={true}`)
- `LoginForm` component (Google sign-in button)

You can now use `isLoading` prop on any Button3D component and it will show the new colorful spinner automatically!
