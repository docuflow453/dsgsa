# Role-Based Navigation Implementation

## Overview

The navigation menu system has been enhanced to display menu items based on the user's role. When a user logs in with a specific role (using test personas or real authentication), only the menu items relevant to that role will be displayed.

## How It Works

### 1. **Role Assignment in Navigation Items**

Each navigation item in `navigation.ts` can have a `role` property that specifies which roles can see that item:

```typescript
{
  id: 'rider-dashboard',
  title: 'My Dashboard',
  type: 'group',
  role: [Role.Rider],  // Only visible to Riders
  children: [...]
}
```

### 2. **Role Inheritance**

- **Parent Roles**: If a group has a role, all children inherit that role unless they specify their own
- **Child Roles**: Children can override parent roles by specifying their own `role` array
- **No Roles**: If neither parent nor child has roles defined, the item is visible to all users

### 3. **Visibility Logic**

The navigation system checks roles at three levels:

#### **Group Level** (`nav-group.component.ts`)
- Checks if the current user's role matches the group's allowed roles
- Hides the entire group if the user doesn't have access
- Example: "My Dashboard" group only shows for Riders

#### **Collapse Level** (`nav-collapse.component.ts`)
- Checks if the current user's role matches the collapse item's allowed roles
- Inherits from parent if no specific roles defined
- Hides the collapse menu if the user doesn't have access

#### **Item Level** (`nav-item.component.ts`)
- Checks if the current user's role matches the item's allowed roles
- Inherits from parent if no specific roles defined
- Hides individual menu items if the user doesn't have access

## Files Modified

### 1. `nav-item.component.ts`
**Changes:**
- Fixed role checking logic to properly evaluate user permissions
- Removed hardcoded `this.isEnabled = true` that was overriding role checks
- Added proper role inheritance from parent

**Key Logic:**
```typescript
if (item.role && item.role.length > 0) {
  // Item has specific roles - check if user has access
  this.isEnabled = item.role.includes(CurrentUserRole);
} else if (parentRoleValue && parentRoleValue.length > 0) {
  // Inherit from parent role
  this.isEnabled = parentRoleValue.includes(CurrentUserRole);
} else {
  // No roles defined - visible to all
  this.isEnabled = true;
}
```

### 2. `nav-item.component.html`
**Changes:**
- Updated condition to hide items: `@if (!item().hidden && isEnabled)`
- Removed disabled state styling (items are now hidden instead of disabled)
- Removed lock icons and tooltips for disabled items

### 3. `nav-collapse.component.ts`
**Changes:**
- Added proper role checking logic matching nav-item
- Fixed role inheritance from parent
- Default to enabled if no roles specified

### 4. `nav-collapse.component.html`
**Changes:**
- Updated condition to hide collapses: `@if (!item().hidden && isEnabled)`
- Removed disabled state styling
- Removed tooltips for disabled items

### 5. `nav-group.component.ts`
**Changes:**
- Added `AuthenticationService` injection
- Added `isVisible` property to track group visibility
- Added role checking in `ngOnInit()`

**Key Logic:**
```typescript
if (item.role && item.role.length > 0) {
  this.isVisible = item.role.includes(currentUserRole);
} else {
  this.isVisible = true;
}
```

### 6. `nav-group.component.html`
**Changes:**
- Updated condition to hide groups: `@if (!item().hidden && isVisible)`

## Navigation Structure Example

```typescript
export const NavigationItems: NavigationItem[] = [
  // Rider-specific navigation
  {
    id: 'rider-dashboard',
    title: 'My Dashboard',
    type: 'group',
    role: [Role.Rider],  // Only Riders see this group
    children: [
      {
        id: 'rider-home',
        title: 'Dashboard',
        type: 'item',
        url: '/my/dashboard',
        icon: 'dashboard',
        role: [Role.Rider]  // Explicitly for Riders
      },
      {
        id: 'rider-horses',
        title: 'My Horses',
        type: 'item',
        url: '/my/horses',
        icon: 'heart'
        // No role specified - inherits from parent (Rider)
      }
    ]
  },
  
  // Admin-specific navigation
  {
    id: 'admin-dashboard',
    title: 'Administration',
    type: 'group',
    role: [Role.Admin],  // Only Admins see this group
    children: [...]
  },
  
  // Multi-role navigation
  {
    id: 'shared-features',
    title: 'Features',
    type: 'group',
    role: [Role.Admin, Role.Rider, Role.Club],  // Multiple roles
    children: [...]
  }
];
```

## Testing Role-Based Navigation

### Step 1: Login with Different Roles

Using test personas:
1. Select "Rider" role and login
2. Observe only Rider-specific menu items
3. Logout
4. Select "Admin" role and login
5. Observe only Admin-specific menu items

### Step 2: Verify Menu Items

**For Rider Role:**
- ✅ Should see: "My Dashboard", "My Profile", "My Horses", "My Entries"
- ❌ Should NOT see: "Administration", "User Management", "System Settings"

**For Admin Role:**
- ✅ Should see: "Dashboard", "Application", "Forms & Tables", "Charts"
- ❌ Should NOT see: "My Dashboard" (Rider-specific)

**For Club Role:**
- ✅ Should see: "Club Dashboard", "Members", "Events"
- ❌ Should NOT see: Rider or Admin specific items

### Step 3: Check Console Logs

The navigation components log role checks:
```
Current User Role: Rider
Checking item: My Dashboard
Item roles: [Rider]
Is Enabled: true
```

## Benefits

1. **Security**: Users only see menu items they have access to
2. **Clean UI**: No clutter from irrelevant menu items
3. **Role Clarity**: Clear separation between different user types
4. **Maintainability**: Easy to add/remove role restrictions
5. **Flexibility**: Support for multiple roles per item

## Common Patterns

### Pattern 1: Role-Specific Group
```typescript
{
  id: 'rider-section',
  title: 'Rider Portal',
  type: 'group',
  role: [Role.Rider],
  children: [/* all children inherit Rider role */]
}
```

### Pattern 2: Mixed Permissions
```typescript
{
  id: 'reports',
  title: 'Reports',
  type: 'group',
  role: [Role.Admin, Role.Club],  // Both can see group
  children: [
    {
      id: 'all-reports',
      title: 'All Reports',
      type: 'item',
      role: [Role.Admin]  // Only Admin sees this
    },
    {
      id: 'club-reports',
      title: 'Club Reports',
      type: 'item',
      role: [Role.Club]  // Only Club sees this
    }
  ]
}
```

### Pattern 3: Public Items
```typescript
{
  id: 'help',
  title: 'Help',
  type: 'item',
  url: '/help'
  // No role specified - visible to all authenticated users
}
```

## Troubleshooting

### Issue: All menu items visible regardless of role
**Solution**: Check that navigation items have `role` property defined

### Issue: No menu items visible
**Solution**: 
- Verify user is logged in
- Check `currentUserValue` has valid role
- Ensure navigation items include user's role

### Issue: Menu items show but are disabled
**Solution**: This shouldn't happen anymore - items are now hidden, not disabled

### Issue: Child items not inheriting parent role
**Solution**: Verify `parentRole` is being passed correctly in templates

## Future Enhancements

Potential improvements:
- Add permission-based navigation (beyond just roles)
- Add dynamic menu loading based on user permissions from API
- Add menu item badges for role-specific features
- Add role-based menu customization in admin panel

---

**Implementation Date**: 2026-03-17
**Status**: ✅ Complete and Ready for Testing

