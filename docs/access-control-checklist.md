# Access Control System - Checklist & Test Guide

## Architecture Overview

```
src/app/shared/auth/
├── roles.ts           # Centralized role definitions & utilities
├── access-control.ts  # Route access configuration
└── index.ts           # Barrel export

src/app/shared/guards/
└── role.guard.ts      # Updated guards using centralized config
```

## ✅ Implemented Features

### 1. Centralized Role Configuration (`roles.ts`)
- [x] `UserRole` type for known roles
- [x] `ApiRole` type (string) for unknown roles from API
- [x] `ADMIN_ROLES` - extensible array for admin-level access
- [x] `PROFESSIONAL_ROLES` - roles for professional dashboard
- [x] `SUPER_ROLES` - full-access roles
- [x] `CLIENT_ROLES` - basic authenticated users
- [x] Utility functions: `hasAnyRole()`, `hasAllRoles()`, `isAdminUser()`, etc.

### 2. Route Access Control (`access-control.ts`)
- [x] `RouteAccessConfig` interface with roles, mode, permissions
- [x] `AccessMode` type: `'any'` | `'all'`
- [x] `ROUTE_ACCESS` configuration object
- [x] `routeData()` helper for route configuration
- [x] `checkAccess()` function for programmatic checks

### 3. Enhanced Guards (`role.guard.ts`)
- [x] `roleGuard` - Flexible guard supporting:
  - Multiple roles with `any`/`all` mode
  - Future permission checking (prepared)
  - Custom redirect paths
- [x] `adminGuard` - Convenience guard for admin areas
- [x] `professionalGuard` - Convenience guard for professional dashboard

### 4. Session with Permissions (`auth.service.ts`)
- [x] `SessionState.permissions: string[]` added
- [x] `hasPermission()`, `hasAnyPermission()`, `hasAllPermissions()` methods
- [x] Dynamic role handling (unknown roles don't break frontend)

---

## Quick Test Scenarios

### Test 1: Admin Access with Current Roles
```typescript
// User with roles: ['Admin']
// Should access: /admin/*
// Should NOT access: /dashboard (professional only)

// Expected behavior:
// - ADMIN_ROLES includes 'Admin' ✓
// - adminGuard allows access ✓
```

### Test 2: SuperAdmin Access (Full)
```typescript
// User with roles: ['SuperAdmin']
// Should access: /admin/*, /dashboard/*

// Expected behavior:
// - ADMIN_ROLES includes 'SuperAdmin' ✓
// - PROFESSIONAL_ROLES includes 'SuperAdmin' ✓
```

### Test 3: Professional Access
```typescript
// User with roles: ['Professional']
// Should access: /dashboard/*
// Should NOT access: /admin/*

// Expected behavior:
// - professionalGuard allows dashboard ✓
// - adminGuard redirects to home ✓
```

### Test 4: Unknown Role Handling
```typescript
// User with roles: ['Professional', 'NewFutureRole']
// Should NOT break the application

// Expected behavior:
// - hasAnyRole() still works ✓
// - Unknown roles are ignored gracefully ✓
```

### Test 5: Adding BusinessAdmin (Future)
```typescript
// To enable BusinessAdmin for admin area:
// 1. Uncomment in roles.ts ADMIN_ROLES:
//    'BusinessAdmin',
// 2. No changes needed to guards or routes!
```

---

## How to Extend

### Adding a New Admin Role
```typescript
// 1. In roles.ts, add to UserRole type:
export type UserRole = 
  | 'Client'
  | 'Professional'
  | 'Admin'
  | 'SuperAdmin'
  | 'BusinessAdmin'  // ← Add here
  | 'Moderator';

// 2. In roles.ts, add to ADMIN_ROLES:
export const ADMIN_ROLES: readonly UserRole[] = [
  'Admin',
  'SuperAdmin',
  'BusinessAdmin',  // ← Uncomment/add here
] as const;

// Done! All admin routes automatically include the new role.
```

### Adding Permission-Based Access (Future)
```typescript
// 1. Backend returns permissions in /auth/me
// 2. Routes can specify:
{
  path: 'reports',
  data: { 
    roles: ['Admin'],
    permissions: ['view:reports', 'export:reports'],
    permissionMode: 'any'  // OR 'all'
  },
  canActivate: [roleGuard]
}
```

### Creating Module-Specific Access
```typescript
// In access-control.ts, add to ROUTE_ACCESS:
'reports.export': {
  roles: ['Admin', 'Analyst'],
  permissions: ['export:reports'],
  mode: 'any',
} satisfies RouteAccessConfig,

// In route config:
import { routeData } from '@shared/auth';
{
  path: 'export',
  data: routeData('reports.export'),
  canActivate: [roleGuard]
}
```

---

## Files Modified

| File | Change |
|------|--------|
| `shared/auth/roles.ts` | NEW - Centralized role definitions |
| `shared/auth/access-control.ts` | NEW - Route access configuration |
| `shared/auth/index.ts` | NEW - Barrel export |
| `shared/guards/role.guard.ts` | UPDATED - Flexible guard with modes |
| `shared/services/auth.service.ts` | UPDATED - Added permissions support |
| `data-access/api/api-models.ts` | UPDATED - Dynamic roles, added permissions |
| `admin/admin.routes.ts` | UPDATED - Uses `routeData('admin')` |
| `app/app.routes.ts` | UPDATED - Uses `routeData('professional')` |

---

## Build Status

```
✅ TypeScript compilation: PASS
✅ Angular build: PASS  
✅ Prerender: PASS (10 static routes)
```
