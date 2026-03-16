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

/**
 * Authentication Service - Handles all authentication operations
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = '/api/auth'; // TODO: Move to environment
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
    // TODO: Replace with actual API call
    return this.mockLogin(credentials).pipe(
      tap(response => {
        this.handleAuthSuccess(response, credentials.rememberMe);
      }),
      catchError(error => {
        console.error('Login error:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Register new user
   */
  register(data: RegisterRequest): Observable<RegisterResponse> {
    // TODO: Replace with actual API call
    return this.mockRegister(data).pipe(
      tap(response => {
        this.handleAuthSuccess(response, false);
      }),
      catchError(error => {
        console.error('Registration error:', error);
        return throwError(() => error);
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
    this.router.navigate(['/auth/login']);
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

  /**
   * Handle successful authentication
   */
  private handleAuthSuccess(response: LoginResponse | RegisterResponse, rememberMe: boolean = false): void {
    this.storage.setToken(response.tokens.accessToken, rememberMe);
    this.storage.setRefreshToken(response.tokens.refreshToken, rememberMe);
    this.storage.setUser(response.user, rememberMe);
    this.storage.setRememberMe(rememberMe);
    this.currentUserSubject.next(response.user);
    this.isAuthenticatedSubject.next(true);
  }

  /**
   * Mock login - Replace with actual API call
   */
  private mockLogin(credentials: LoginRequest): Observable<LoginResponse> {
    return of({
      user: {
        id: '1',
        email: credentials.email,
        firstName: 'Sarah',
        lastName: 'Parker',
        roles: [UserRole.RIDER],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      tokens: {
        accessToken: 'mock_access_token_' + Date.now(),
        refreshToken: 'mock_refresh_token_' + Date.now(),
        expiresIn: 3600
      }
    }).pipe(delay(500)); // Simulate network delay
  }

  /**
   * Mock register - Replace with actual API call
   */
  private mockRegister(data: RegisterRequest): Observable<RegisterResponse> {
    return of({
      user: {
        id: '2',
        email: data.email,
        firstName: data.firstName,
        lastName: data.surname, // Using surname from new model
        roles: [UserRole.RIDER],
        phone: data.mobileNumber, // Using mobileNumber from new model
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      tokens: {
        accessToken: 'mock_access_token_' + Date.now(),
        refreshToken: 'mock_refresh_token_' + Date.now(),
        expiresIn: 3600
      },
      message: 'Registration successful! Please check your email to verify your account.'
    }).pipe(delay(500));
  }
}

