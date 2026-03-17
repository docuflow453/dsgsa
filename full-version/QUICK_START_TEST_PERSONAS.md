# Quick Start: Test Personas

## 🚀 How to Use Test Personas

### Step 1: Start the Application
```bash
npm start
```

### Step 2: Navigate to Login Page
Open your browser to `http://localhost:4200/login`

### Step 3: Select a Role
Click on any role tab at the top of the login form:
- **Admin** - Full system access
- **SHB** - Show Holding Body manager
- **Club** - Club administrator
- **Province** - Provincial coordinator
- **Rider** - Regular rider account

### Step 4: Login
Use any valid credentials from your database (e.g., `admin@gmail.com` / `Admin@123`)

### Step 5: Enjoy!
You'll be logged in as the test persona for that role and redirected to the appropriate dashboard.

## 📋 Available Test Personas

### Admin - Sarah Mitchell
- **Email**: admin@shyft.com
- **Dashboard**: `/dashboard/default`
- **Use Case**: Testing admin features, user management, system settings

### Show Holding Body - Michael Thompson
- **Email**: shb.manager@byteorbit.com
- **Dashboard**: `/shb/dashboard`
- **Use Case**: Testing competition management, show organization

### Club - Jennifer Parker
- **Email**: club.admin@shyft.com
- **Dashboard**: `/clubs/dashboard`
- **Use Case**: Testing club management, member registration

### Provincial - David Anderson
- **Email**: provincial.coordinator@byteorbit.com
- **Dashboard**: `/provincial/dashboard`
- **Use Case**: Testing provincial oversight, regional management

### Rider - Emma Williams
- **Email**: rider@shyft.com
- **Dashboard**: `/my/dashboard`
- **Use Case**: Testing rider features, competition entries, results

### SAEF - Robert Johnson
- **Email**: saef.official@byteorbit.com
- **Dashboard**: `/saef/dashboard`
- **Use Case**: Testing SAEF official features, membership management

### Official - Lisa Martinez
- **Email**: official@shyft.com
- **Dashboard**: `/official/dashboard`
- **Use Case**: Testing judging features, scoring, results

## 🔍 How to Verify It's Working

### Check Console Logs
Open browser DevTools (F12) and look for:
```
🎭 Using test persona for role: Admin
✅ Login successful, user: { ... }
📍 User role: Admin
🚀 Navigating to: /dashboard/default
```

### Check LocalStorage
In DevTools > Application > Local Storage, look for `currentUser`:
```json
{
  "id": "admin-001",
  "email": "admin@shyft.com",
  "serviceToken": "eyJhbGc...",
  "user": {
    "id": "admin-001",
    "email": "admin@shyft.com",
    "firstName": "Sarah",
    "lastName": "Mitchell",
    "name": "Sarah Mitchell",
    "role": "Admin"
  }
}
```

### Check User Display
Look for the persona name in the UI (e.g., "Sarah Mitchell" instead of your actual user name)

## 🎯 Common Use Cases

### Testing Role-Based Features
```
1. Select "Admin" role
2. Login
3. Test admin-only features
4. Logout
5. Select "Rider" role
6. Login
7. Verify rider features work correctly
```

### Demo Preparation
```
1. Select appropriate role for demo
2. Login
3. Navigate to features you want to demonstrate
4. Persona provides realistic context
```

### Development Workflow
```
1. Working on rider dashboard
2. Select "Rider" role
3. Login once
4. Develop and test features
5. Page reloads maintain persona session
```

## ⚠️ Important Notes

### Real Authentication Required
- You still need valid credentials in the database
- The API call is real and returns a valid token
- Only the user data is replaced with the persona

### Token Expiration
- Tokens expire normally (based on backend settings)
- When token expires, you'll need to login again
- Select the same role to continue testing

### Logout Behavior
- Logout clears the persona from localStorage
- Next login can use a different role
- No data persists between sessions

## 🐛 Troubleshooting

### Problem: Wrong dashboard after login
**Solution**: 
- Check that role tabs match Role enum values
- Verify `getRoleDashboardPath()` has correct mappings

### Problem: Persona not showing in UI
**Solution**:
- Check console for persona logs
- Verify `currentUserSignal` is updated
- Check component is reading from `authService.currentUserValue`

### Problem: Session not persisting on reload
**Solution**:
- Check localStorage has `user` object
- Verify constructor restores persona correctly
- Clear localStorage and login again

### Problem: API errors after login
**Solution**:
- Token is valid, check backend is running
- Verify API endpoints are accessible
- Check network tab for failed requests

## 💡 Tips & Tricks

### Quick Role Switching
1. Logout
2. Select different role
3. Login with same credentials
4. Instantly test different role

### Consistent Testing
- Use the same credentials for all roles
- Personas provide consistent test data
- Easy to reproduce issues

### Demo Mode
- Select role before demo starts
- Persona provides professional appearance
- No need to remember multiple accounts

## 🔧 For Developers

### Adding New Personas
Edit `authentication.service.ts`:
```typescript
private readonly testPersonas: Record<Role, Omit<User['user'], 'password'>> = {
  [Role.NewRole]: {
    id: 'newrole-001',
    email: 'newrole@shyft.com',
    firstName: 'First',
    lastName: 'Last',
    name: 'First Last',
    role: Role.NewRole
  }
}
```

### Disabling Test Personas
In `auth-login.component.ts`, remove the `selectedRoleEnum` parameter:
```typescript
// Before (with personas)
this.authenticationService.login(email, password, selectedRoleEnum)

// After (without personas)
this.authenticationService.login(email, password)
```

### Environment-Based Toggle
Add to `environment.ts`:
```typescript
export const environment = {
  useTestPersonas: true // Set to false in production
};
```

Then in login component:
```typescript
const role = environment.useTestPersonas ? selectedRoleEnum : undefined;
this.authenticationService.login(email, password, role)
```

---

**Happy Testing! 🎉**

