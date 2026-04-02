import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { map, tap, catchError, delay } from 'rxjs/operators';
import { Router } from '@angular/router';
import { StorageService } from './storage.service';
import {
  User,
  UserRole,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ChangePasswordRequest
} from '../models/user.model';
import { ApiResponse } from '../models/api-response.model';
import { environment } from '../../../environments/environment';

/**
 * Authentication Service - Handles all authentication operations
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = `${environment.apiUrl}/api/users`;
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser$: Observable<User | null>;
  private isAuthenticatedSubject: BehaviorSubject<boolean>;
  public isAuthenticated$: Observable<boolean>;

  constructor(
    private http: HttpClient,
    private router: Router,
    private storage: StorageService
  ) {
    const user = this.storage.getUser<User>();
    this.currentUserSubject = new BehaviorSubject<User | null>(user);
    this.currentUser$ = this.currentUserSubject.asObservable();
    this.isAuthenticatedSubject = new BehaviorSubject<boolean>(!!user);
    this.isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  }

  // Getters
  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  public get isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  /**
   * Login user
   */
  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API_URL}/login/`, {
      email: credentials.email,
      password: credentials.password
    }).pipe(
      tap(response => {
        // Map the API response to our User model
        const user: User = {
          id: response.user.id,
          email: response.user.email,
          firstName: response.user.firstName,
          lastName: response.user.lastName,
          roles: [this.mapRoleToUserRole(response.user.role)],
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        };

        // Store token and user data
        this.storage.setToken(response.token, credentials.rememberMe);
        this.storage.setUser(user, credentials.rememberMe);
        this.storage.setRememberMe(credentials.rememberMe || false);

        // Update subjects
        this.currentUserSubject.next(user);
        this.isAuthenticatedSubject.next(true);
      }),
      catchError(error => {
        console.error('Login error:', error);
        const errorMessage = error.error?.error || 'Login failed. Please check your credentials.';
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  /**
   * Map API role string to UserRole enum
   */
  private mapRoleToUserRole(role: string): UserRole {
    const roleMap: { [key: string]: UserRole } = {
      'Admin': UserRole.ADMIN,
      'Rider': UserRole.RIDER,
      'Club': UserRole.CLUB,
      'Provincial': UserRole.PROVINCIAL,
      'SAEF': UserRole.SAEF,
      'ShowHoldingBody': UserRole.SHOW_HOLDING_BODY,
      'Official': UserRole.ADMIN  // Map to ADMIN for now
    };
    return roleMap[role] || UserRole.RIDER;
  }

  /**
   * Register new user
   */
  register(data: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<any>(`${this.API_URL}/register/`, {
      email: data.email,
      first_name: data.firstName,
      last_name: data.surname,
      password: data.password,
      password_confirm: data.password,
      role: 'Rider'
    }).pipe(
      tap(response => {
        // Map the API response to our User model
        const user: User = {
          id: response.user.id,
          email: response.user.email,
          firstName: response.user.firstName || response.user.first_name,
          lastName: response.user.lastName || response.user.last_name,
          roles: [this.mapRoleToUserRole(response.user.role)],
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        };

        // Store token and user data
        this.storage.setToken(response.token, false);
        this.storage.setUser(user, false);

        // Update subjects
        this.currentUserSubject.next(user);
        this.isAuthenticatedSubject.next(true);
      }),
      catchError(error => {
        console.error('Registration error:', error);
        const errorMessage = error.error?.error || 'Registration failed. Please try again.';
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  /**
   * Logout user
   */
  logout(): void {
    this.storage.clearAll();
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/login']);
  }

  /**
   * Forgot password
   */
  forgotPassword(data: ForgotPasswordRequest): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.API_URL}/forgot-password`, data);
  }

  /**
   * Reset password
   */
  resetPassword(data: ResetPasswordRequest): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.API_URL}/reset-password`, data);
  }

  /**
   * Change password
   */
  changePassword(data: ChangePasswordRequest): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.API_URL}/change-password`, data);
  }

  /**
   * Verify two-factor authentication code
   */
  verifyTwoFactor(code: string): Observable<ApiResponse> {
    // TODO: Replace with actual API call
    return of({
      success: true,
      message: 'Two-factor authentication verified successfully',
      timestamp: new Date()
    }).pipe(delay(500));
  }

  /**
   * Refresh token
   */
  refreshToken(): Observable<any> {
    const refreshToken = this.storage.getRefreshToken();
    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }
    return this.http.post<any>(`${this.API_URL}/refresh`, { refreshToken });
  }

  /**
   * Check if user has specific role
   */
  hasRole(role: UserRole): boolean {
    const user = this.currentUserValue;
    return user ? user.roles.includes(role) : false;
  }

  /**
   * Check if user has any of the specified roles
   */
  hasAnyRole(roles: UserRole[]): boolean {
    const user = this.currentUserValue;
    return user ? roles.some(role => user.roles.includes(role)) : false;
  }

}

