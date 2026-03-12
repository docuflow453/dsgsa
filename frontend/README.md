# DSRiding Frontend - Angular Application

This is the Angular frontend for the DSRiding Dressage Competition Management System.

## Tech Stack

- **Angular 21** - Latest Angular framework
- **Bootstrap 5** - UI framework
- **ng-bootstrap 20** - Angular Bootstrap components
- **TypeScript** - Type-safe development
- **SCSS** - Styling
- **RxJS** - Reactive programming

## Project Structure

```
src/
├── app/
│   ├── core/                    # Core services, models, guards, interceptors
│   │   ├── guards/              # Route guards (auth.guard.ts)
│   │   ├── interceptors/        # HTTP interceptors (auth.interceptor.ts)
│   │   ├── models/              # TypeScript interfaces and models
│   │   └── services/            # Core services (auth, API services)
│   ├── shared/                  # Shared components and utilities
│   │   └── components/          # Reusable components (layout, sidebar, header)
│   ├── features/                # Feature modules
│   │   ├── auth/                # Authentication (login, register)
│   │   ├── dashboard/           # Main dashboard
│   │   ├── rider/               # Rider management
│   │   ├── horses/              # Horse management
│   │   ├── competitions/        # Competition management
│   │   ├── admin/               # Admin panel
│   │   ├── clubs/               # Club management
│   │   └── checkout/            # Payment checkout
│   ├── app.config.ts            # Application configuration
│   ├── app.routes.ts            # Main routing configuration
│   └── app.component.ts         # Root component
├── environments/                # Environment configurations
├── styles.scss                  # Global styles
└── index.html                   # Main HTML file
```

## Features

### Authentication
- Login with email and password
- User registration
- JWT token-based authentication
- Auth guard for protected routes
- HTTP interceptor for adding auth tokens

### Dashboard
- Document overview with statistics
- Reminders section
- Pockets management
- Upgrade banner

### Rider Module
- Profile management
- Horse management
- Competition entries
- Document management with upload modal

### Competition Module
- Browse competitions
- View competition details
- Enter competitions
- View riding orders

### Admin Module
- User management
- Competition management
- System administration

## Installation

1. Install dependencies:
```bash
cd frontend
npm install
```

## Development

Run the development server:
```bash
npm start
```

Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Build

Build the project for production:
```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## API Integration

The frontend connects to the Django backend API at:
- Development: `http://localhost:8000/api`
- Production: `/api`

Configure the API URL in `src/environments/environment.ts`

## Key Components

### Layout Components
- **SidebarComponent**: Navigation sidebar with role-based menu items
- **HeaderComponent**: Top header with search, upload, and user menu
- **LayoutComponent**: Main layout wrapper

### Authentication
- **LoginComponent**: User login form
- **RegisterComponent**: User registration form
- **AuthService**: Handles authentication logic
- **AuthGuard**: Protects routes requiring authentication

### Services
- **AuthService**: Authentication and user management
- **HorseService**: Horse CRUD operations
- **CompetitionService**: Competition management
- **EntryService**: Entry and transaction management

## Styling

The application uses a custom design system based on the provided screenshots:
- Purple gradient primary colors (#6366f1, #8b5cf6)
- Clean, modern card-based UI
- Responsive design with Bootstrap grid
- Custom SCSS variables for consistent theming

## Routes

- `/auth/login` - Login page
- `/auth/register` - Registration page
- `/dashboard` - Main dashboard
- `/my/*` - Rider-specific routes
- `/horses/*` - Horse management
- `/competitions/*` - Competition browsing and entry
- `/admin/*` - Admin panel
- `/clubs/*` - Club management
- `/checkout` - Payment checkout

## Next Steps

1. Install dependencies: `npm install`
2. Start the development server: `npm start`
3. Ensure Django backend is running on port 8000
4. Navigate to `http://localhost:4200`
5. Login or register a new account

## Notes

- All routes except `/auth/*` are protected by authentication guard
- The application uses standalone components (Angular 21 feature)
- Lazy loading is implemented for all feature modules
- HTTP interceptor automatically adds auth token to requests

