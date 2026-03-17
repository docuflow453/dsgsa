// angular import
import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';

// project import
import { environment } from 'src/environments/environment';
import { User } from '../components/_helpers/user';
import { Role } from '../components/_helpers/role';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private router = inject(Router);
  private http = inject(HttpClient);

  private currentUserSignal = signal<User | null>(null);
  private loadingSignal = signal<boolean>(false);
  isLogin: boolean = false;

  /**
   * Hardcoded test personas for development/demo purposes
   * These personas are used to simulate different user roles without needing multiple database accounts
   */
  private readonly testPersonas: Record<Role, Omit<User['user'], 'password'>> = {
    [Role.Admin]: {
      id: 'admin-001',
      email: 'admin@shyft.com',
      firstName: 'Sarah',
      lastName: 'Mitchell',
      name: 'Sarah Mitchell',
      role: Role.Admin
    },
    [Role.ShowHoldingBody]: {
      id: 'shb-001',
      email: 'shb.manager@byteorbit.com',
      firstName: 'Michael',
      lastName: 'Thompson',
      name: 'Michael Thompson',
      role: Role.ShowHoldingBody
    },
    [Role.Club]: {
      id: 'club-001',
      email: 'club.admin@shyft.com',
      firstName: 'Jennifer',
      lastName: 'Parker',
      name: 'Jennifer Parker',
      role: Role.Club
    },
    [Role.Provincial]: {
      id: 'province-001',
      email: 'provincial.coordinator@byteorbit.com',
      firstName: 'David',
      lastName: 'Anderson',
      name: 'David Anderson',
      role: Role.Provincial
    },
    [Role.Rider]: {
      id: 'rider-001',
      email: 'rider@shyft.com',
      firstName: 'Emma',
      lastName: 'Williams',
      name: 'Emma Williams',
      role: Role.Rider
    },
    [Role.SAEF]: {
      id: 'saef-001',
      email: 'saef.official@byteorbit.com',
      firstName: 'Robert',
      lastName: 'Johnson',
      name: 'Robert Johnson',
      role: Role.SAEF
    },
    [Role.Official]: {
      id: 'official-001',
      email: 'official@shyft.com',
      firstName: 'Lisa',
      lastName: 'Martinez',
      name: 'Lisa Martinez',
      role: Role.Official
    },
    [Role.User]: {
      id: 'user-001',
      email: 'user@shyft.com',
      firstName: 'John',
      lastName: 'Doe',
      name: 'John Doe',
      role: Role.User
    }
  };

  constructor() {
    // On initialization, check if we have a stored token and fetch user data
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        // If we have a serviceToken, check if it's a test persona or real user
        if (userData.serviceToken) {
          // Check if this is a test persona (has full user object stored)
          if (userData.user && userData.user.role) {
            // This is a test persona - restore it directly
            const personaUser: User = {
              serviceToken: userData.serviceToken,
              user: userData.user
            };
            this.currentUserSignal.set(personaUser);
            this.isLogin = true;
            console.log('🎭 Restored test persona from localStorage', personaUser);
          } else {
            // This is a real user - fetch from API
            this.fetchCurrentUser().subscribe({
              next: () => {
                this.isLogin = true;
              },
              error: () => {
                // If API call fails, clear stored data and logout
                this.logout();
              }
            });
          }
        }
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('currentUser');
      }
    }
  }

  /**
   * Fetches the current user data from the API using the stored serviceToken
   * This is called on app initialization and after login
   */
  fetchCurrentUser(): Observable<User> {
    this.loadingSignal.set(true);
    return this.http.get<User>(`${environment.apiUrl}/api/account/me`).pipe(
      tap((data: User) => {
        // Update the signal with the full user data (including role)
        this.currentUserSignal.set(data);
        this.loadingSignal.set(false);
      }),
      catchError((error) => {
        console.error('Error fetching current user:', error);
        this.loadingSignal.set(false);
        // Clear invalid token
        this.logout();
        throw error;
      })
    );
  }

  /**
   * Returns true if user data is currently being loaded
   */
  get isLoading(): boolean {
    return this.loadingSignal();
  }

  public get currentUserValue(): User | null {
    // Access the current user value from the signal
    return this.currentUserSignal();
  }

  public get currentUserName(): string | null {
    const currentUser = this.currentUserValue;
    return currentUser ? currentUser.user.name : 'John Doe';
  }

  /**
   * Login method with support for test personas
   * @param email - User email
   * @param password - User password
   * @param selectedRole - Optional role to use for test persona (for development/demo)
   */
  login(email: string, password: string, selectedRole?: Role) {
    return this.http.post<User>(`${environment.apiUrl}/api/account/login`, { email, password }).pipe(
      tap((data: User) => {
        // Get the serviceToken from the API response
        const serviceToken = data.serviceToken;

        // If selectedRole is provided, use the test persona for that role
        // Otherwise, use the actual user data from the API
        let userData: User;

        if (selectedRole && this.testPersonas[selectedRole]) {
          // Use hardcoded test persona with the real token
          const persona = this.testPersonas[selectedRole];
          userData = {
            serviceToken: serviceToken,
            user: {
              ...persona,
              password: '' // Don't store password
            }
          };
          console.log(`🎭 Using test persona for role: ${selectedRole}`, userData);
        } else {
          // Use actual API response data
          userData = data;
          console.log('✅ Using actual user data from API', userData);
        }

        // Store user data in localStorage (with token)
        const userDetails = {
          id: userData.user.id,
          email: userData.user.email,
          serviceToken: userData.serviceToken,
          // Store the full user object for test personas
          ...(selectedRole && { user: userData.user })
        };
        localStorage.setItem('currentUser', JSON.stringify(userDetails));

        // Update the signal with the user data (persona or real)
        this.currentUserSignal.set(userData);
        this.isLogin = true;

        // If using test persona, skip the fetchCurrentUser call
        // since we already have all the data we need
        if (!selectedRole) {
          // Fetch full user data from API (including role) and update signal
          this.fetchCurrentUser().subscribe({
            next: () => {
              this.isLogin = true;
            },
            error: (error) => {
              console.error('Error fetching user data after login:', error);
              // Even if fetch fails, we can still set the login state
              // The user data will be fetched on next page load
              this.isLogin = true;
            }
          });
        }
      })
    );
  }

  isLoggedIn() {
    return this.isLogin;
  }

  logout() {
    // Remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    this.isLogin = false;
    // Update the signal to null
    this.currentUserSignal.set(null);
    this.loadingSignal.set(false);
    this.router.navigate(['/login']);
  }

  /**
   * Gets the serviceToken from localStorage
   * Used by HTTP interceptor to add Authorization header
   */
  getToken(): string | null {
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

  register(id: string, email: string, password: string, firstName?: string, lastName?: string): Observable<User> {
    // Register the user - API automatically sets role to 'User'

    return this.http

      .post<User[]>(`${environment.apiUrl}/api/account/register`, {
        id,
        email,
        password,
        firstName,
        lastName
      })
      .pipe(
        // After successful registration, automatically log the user in
        // Use switchMap to flatten the nested Observable from login()
        switchMap((response) => {
          // API returns array of users, verify the user was registered
          const users: User[] = Array.isArray(response) ? response : [response];
          // eslint-disable-next-line
          const registeredUser = users.find((u: any) => u.email === email);

          if (!registeredUser) {
            throw new Error('Registration successful but user not found in response');
          }

          // Automatically log the user in after successful registration
          return this.login(email, password);
        }),
        catchError((error) => {
          // Re-throw error with more context
          console.error('Registration error:', error);
          throw error;
        })
      );
  }
}
