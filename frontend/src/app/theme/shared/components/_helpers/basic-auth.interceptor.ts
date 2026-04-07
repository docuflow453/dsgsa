import {inject, Injectable} from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import {StorageService} from "../../../../core";

@Injectable()
export class BasicAuthInterceptor implements HttpInterceptor {
  /**
   * Intercepts HTTP requests to add JWT token in Authorization header
   *
   * NOTE: We read the token directly from localStorage to avoid circular dependency.
   * The AuthenticationService uses HttpClient, which requires this interceptor,
   * so injecting AuthenticationService here would create a circular dependency.
   */
  intercept(request: HttpRequest<string>, next: HttpHandler): Observable<HttpEvent<string>> {
    // Add auth header with JWT token if user is logged in and request is to the api url
    // Get token directly from localStorage to avoid circular dependency with AuthenticationService
  const storage = inject(StorageService);
  const token = storage.getToken();
  const isApiUrl = request.url.startsWith(environment.apiUrl);

    console.log('BasicAuthInterceptor')
    console.log('Token:', token)
    console.log('isApiUrl:', isApiUrl)
    if (token && isApiUrl) {
      console.log('Adding token ....')
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }
    console.log('Token added')
    console.log(request)

    return next.handle(request);
  }

  /**
   * Gets the serviceToken from localStorage
   * This method mirrors the logic in AuthenticationService.getToken()
   * but is kept here to avoid circular dependency
   */
  private getTokenFromStorage(): string | null {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        return userData.serviceToken || null;
      } catch {
        return null;
      }
    }
    return null;
  }
}
