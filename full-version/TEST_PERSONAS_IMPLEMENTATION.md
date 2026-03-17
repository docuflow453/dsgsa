# Test Personas Implementation

## Overview

The authentication system has been enhanced to support **hardcoded test personas** for development and demo purposes. This allows testing different role-based dashboards without needing multiple real user accounts in the database.

## How It Works

### 1. **Login Flow**

When a user logs in:
1. The login component sends the selected role to the authentication service
2. The API is called with the actual credentials to get a valid `serviceToken`
3. After successful authentication, the **real user data is replaced** with a hardcoded persona matching the selected role
4. The persona data (with the real token) is stored in localStorage
5. The user is redirected to the appropriate role-based dashboard

### 2. **Test Personas**

The following test personas are available:

| Role | Name | Email | ID |
|------|------|-------|-----|
| **Admin** | Sarah Mitchell | admin@shyft.com | admin-001 |
| **Show Holding Body** | Michael Thompson | shb.manager@byteorbit.com | shb-001 |
| **Club** | Jennifer Parker | club.admin@shyft.com | club-001 |
| **Provincial** | David Anderson | provincial.coordinator@byteorbit.com | province-001 |
| **Rider** | Emma Williams | rider@shyft.com | rider-001 |
| **SAEF** | Robert Johnson | saef.official@byteorbit.com | saef-001 |
| **Official** | Lisa Martinez | official@shyft.com | official-001 |
| **User** | John Doe | user@shyft.com | user-001 |

### 3. **Key Features**

✅ **Real Authentication** - Uses actual API authentication to get valid tokens
✅ **Role Switching** - Easily test different roles without multiple accounts
✅ **Realistic Data** - Each persona has realistic names and email addresses
✅ **Persistent Sessions** - Test personas are restored from localStorage on page reload
✅ **Dashboard Routing** - Automatically redirects to role-specific dashboards

## Files Modified

### 1. `authentication.service.ts`

**Changes:**
- Added `testPersonas` object with hardcoded persona data for each role
- Updated `login()` method to accept optional `selectedRole` parameter
- Modified login logic to replace API user data with test persona when role is provided
- Updated constructor to restore test personas from localStorage
- Added console logging to distinguish between test personas and real users

**Key Methods:**
```typescript
login(email: string, password: string, selectedRole?: Role)
```

### 2. `auth-login.component.ts`

**Changes:**
- Updated `onSubmit()` method to pass `selectedRole` to authentication service
- Added better console logging for debugging
- Converts selected role string to Role enum before passing to service

**Key Code:**
```typescript
const selectedRoleEnum = this.selectedRole.role as Role;
this.authenticationService.login(email, password, selectedRoleEnum)
```

## Usage

### For Development/Demo

1. **Select a Role** - Click on any role tab (Admin, SHB, Club, etc.)
2. **Login** - Use any valid credentials from the database
3. **Result** - You'll be logged in as the test persona for that role

### For Production

Simply don't pass the `selectedRole` parameter, and the system will use the actual user data from the API:

```typescript
this.authenticationService.login(email, password) // No role = real user data
```

## Console Output

The system provides helpful console messages:

- `🎭 Using test persona for role: Admin` - When using a test persona
- `✅ Using actual user data from API` - When using real user data
- `🎭 Restored test persona from localStorage` - When restoring a persona on page reload

## Benefits

1. **Faster Testing** - No need to create multiple user accounts
2. **Role Isolation** - Test each role independently
3. **Demo Ready** - Perfect for demonstrations and presentations
4. **Development Speed** - Quickly switch between roles during development
5. **Realistic Data** - Uses professional names and email addresses

## Security Considerations

⚠️ **Important**: This feature should only be used in development/demo environments.

For production:
- Remove or disable the test persona feature
- Use actual user authentication only
- Implement proper role-based access control on the backend

## Example Scenarios

### Scenario 1: Testing Admin Dashboard
```
1. Select "Admin" role
2. Login with any valid credentials
3. System uses "Sarah Mitchell" persona
4. Redirects to /dashboard/default
```

### Scenario 2: Testing Rider Dashboard
```
1. Select "Rider" role
2. Login with any valid credentials
3. System uses "Emma Williams" persona
4. Redirects to /my/dashboard
```

### Scenario 3: Real User Login
```
1. Don't modify the login component
2. Login with real credentials
3. System uses actual user data from API
4. Redirects based on user's actual role
```

## Future Enhancements

Potential improvements:
- Add more detailed persona data (addresses, phone numbers, etc.)
- Create persona profiles with different permission levels
- Add UI toggle to enable/disable test personas
- Store persona preferences in environment configuration
- Add persona management interface for admins

## Troubleshooting

### Issue: Wrong dashboard after login
**Solution**: Check that the role in `selectedRole.role` matches the Role enum values

### Issue: Token expired errors
**Solution**: The token is real from the API, so normal token expiration applies

### Issue: Persona not persisting
**Solution**: Check localStorage for `currentUser` object with `user` property

## Testing Checklist

- [ ] Test each role persona (Admin, SHB, Club, Provincial, Rider, SAEF, Official, User)
- [ ] Verify correct dashboard routing for each role
- [ ] Test page reload with active persona session
- [ ] Verify logout clears persona data
- [ ] Test switching between different role personas
- [ ] Verify real user login still works (without selectedRole)

---

**Implementation Date**: 2026-03-17
**Status**: ✅ Complete and Ready for Testing

