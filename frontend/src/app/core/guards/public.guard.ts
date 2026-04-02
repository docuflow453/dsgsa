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
  console.log('Public Guard');
  // Redirect based on primary role (highest priority first)
  if (user.roles.includes(UserRole.ADMIN)) {
    router.navigate(['/admin/dashboard']);
  } else if (user.roles.includes(UserRole.SAEF)) {
    router.navigate(['/saef/dashboard']);
  } else if (user.roles.includes(UserRole.PROVINCIAL)) {
    router.navigate(['/provincial/dashboard']);
  } else if (user.roles.includes(UserRole.CLUB)) {
    router.navigate(['/clubs/dashboard']);
  } else if (user.roles.includes(UserRole.SHOW_HOLDING_BODY)) {
    router.navigate(['/shb/dashboard']);
  } else if (user.roles.includes(UserRole.RIDER)) {
    router.navigate(['/my/dashboard']);
  } else {
    router.navigate(['/']);
  }

  return false;
};

