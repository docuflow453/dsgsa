import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../models/user.model';

/**
 * Public Guard - Redirects authenticated users away from public-only pages (like login)
 * Usage: canActivate: [publicGuard]
 */
export const publicGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated) {
    return true;
  }

  // User is authenticated, redirect to appropriate dashboard based on role
  const user = authService.currentUserValue;
  
  if (!user) {
    return true;
  }

  // Redirect based on primary role (highest priority first)
  if (user.roles.includes(UserRole.ADMIN)) {
    router.navigate(['/dashboard/default']);
  } else if (user.roles.includes(UserRole.SAEF)) {
    router.navigate(['/dashboard/default']);
  } else if (user.roles.includes(UserRole.PROVINCIAL)) {
    router.navigate(['/dashboard/default']);
  } else if (user.roles.includes(UserRole.CLUB)) {
    router.navigate(['/dashboard/default']);
  } else if (user.roles.includes(UserRole.OFFICIAL)) {
    router.navigate(['/dashboard/default']);
  } else if (user.roles.includes(UserRole.RIDER)) {
    router.navigate(['/my/dashboard']);
  } else {
    router.navigate(['/dashboard/default']);
  }

  return false;
};

