import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { StorageService } from '../services/storage.service';

/**
 * Auth Interceptor - Adds JWT token to outgoing requests
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const storage = inject(StorageService);
  const token = storage.getToken();

  // Skip adding token for auth endpoints
  if (
      req.url.includes('/auth/login') ||
      req.url.includes('/login') ||
      req.url.includes('/register') ||
      req.url.includes('/auth/register')
  ) {
    return next(req);
  }

  // Clone request and add authorization header if token exists
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Token ${token}`  // Django Token Authentication format
      }
    });
  }

  return next(req);
};

