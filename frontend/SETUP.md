# DSRiding Frontend - Setup Guide

## Quick Start

### Prerequisites
- Node.js 18+ and npm
- Django backend running on `http://localhost:8000`

### Installation Steps

1. **Navigate to the frontend directory:**
```bash
cd frontend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Start the development server:**
```bash
npm start
```

4. **Open your browser:**
Navigate to `http://localhost:4200`

## Project Overview

This Angular 21 application provides a modern, responsive frontend for the DSRiding Dressage Competition Management System. The UI is styled to match the provided screenshots with a clean, document-management inspired design.

## Key Features Implemented

### ✅ Authentication System
- Login page with email/password authentication
- Registration page with form validation
- JWT token-based authentication
- Auth guard protecting routes
- HTTP interceptor for automatic token injection
- User session management with localStorage

### ✅ Layout & Navigation
- **Sidebar Navigation**: Fixed sidebar with role-based menu items
- **Header**: Search bar, upload button, user menu with dropdown
- **Responsive Layout**: Mobile-friendly design
- **Consistent Styling**: Purple gradient theme matching screenshots

### ✅ Dashboard
- Welcome banner with user greeting
- Upgrade promotion banner
- Document overview cards (All Documents, Favourites, Missing, Expired)
- Reminders section
- My Pockets section with tags

### ✅ Document Management
- Tabbed interface (Documents, Favourites, Missing, Expired, etc.)
- Search and filter functionality
- Upload modal with drag-and-drop support
- Document table with pagination
- Empty state messaging

### ✅ Module Structure
All feature modules are set up with lazy loading:
- **Rider Module**: Profile, horses, entries, documents
- **Horse Module**: List, detail, registration form
- **Competition Module**: List, detail, entry form
- **Admin Module**: Dashboard, users, competitions
- **Club Module**: Dashboard and member management
- **Checkout Module**: Payment processing

### ✅ API Integration
Complete service layer for backend communication:
- `AuthService` - User authentication
- `HorseService` - Horse CRUD operations
- `CompetitionService` - Competition management
- `EntryService` - Entry and transaction handling

## File Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── core/                      # Core functionality
│   │   │   ├── guards/                # Route guards
│   │   │   ├── interceptors/          # HTTP interceptors
│   │   │   ├── models/                # TypeScript models
│   │   │   └── services/              # API services
│   │   ├── shared/                    # Shared components
│   │   │   └── components/
│   │   │       ├── layout/            # Main layout wrapper
│   │   │       ├── sidebar/           # Navigation sidebar
│   │   │       └── header/            # Top header
│   │   ├── features/                  # Feature modules
│   │   │   ├── auth/                  # Authentication
│   │   │   ├── dashboard/             # Main dashboard
│   │   │   ├── rider/                 # Rider features
│   │   │   ├── horses/                # Horse management
│   │   │   ├── competitions/          # Competitions
│   │   │   ├── admin/                 # Admin panel
│   │   │   ├── clubs/                 # Club management
│   │   │   └── checkout/              # Checkout
│   │   ├── app.config.ts              # App configuration
│   │   ├── app.routes.ts              # Main routes
│   │   └── app.component.ts           # Root component
│   ├── environments/                  # Environment configs
│   ├── styles.scss                    # Global styles
│   └── index.html                     # HTML entry point
├── angular.json                       # Angular CLI config
├── package.json                       # Dependencies
├── tsconfig.json                      # TypeScript config
└── README.md                          # Documentation
```

## Design System

### Color Palette
- **Primary**: `#6366f1` (Indigo)
- **Secondary**: `#8b5cf6` (Purple)
- **Success**: `#10b981` (Green)
- **Warning**: `#f59e0b` (Amber)
- **Danger**: `#ef4444` (Red)
- **Background**: `#f9fafb` (Light gray)

### Typography
- Font Family: Inter, system fonts
- Base Size: 14px
- Headings: Bold, larger sizes

### Components
- **Cards**: Rounded corners (12px), subtle shadows
- **Buttons**: Rounded (8px), gradient on primary
- **Forms**: Clean inputs with focus states
- **Tables**: Striped, hover effects

## Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run unit tests
- `npm run watch` - Build and watch for changes

## Environment Configuration

### Development (`src/environments/environment.ts`)
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8000/api'
};
```

### Production (`src/environments/environment.prod.ts`)
```typescript
export const environment = {
  production: true,
  apiUrl: '/api'
};
```

## Next Steps

1. **Install dependencies**: Run `npm install`
2. **Start backend**: Ensure Django is running on port 8000
3. **Start frontend**: Run `npm start`
4. **Test authentication**: Try logging in or registering
5. **Explore features**: Navigate through different modules

## Troubleshooting

### Port already in use
If port 4200 is busy, Angular will prompt to use another port.

### API connection errors
- Verify Django backend is running
- Check CORS settings in Django
- Confirm API URL in environment files

### Module not found errors
- Run `npm install` to ensure all dependencies are installed
- Clear node_modules and reinstall if needed

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Additional Resources

- [Angular Documentation](https://angular.io/docs)
- [Bootstrap Documentation](https://getbootstrap.com/docs/5.3/)
- [ng-bootstrap](https://ng-bootstrap.github.io/)

