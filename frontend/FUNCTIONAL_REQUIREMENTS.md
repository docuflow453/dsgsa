# South African Dressage Angular Frontend Functional Requirements

## 1. Document Purpose

This document describes the functional requirements, architectural conventions, module responsibilities, setup expectations, and design-system standards for the South African Dressage Angular frontend application in `frontend/`.

The application is a standalone Angular frontend for the South African dressage ecosystem and integrates with a Django REST API for authentication, rider data, horse records, competition data, entries, and payments.

## 2. Project Overview

### 2.1 Product Goal

The frontend shall provide a responsive, role-aware web application that supports the following user groups:

- Public visitors
- Riders
- Clubs
- Administrators
- Show holding bodies / officials (modelled in user roles even where UI is still scaffolded)

The system shall allow users to discover competitions, manage horse and rider records, submit entries, complete checkout, and access results and account data.

### 2.2 Technology Stack

| Area | Requirement | Evidence |
|---|---|---|
| Framework | Angular 21 | `frontend/package.json` |
| UI framework | Bootstrap 5.3 and Bootstrap Icons | `frontend/package.json`, `frontend/angular.json` |
| Angular UI helpers | ng-bootstrap 20 | `frontend/package.json` |
| Language | TypeScript 5.9 | `frontend/package.json` |
| Styling | SCSS with global + component-level styles | `frontend/angular.json`, `frontend/src/styles.scss` |
| Charts | `chart.js` and `ng2-charts` available | `frontend/package.json` |

### 2.3 Architecture Pattern

The frontend shall follow a standalone-component Angular architecture rather than traditional NgModules.

Key architectural requirements:

- The app shall bootstrap through `bootstrapApplication` in `frontend/src/main.ts`.
- Global providers shall be registered in `frontend/src/app/app.config.ts`.
- Routing shall be configured in `frontend/src/app/app.routes.ts`.
- Feature areas shall be lazy loaded using `loadChildren` for route groups and `loadComponent` for individual standalone pages.
- Shared UI shall be composed through standalone layout/navigation components under `frontend/src/app/shared/components/`.

Example top-level routing structure from `frontend/src/app/app.routes.ts`:

```ts
{
  path: 'competitions',
  loadChildren: () => import('./features/competitions/competitions.routes')
    .then(m => m.COMPETITIONS_ROUTES),
  canActivate: [authGuard]
}
```

### 2.4 Django Backend API Integration

The frontend shall integrate with the Django API via `HttpClient` using `environment.apiUrl`.

Environment sources:

- Development: `frontend/src/environments/environment.ts` → `http://localhost:8000/api`
- Production: `frontend/src/environments/environment.prod.ts` → `/api`

Integration requirements:

- Authentication requests shall be sent to `/auth/` and `/register/`.
- Authenticated requests shall attach `Authorization: Token <token>` via `frontend/src/app/core/interceptors/auth.interceptor.ts`.
- Horse data shall be loaded from `/horses/`, `/horse-search/`, `/breeds/`, `/breed-types/`, `/horse-colors/`, and `/stud-farms/`.
- Competition data shall be loaded from `/competitions/`, `/competition/<slug>/`, `/competition-dates/`, `/competition-class/`, `/competition-extras/`, `/grades/`, `/class-types/`, and `/class-rules/`.
- Entry and payment data shall be loaded from `/entries/`, `/entries-classes/`, `/transactions/`, and `/riding-orders/`.

## 3. Top-Level Application Routing

The application shall expose the following route groups from `frontend/src/app/app.routes.ts`:

| Route prefix | Feature area | Protection | Source |
|---|---|---|---|
| `/` | Public site | Public | `frontend/src/app/features/public/public.routes.ts` |
| `/auth` | Authentication | Public | `frontend/src/app/features/auth/auth.routes.ts` |
| `/dashboard` | Main dashboard | Authenticated | `frontend/src/app/features/dashboard/dashboard.routes.ts` |
| `/my` | Rider portal | Authenticated | `frontend/src/app/features/rider/rider-module.routes.ts` |
| `/rider` | Rider portal alias | Authenticated | `frontend/src/app/features/rider/rider-module.routes.ts` |
| `/horses` | Horse management | Authenticated | `frontend/src/app/features/horses/horses.routes.ts` |
| `/competitions` | Competition management | Authenticated | `frontend/src/app/features/competitions/competitions.routes.ts` |
| `/admin` | Admin panel | Authenticated | `frontend/src/app/features/admin/admin.routes.ts` |
| `/clubs` | Club management | Authenticated | `frontend/src/app/features/clubs/clubs.routes.ts` |
| `/checkout` | Checkout/payment | Authenticated | `frontend/src/app/features/checkout/checkout.routes.ts` |

## 4. Feature Modules

> Note: several requested modules are scaffolded with placeholder pages. This document distinguishes between implemented UI behavior and intended functional responsibility.

### 4.1 Authentication (`frontend/src/app/features/auth/`)

**Purpose and roles**

- Serves unauthenticated visitors who need to sign in or create an account.
- Supports all eventual user roles through a common auth flow.

**Routes**

- `/auth/login` → `frontend/src/app/features/auth/login/login.component.ts`
- `/auth/register` → `frontend/src/app/features/auth/register/register.component.ts`

**Key components**

- `LoginComponent`: reactive email/password sign-in form with validation, loading state, and API error handling.
- `RegisterComponent`: reactive registration form with first name, last name, email, password, confirm-password validation, and API error handling.

**Services and API integrations**

- `frontend/src/app/core/services/auth.service.ts`
  - `login(credentials)` → `POST /auth/`
  - `register(data)` → `POST /register/`
  - stores token and user in `localStorage`
  - updates Angular signals `currentUser` and `isAuthenticated`

**User workflows**

1. User opens `/auth/login`.
2. User enters email and password.
3. Frontend validates required fields and email format.
4. Frontend submits credentials to Django.
5. On success, token and user are stored locally and the user is redirected to `/dashboard`.
6. On failure, the UI displays the backend error or a fallback message.

Registration workflow follows the same pattern with password confirmation.

**Functional notes**

- Registration UI does not currently expose role selection even though `RegisterRequest` supports an optional `role` in `frontend/src/app/core/models/user.model.ts`.
- Forms are implemented; role-specific post-login routing is not yet implemented.

### 4.2 Dashboard (`frontend/src/app/features/dashboard/`)

**Purpose and roles**

- Serves authenticated users landing on the document-oriented dashboard shell.
- Most aligned to rider-facing usage in the current implementation.

**Routes**

- `/dashboard` → `frontend/src/app/features/dashboard/dashboard.component.ts`

**Key components**

- `DashboardComponent`: renders a welcome header, document statistic cards, reminders, and “My Pockets” summary cards.
- Wrapped by `frontend/src/app/shared/components/layout/layout.component.ts`.

**Services and API integrations**

- Uses `AuthService` for displaying the current user name.
- Does not yet call backend dashboard endpoints; the document stats and pockets are currently static component data.

**User workflows**

- View high-level document counts.
- Navigate to document-related destinations such as `/my/documents`.
- Review reminder empty state and pocket tags.

### 4.3 Rider Management (`frontend/src/app/features/rider/`)

**Purpose and roles**

- Serves riders managing their dashboard, profile, entries, horses, results, settings, and legacy document pages.

**Routes and navigation**

Modern rider portal routes in `frontend/src/app/features/rider/rider-module.routes.ts`:

- `/my/dashboard`
- `/my/entries`
- `/my/horses`
- `/my/results`
- `/my/profile`
- `/my/settings`

Aliases:

- `/rider/*` uses the same route set as `/my/*`
- `/riders/*` uses legacy routes from `frontend/src/app/features/rider/rider.routes.ts`

Legacy routes:

- `/riders/profile`
- `/riders/horses`
- `/riders/entries`
- `/riders/documents`

**Key components**

- `RiderDashboardComponent`: rider KPI cards, upcoming entries table, recent results list.
- `RiderProfileComponent`: placeholder for profile maintenance.
- `RiderHorsesComponent`: placeholder for rider-owned horse management.
- `RiderEntriesComponent`: placeholder for entry management.
- `RiderResultsComponent`: placeholder for result history.
- `RiderSettingsComponent`: placeholder for account preferences.
- `DocumentsComponent`: implemented legacy document-management view with tabs, search box, empty table state, pagination shell, and upload modal.

**Services and API integrations**

- Active today: `AuthService` in `RiderDashboardComponent` for personalised copy.
- Expected supporting services for full rider workflows:
  - `frontend/src/app/core/services/horse.service.ts`
  - `frontend/src/app/core/services/entry.service.ts`
  - `frontend/src/app/core/services/competition.service.ts`

**User workflows**

- Rider opens dashboard and reviews upcoming entries and recent results.
- Rider navigates between entries, horses, results, and profile via `frontend/src/app/shared/components/rider-navbar/`.
- Rider uses legacy document screen to switch tabs, search, and open an upload modal.

**Functional notes**

- The modern `/my/*` rider pages are mostly scaffold placeholders except the rider dashboard.
- The legacy `DocumentsComponent` is the most functionally detailed rider page in the repository today.

### 4.4 Horse Management (`frontend/src/app/features/horses/`)

**Purpose and roles**

- Allows authenticated riders to view, create, inspect, and update horse records.

**Routes**

- `/horses` → horse list
- `/horses/new` → horse registration form
- `/horses/:id` → horse detail
- `/horses/:id/edit` → horse edit form

**Key components**

- `HorseListComponent`: entry point with “Register Horse” CTA.
- `HorseDetailComponent`: placeholder for horse profile and registrations.
- `HorseFormComponent`: placeholder for add/edit horse form.

**Services and API integrations**

- `frontend/src/app/core/services/horse.service.ts`
  - list, detail, create, patch, delete
  - breed/type/colour/stud-farm lookups
  - horse search endpoint

**User workflows**

1. Rider opens `/horses`.
2. Rider selects “Register Horse”.
3. Form should capture horse identity, breeding, colour, gender, passport, and origin metadata defined by `frontend/src/app/core/models/horse.model.ts`.
4. Rider can later review details or edit an existing horse.

**Functional notes**

- Route structure and service layer exist.
- UI pages are scaffolded and not yet wired to `HorseService`.

### 4.5 Competition Management (`frontend/src/app/features/competitions/`)

**Purpose and roles**

- Allows riders to browse competitions, inspect schedules and classes, and enter events.

**Routes**

- `/competitions` → competition list
- `/competitions/:id` → competition detail
- `/competitions/:id/entry` → competition entry

**Key components**

- `CompetitionListComponent`: upcoming competitions landing page.
- `CompetitionDetailComponent`: placeholder for competition details, classes, dates, and venue data.
- `CompetitionEntryComponent`: placeholder for entry submission workflow.

**Services and API integrations**

- `frontend/src/app/core/services/competition.service.ts`
  - competitions CRUD
  - competition-by-slug lookup
  - competition dates, classes, extras
  - grade, class type, class rule lookups
  - riding-order generation action
- `frontend/src/app/core/services/entry.service.ts`
  - create/update entries
  - list entry classes, transactions, riding orders

**User workflows**

- Rider browses competitions.
- Rider opens a competition to inspect dates, classes, fees, and extras.
- Rider submits entry selections and proceeds to checkout.
- Rider later reviews riding orders and transaction status.

### 4.6 Admin Panel (`frontend/src/app/features/admin/`)

**Purpose and roles**

- Serves internal administrators for system-wide management.

**Routes**

- `/admin` → admin dashboard
- `/admin/users` → user management
- `/admin/competitions` → competition management

**Key components**

- `AdminDashboardComponent`: placeholder summary landing page.
- `UsersComponent`: placeholder for user administration.
- `AdminCompetitionsComponent`: placeholder for competition administration.

**Services and API integrations**

- No admin-specific service is currently implemented in `frontend/src/app/core/services/`.
- Existing `CompetitionService` would support competition CRUD requirements.
- Role metadata exists in `frontend/src/app/core/models/user.model.ts` for admin-like roles.

**User workflows**

- Admin signs in.
- Admin reviews platform overview.
- Admin should be able to manage users and competitions from dedicated pages.

**Functional notes**

- Admin routing exists, but role-based route protection is not yet implemented beyond generic authentication.

### 4.7 Club Management (`frontend/src/app/features/clubs/`)

**Purpose and roles**

- Serves clubs managing club-level activities, members, and competition participation.

**Routes**

- `/clubs` → club dashboard

**Key components**

- `ClubDashboardComponent`: placeholder for club overview, member administration, and club operations.

**Services and API integrations**

- No dedicated club service exists yet.
- Data contracts are defined in `frontend/src/app/core/models/club.model.ts` for `Club`, `ShowHoldingBody`, `PaymentMethod`, `Levy`, and `Extra`.

**User workflows**

- Club user signs in.
- Club user opens `/clubs`.
- Club user should review members, levies, extras, and club profile data.

### 4.8 Checkout / Payment (`frontend/src/app/features/checkout/`)

**Purpose and roles**

- Serves authenticated riders completing payment for entries and extras.

**Routes**

- `/checkout` → checkout page

**Key components**

- `CheckoutComponent`: placeholder page for payment completion.

**Services and API integrations**

- `frontend/src/app/core/services/entry.service.ts` provides transaction retrieval.
- `frontend/src/app/core/models/entry.model.ts` defines `Transaction` and `TransactionExtra` contracts.
- `frontend/src/app/core/models/club.model.ts` defines `PaymentMethod` and `Levy` supporting structures.

**User workflows**

- Rider selects competition entry options.
- Rider proceeds to checkout.
- Frontend should display payable items, totals, payment method, and payment status.

## 5. Core Module (`frontend/src/app/core/`)

The `core/` directory contains application-wide services, models, guards, and interceptors used across features.

### 5.1 Guards

**Authentication guard**

- File: `frontend/src/app/core/guards/auth.guard.ts`
- Intended role: block unauthenticated access to protected routes and redirect to `/auth/login` with `returnUrl`.

**Important implementation note**

- The current file contains an early `return true;`, which bypasses the auth check.
- Functional requirement: protected areas shall require authentication before route activation.

**Authorization guard**

- No dedicated role-based guard currently exists.
- Functional requirement: admin, club, rider, and official routes should eventually enforce role-specific access.

### 5.2 Interceptors

**Auth interceptor**

- File: `frontend/src/app/core/interceptors/auth.interceptor.ts`
- Responsibility: attach `Authorization: Token <token>` to outgoing HTTP requests when a token exists.

### 5.3 Models and Interfaces

| File | Purpose |
|---|---|
| `frontend/src/app/core/models/user.model.ts` | User, role, auth payload, login/register request contracts |
| `frontend/src/app/core/models/rider.model.ts` | Rider demographics, identity, banking, classification, SAEF membership |
| `frontend/src/app/core/models/horse.model.ts` | Horse identity, breeding, passport, colour, gender, lookup types |
| `frontend/src/app/core/models/competition.model.ts` | Competition, dates, classes, extras, grade/class metadata |
| `frontend/src/app/core/models/entry.model.ts` | Entries, entry classes, transactions, riding orders |
| `frontend/src/app/core/models/club.model.ts` | Club, show holding body, levies, extras, payment methods |

### 5.4 Services

| Service | File | Responsibility |
|---|---|---|
| `AuthService` | `frontend/src/app/core/services/auth.service.ts` | Login, registration, logout, token persistence, user signal state |
| `HorseService` | `frontend/src/app/core/services/horse.service.ts` | Horse CRUD and horse reference-data lookups |
| `CompetitionService` | `frontend/src/app/core/services/competition.service.ts` | Competition CRUD, schedule/class lookups, riding-order generation |
| `EntryService` | `frontend/src/app/core/services/entry.service.ts` | Entry CRUD, transactions, entry classes, riding orders |

**Architectural role of core services**

- Services shall centralise HTTP calls and prevent duplicate endpoint logic across feature components.
- Models shall provide strict typing for forms, templates, and API responses.
- Guards and interceptors shall enforce cross-cutting behavior before feature components render.

## 6. Shared Module (`frontend/src/app/shared/`)

Although the app uses standalone components instead of a traditional Angular `SharedModule`, the `shared/` directory acts as the reusable UI layer.

### 6.1 Reusable Layout Components

| Component | File | Responsibility |
|---|---|---|
| `LayoutComponent` | `frontend/src/app/shared/components/layout/layout.component.ts` | Admin/dashboard shell with sidebar + header + router outlet |
| `SidebarComponent` | `frontend/src/app/shared/components/sidebar/sidebar.component.ts` | Left navigation for dashboard-style pages with role-aware menu visibility |
| `HeaderComponent` | `frontend/src/app/shared/components/header/header.component.ts` | Top bar with search, upload CTA, user menu, profile/settings/logout |
| `RiderLayoutComponent` | `frontend/src/app/shared/components/rider-layout/rider-layout.component.ts` | Rider portal shell with branded background, navbar, footer |
| `RiderNavbarComponent` | `frontend/src/app/shared/components/rider-navbar/rider-navbar.component.ts` | Rider portal navigation and account menu |
| `PublicLayoutComponent` | `frontend/src/app/shared/components/public-layout/public-layout.component.ts` | Public-site shell with navbar/footer and hero background |
| `PublicNavbarComponent` | `frontend/src/app/shared/components/public-navbar/public-navbar.component.ts` | Public navigation model, dropdown/mobile menu state |
| `PublicFooterComponent` | `frontend/src/app/shared/components/public-footer/public-footer.component.ts` | Public quick links, resources, social links |

### 6.2 Common Utilities and Helpers

- `frontend/tsconfig.json` defines path aliases: `@app/*`, `@core/*`, `@shared/*`, `@environments/*`.
- `AuthService.hasRole()` and `AuthService.hasAnyRole()` are reusable role helpers.
- Component-local helpers exist for user initials, menu state, and display formatting in navbars and dashboards.

### 6.3 Shared Directives and Pipes

- No custom Angular directives or pipes were found under `frontend/src/app/shared/` or `frontend/src/app/`.
- Functional requirement: if filtering, formatting, or role-display logic becomes repeated, it should be extracted into shared standalone directives/pipes.

### 6.4 Design-System Components in Shared Use

- Sticky glassmorphism navbars
- Rounded gradient brand marks and user avatars
- Shell layouts with background image overlay
- Dropdown menus and CTA buttons
- Content containers that wrap lazy-loaded feature pages

**Implementation note**

- `frontend/src/app/shared/components/public-navbar/public-navbar.component.html` is currently empty, even though the component class and SCSS define a full public navigation model. The intended navbar behavior is present conceptually but not fully rendered in the current code.

## 7. Project Structure

### 7.1 Directory Organization

```text
frontend/
├── angular.json
├── package.json
├── Dockerfile
├── Dockerfile.prod
├── docker-compose.yml
├── src/
│   ├── app/
│   │   ├── app.component.ts
│   │   ├── app.config.ts
│   │   ├── app.routes.ts
│   │   ├── core/
│   │   ├── features/
│   │   └── shared/
│   ├── environments/
│   ├── css/
│   └── styles.scss
```

### 7.2 Module Dependencies and Relationships

- `app.routes.ts` is the top-level entry point for feature composition.
- `core/` is depended on by feature components and shared layout components.
- `shared/` provides layout wrappers used by route groups.
- `features/` contains lazy-loaded route definitions and standalone page components.
- `styles.scss` imports the base template SCSS from `frontend/src/css/style.scss` and overlays DSRiding-specific variables and brand treatment.

### 7.3 Routing and Lazy Loading Strategy

- All major feature areas are lazy loaded by route group.
- Child pages inside those groups are lazy loaded by standalone component.
- This reduces initial bundle size and keeps role-specific UI separated by route shell.

### 7.4 State Management Approach

The frontend currently uses lightweight Angular-native state rather than NgRx or another global store.

- `AuthService` uses Angular `signal()` for `currentUser` and `isAuthenticated`.
- `DocumentsComponent` uses `signal()` for upload-modal visibility and document list state.
- `PublicNavbarComponent` uses `signal()` for mobile-menu and dropdown state.
- Most other view models are component-local arrays and properties.
- Persistent auth state is stored in `localStorage`.

Functional requirement: future data-heavy modules may introduce a richer state layer, but the current architecture is intentionally service-first and local-state-oriented.

## 8. Setup and Configuration

### 8.1 Prerequisites

- Node.js 20 LTS recommended (Dockerfiles use `node:20-alpine`)
- Node.js 18+ minimum according to existing `frontend/SETUP.md`
- npm
- Django backend available at `http://localhost:8000`

### 8.2 Installation

```bash
cd frontend
npm install
```

### 8.3 Development Server

```bash
npm start
```

- Angular serves on `http://localhost:4200`
- The backend API is expected on `http://localhost:8000/api`

### 8.4 Environment Configuration

Development config in `frontend/src/environments/environment.ts`:

```ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8000/api'
};
```

Production config in `frontend/src/environments/environment.prod.ts`:

```ts
export const environment = {
  production: true,
  apiUrl: '/api'
};
```

### 8.5 Build and Deployment

```bash
npm run build
```

- Build output goes to `frontend/dist/dsriding-frontend`
- Production configuration enables output hashing and bundle budgets in `frontend/angular.json`

### 8.6 Docker Setup

**Development**

- `frontend/Dockerfile` uses Node 20 Alpine
- installs Angular CLI 21 globally
- runs `ng serve --host 0.0.0.0`

**Production**

- `frontend/Dockerfile.prod` performs a multi-stage build
- final image uses Nginx and serves `dist/dsriding-frontend/browser`

**Compose**

- `frontend/docker-compose.yml` maps port `4200:4200`
- mounts `src/` and Angular config files for hot reload
- uses polling for reliable file detection in containers

## 9. Design System

### 9.1 Color Palette and Theming

The design system is layered:

1. Base template variables from `frontend/src/css/app/_variables.scss`
2. DSRiding brand overrides from `frontend/src/styles.scss`

Primary DSRiding brand colors:

- `--primary-color: #6366f1`
- `--secondary-color: #8b5cf6`
- `--success-color: #10b981`
- `--warning-color: #f59e0b`
- `--danger-color: #ef4444`
- `--info-color: #3b82f6`
- `--light-bg: #f9fafb`

Visual theme requirements:

- The app shall use purple/indigo gradients for primary CTAs, icon surfaces, and hero accents.
- Rider and public layouts shall use dark, image-backed shells with translucent panels.
- Dashboard/admin surfaces shall remain card-based and Bootstrap-compatible.

### 9.2 Typography Standards

- Base font sizing is defined in `frontend/src/css/app/_variables.scss` with `--font-size: 14px`.
- Heading tokens range from `--h1-font-size` to `--h6-font-size`.
- Major hero titles use oversized, high-weight display text in component SCSS.
- Labels and eyebrow text commonly use uppercase letter-spacing to reinforce navigation hierarchy.

### 9.3 Component Styling Patterns

- Rounded cards and panels (`12px` to `32px` radius depending on context)
- Glassmorphism overlays using translucent backgrounds and `backdrop-filter: blur(...)`
- Gradient pills/buttons for primary actions
- Empty-state blocks with icon, message, and CTA
- Badge-based status indicators and tab counts
- Sticky nav shells with elevated shadow treatment

### 9.4 Responsive Design Breakpoints

Observed responsive rules in the repository include:

- `1100px`: public desktop menu switches to mobile menu in `frontend/src/app/shared/components/public-navbar/public-navbar.component.scss`
- `1080px`: rider navbar wraps navigation in `frontend/src/app/shared/components/rider-navbar/rider-navbar.component.scss`
- `991px`: home hero collapses to a single column in `frontend/src/app/features/public/home/home.component.scss`
- `768px`: public/rider page headers reduce spacing in `frontend/src/styles.scss`
- `640px`: compact branding/user-label treatment in public and rider navbars
- `576px`: mobile padding reductions in the home hero

### 9.5 SCSS Variable Structure

| File | Role |
|---|---|
| `frontend/src/styles.scss` | Global DSRiding overrides, custom CSS variables, shell/page styling |
| `frontend/src/css/style.scss` | Imported base admin/template stylesheet |
| `frontend/src/css/app/_variables.scss` | Root theme tokens, typography, border radius, color variables |
| `frontend/src/app/**/**.scss` | Component-scoped visual styles |

## 10. Current Implementation Maturity Summary

The repository currently shows three maturity levels:

1. **Implemented foundation**: app bootstrapping, standalone routing, auth service/interceptor, environment configuration, layouts, dashboards, and document UI shell.
2. **Scaffolded feature pages**: horses, competitions, admin, clubs, checkout, and several rider pages.
3. **Functional gaps to close**: role-based authorization, wiring placeholder pages to core services, rendering the public navbar template, and enforcing the auth guard logic.

This documentation should be used as the reference baseline for completing the South African Dressage frontend into a production-ready, role-aware Angular application.