# Users Page Loading Implementation

## Overview

The users page now has a comprehensive loading system with two distinct phases:

## Loading Phases

### 1. **Page Mount Loading**

- **When**: Component is mounting/initializing
- **Component**: `PageLoading` with colored spinner
- **Message**: "Loading users page..."
- **Duration**: ~300ms
- **Purpose**: Shows while the page structure is being rendered

### 2. **Data Fetching Loading**

- **When**: API calls are being made to fetch data
- **Components**:
  - `StatsGridSkeleton` for user statistics
  - `UsersTableSkeleton` for the users table
- **Duration**: ~800ms + actual API time
- **Purpose**: Shows skeleton loaders that match the actual content structure

## Implementation Details

### Page Structure:

```
UsersPage (with mount loading)
├── Page Header (static)
├── UsersStatsWrapper
│   └── Suspense → StatsGridSkeleton
│       └── UsersStats (async)
└── UsersTableWrapper
    └── useEffect → UsersTableSkeleton
        └── UsersTable (after data fetch)
```

### Loading Flow:

1. **Route Navigation** → `loading.tsx` fallback
2. **Component Mount** → `PageLoading` with spinner
3. **Data Fetching** → Skeleton loaders
4. **Content Ready** → Actual components render

## Skeleton Components Created:

### `StatsGridSkeleton`

- Grid of 4 stat cards
- Animated placeholder for titles, values, and icons
- Matches the actual stats layout

### `UsersTableSkeleton`

- Table structure with header and rows
- Animated placeholders for:
  - Checkboxes
  - Avatars
  - User names and emails
  - Roles and status badges
  - Action buttons
- Configurable number of rows (default: 8)

## Benefits:

1. **Better UX**: Users see immediate feedback
2. **Progressive Loading**: Content appears as it becomes available
3. **Realistic Previews**: Skeletons match actual content structure
4. **Consistent Branding**: Colorful spinner throughout the app
5. **Performance Perception**: Makes the app feel faster

## Usage:

Just navigate to `/admin/users` to see the loading sequence in action!
