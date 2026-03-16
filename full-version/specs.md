# South African Dressage System - Frontend Initial Setup Specification

## Project Overview
A responsive, role-aware web application for the South African Dressage System built with Angular, Bootstrap 5, and ng-bootstrap.

## Technology Stack
- **Framework**: Angular (Latest LTS version)
- **CSS Framework**: Bootstrap 5
- **UI Components**: ng-bootstrap
- **State Management**: (To be determined - suggest NgRx or Angular services)
- **Authentication**: JWT-based authentication

## Project Structure

```
src/
├── app/
│   ├── core/                      # Core module (singleton services, guards, interceptors)
│   │   ├── guards/                 # Route guards for role-based access
│   │   ├── interceptors/           # HTTP interceptors
│   │   ├── services/               # Core services (auth, etc.)
│   │   └── core.module.ts
│   │
│   ├── shared/                     # Shared module (reusable components, directives, pipes)
│   │   ├── components/              # Shared components
│   │   ├── directives/              # Custom directives
│   │   ├── pipes/                   # Custom pipes
│   │   ├── models/                  # Interfaces and types
│   │   └── shared.module.ts
│   │
│   ├── features/                    # Feature modules (lazy-loaded)
│   │   ├── public/                  # Public visitor section
│   │   │   ├── pages/
│   │   │   ├── components/
│   │   │   └── public.module.ts
│   │   │
│   │   ├── rider/                   # Rider section
│   │   │   ├── pages/
│   │   │   ├── components/
│   │   │   ├── services/
│   │   │   └── rider.module.ts
│   │   │
│   │   ├── club/                    # Club section
│   │   │   ├── pages/
│   │   │   ├── components/
│   │   │   ├── services/
│   │   │   └── club.module.ts
│   │   │
│   │   ├── provincial/              # Provincial section
│   │   │   ├── pages/
│   │   │   ├── components/
│   │   │   ├── services/
│   │   │   └── provincial.module.ts
│   │   │
│   │   ├── saef/                    # SAEF section
│   │   │   ├── pages/
│   │   │   ├── components/
│   │   │   ├── services/
│   │   │   └── saef.module.ts
│   │   │
│   │   ├── official/                # Show holding bodies/officials section
│   │   │   ├── pages/
│   │   │   ├── components/
│   │   │   ├── services/
│   │   │   └── official.module.ts
│   │   │
│   │   └── admin/                    # Administrator section
│   │       ├── pages/
│   │       ├── components/
│   │       ├── services/
│   │       └── admin.module.ts
│   │
│   ├── layouts/                      # Layout components
│   │   ├── public-layout/
│   │   │   ├── public-layout.component.ts
│   │   │   ├── public-layout.component.html
│   │   │   └── public-layout.component.scss
│   │   │
│   │   ├── rider-layout/
│   │   │   ├── rider-layout.component.ts
│   │   │   ├── rider-layout.component.html
│   │   │   ├── rider-layout.component.scss
│   │   │   └── rider-sidebar/
│   │   │
│   │   ├── full-layout/               # For all admin-level roles
│   │   │   ├── full-layout.component.ts
│   │   │   ├── full-layout.component.html
│   │   │   └── full-layout.component.scss
│   │   │
│   │   └── layouts.module.ts
│   │
│   ├── app-routing.module.ts
│   ├── app.component.ts
│   └── app.module.ts
│
├── assets/
│   ├── images/
│   ├── styles/
│   │   └── _variables.scss           # Bootstrap variable overrides
│   └── i18n/                          # If internationalization is needed
│
├── environments/
│   ├── environment.ts
│   └── environment.prod.ts
│
└── index.html
```

## Layout Specifications

### 1. Public Visitors Layout
- Simple, welcoming layout
- Navigation: Main public pages (Home, About, Events, News, Contact)
- Footer with social links and contact information
- Login/Register buttons in header
- Responsive design with mobile-friendly navigation

### 2. Rider Layout
- Extends public layout with additional rider-specific elements
- **Top Navigation**: Includes public pages + "My Dashboard" link
- **Sidebar Menu** (collapsible):
    - My Profile
    - My Horses
    - Competition Schedule
    - My Entries
    - Results History
    - Rankings
    - Documents
    - Messages/Notifications
- Main content area for selected feature

### 3. Full Page Layout (Clubs, Provincial, SAEF, Admin, Officials)
- Comprehensive dashboard-style layout
- **Top Navigation**:
    - Organization name/logo
    - User menu with profile, settings, logout
    - Notifications
    - Quick actions
- **Sidebar Navigation** (collapsible, role-specific menus):
    - Dashboard
    - Members/Users Management
    - Events Management
    - Results Management
    - Reports
    - Settings
    - (Additional role-specific menu items)
- **Content Area**: Full-width with card-based layouts
- **Footer**: System information and support links

## Role-Based Access Control

### User Roles and Permissions
1. **Public** (Unauthenticated)
    - View public content only

2. **Rider**
    - Personal profile management
    - Horse management
    - Competition entries
    - View own results and rankings

3. **Club**
    - Club management
    - Member management
    - Event organization
    - Local results management

4. **Provincial**
    - Provincial oversight
    - Competition approvals
    - Provincial rankings
    - Reports generation

5. **SAEF** (South African Equestrian Federation)
    - National oversight
    - Rule management
    - National rankings
    - System-wide reports

6. **Administrator**
    - Full system access
    - User management
    - Role assignments
    - System configuration

7. **Officials** (Show holding bodies)
    - Event management
    - Results entry
    - Scoring management
    - Participant verification

## Feature Modules Specifications

### Public Module
- Home page with hero section
- About SA Dressage
- Events calendar (public view)
- News and announcements
- Gallery
- Contact form
- Membership information
- Rules and regulations (public)

### Rider Module
- Dashboard with upcoming events
- Profile management
- Horse registration and management
- Competition entries
- Entry history
- Results and certificates
- Personal rankings
- Document repository
- Payment history/invoices

### Club Module
- Club dashboard
- Member roster management
- Event creation and management
- Results submission
- Club rankings
- Financial management (if applicable)
- Communication tools
- Document management

### Provincial Module
- Provincial dashboard
- Clubs oversight
- Competition approvals
- Provincial team management
- Provincial rankings
- Reports and analytics
- Budget management

### SAEF Module
- National dashboard
- National rankings
- Rule management
- Calendar management
- Competition sanctions
- National team management
- System-wide reporting
- Financial oversight

### Official Module
- Event dashboard
- Schedule management
- Participant check-in
- Scoring interface
- Result verification
- Certificate generation
- Communication with participants

### Admin Module
- System dashboard
- User management (CRUD)
- Role management
- Audit logs
- System settings
- Backup management
- Email template management
- Content management

## Technical Specifications

### Authentication & Authorization
- JWT token-based authentication
- Route guards for each role
- Permission-based directive for UI elements
- Automatic token refresh
- Session management

### State Management
- Centralized state using services or NgRx
- User session state
- Application settings
- Cache management

### API Integration
- RESTful API services
- Error handling interceptors
- Loading state management
- Request/response transformation

### Styling
- Bootstrap 5 with custom theming
- SA Dressage branding colors
- Responsive breakpoints
- Dark mode support (optional)
- Accessibility compliance

### Routing Structure
```typescript
const routes: Routes = [
  { path: '', loadChildren: () => import('./features/public/public.module').then(m => m.PublicModule) },
  { 
    path: 'rider', 
    canActivate: [RoleGuard], 
    data: { roles: ['RIDER'] },
    loadChildren: () => import('./features/rider/rider.module').then(m => m.RiderModule)
  },
  // Similar patterns for other roles
];
```

## Initial Setup Tasks

1. **Angular Project Creation**
   ```bash
   ng new sa-dressage-frontend --style=scss --routing
   ```

2. **Dependencies Installation**
   ```bash
   npm install bootstrap @popperjs/core
   npm install @ng-bootstrap/ng-bootstrap
   ```

3. **Bootstrap Configuration**
    - Add Bootstrap CSS to angular.json
    - Configure ng-bootstrap
    - Create custom theme variables

4. **Core Module Setup**
    - Authentication service
    - HTTP interceptors
    - Route guards
    - Error handling

5. **Layout Components**
    - Create base layout components
    - Implement responsive navigation
    - Add sidebar components

6. **Feature Modules Generation**
    - Generate all feature modules with routing
    - Set up lazy loading
    - Create placeholder components

7. **Authentication Flow**
    - Login component
    - Registration flow
    - Password reset
    - Profile management

## Development Priorities

### Phase 1: Foundation
- Project setup and configuration
- Authentication system
- Layout components
- Routing and guards
- Public module basics

### Phase 2: Core Features
- Rider module essentials
- Basic CRUD operations
- Form implementations
- Data tables with ng-bootstrap

### Phase 3: Role-Specific Features
- Club module
- Official module
- Advanced features per role

### Phase 4: Administrative Features
- Admin module
- Reporting
- System configuration
- Audit logging

### Phase 5: Polish and Optimization
- Performance optimization
- Accessibility improvements
- Testing
- Documentation

## Quality Standards
- Unit tests for critical components
- E2E tests for main user flows
- Code documentation
- Accessibility compliance (WCAG 2.1)
- Responsive design validation
- Cross-browser compatibility

This specification provides a comprehensive foundation for building the South African Dressage System frontend with Angular, Bootstrap 5, and ng-bootstrap. The modular structure ensures maintainability and scalability while the role-based approach ensures appropriate access control for all user types.