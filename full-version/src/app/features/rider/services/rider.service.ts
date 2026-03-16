import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import {
  Rider,
  Horse,
  Entry,
  Transaction,
  DashboardStats,
  Result
} from '../models/rider.model';

/**
 * Rider Service - Handles all rider-related API calls
 */
@Injectable({
  providedIn: 'root'
})
export class RiderService {
  private readonly API_URL = '/api/rider';

  constructor(private http: HttpClient) {}

  /**
   * Get dashboard statistics
   */
  getDashboardStats(): Observable<DashboardStats> {
    // TODO: Replace with actual API call
    return this.mockDashboardStats();
  }

  /**
   * Get rider profile
   */
  getProfile(): Observable<Rider> {
    // TODO: Replace with actual API call
    return this.mockRiderProfile();
  }

  /**
   * Update rider profile
   */
  updateProfile(data: Partial<Rider>): Observable<Rider> {
    return this.http.put<Rider>(`${this.API_URL}/profile`, data);
  }

  /**
   * Get all horses for current rider
   */
  getHorses(): Observable<Horse[]> {
    // TODO: Replace with actual API call
    return this.mockHorses();
  }

  /**
   * Add new horse
   */
  addHorse(horse: Partial<Horse>): Observable<Horse> {
    return this.http.post<Horse>(`${this.API_URL}/horses`, horse);
  }

  /**
   * Update horse
   */
  updateHorse(id: string, horse: Partial<Horse>): Observable<Horse> {
    return this.http.put<Horse>(`${this.API_URL}/horses/${id}`, horse);
  }

  /**
   * Get all entries for current rider
   */
  getEntries(): Observable<Entry[]> {
    // TODO: Replace with actual API call
    return this.mockEntries();
  }

  /**
   * Get all transactions for current rider
   */
  getTransactions(): Observable<Transaction[]> {
    // TODO: Replace with actual API call
    return this.mockTransactions();
  }

  /**
   * Get recent results
   */
  getRecentResults(limit: number = 5): Observable<Result[]> {
    // TODO: Replace with actual API call
    return this.mockResults();
  }

  /**
   * Process payment
   */
  processPayment(transactionId: string): Observable<any> {
    return this.http.post(`${this.API_URL}/payments/${transactionId}/process`, {});
  }

  /**
   * Update password
   */
  updatePassword(data: { currentPassword: string; newPassword: string }): Observable<any> {
    // TODO: Replace with actual API call
    return of({ success: true, message: 'Password updated successfully' }).pipe(delay(300));
  }

  /**
   * Enable two-factor authentication
   */
  enable2FA(method: string): Observable<any> {
    // TODO: Replace with actual API call
    const mockResponse = {
      qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=otpauth://totp/DSRiding:jane.smith@shyft.com?secret=JBSWY3DPEHPK3PXP&issuer=DSRiding',
      backupCodes: [
        '1234-5678-9012',
        '3456-7890-1234',
        '5678-9012-3456',
        '7890-1234-5678',
        '9012-3456-7890'
      ]
    };
    return of(mockResponse).pipe(delay(300));
  }

  /**
   * Disable two-factor authentication
   */
  disable2FA(): Observable<any> {
    // TODO: Replace with actual API call
    return of({ success: true, message: '2FA disabled successfully' }).pipe(delay(300));
  }

  /**
   * Verify 2FA code
   */
  verify2FACode(code: string): Observable<any> {
    // TODO: Replace with actual API call
    return of({ success: true, message: '2FA verified successfully' }).pipe(delay(300));
  }

  /**
   * Upload profile picture
   */
  uploadProfilePicture(file: File): Observable<any> {
    // TODO: Replace with actual API call
    const mockUrl = 'https://ui-avatars.com/api/?name=Jane+Smith&size=200';
    return of({ url: mockUrl, message: 'Profile picture uploaded successfully' }).pipe(delay(500));
  }

  /**
   * Remove profile picture
   */
  removeProfilePicture(): Observable<any> {
    // TODO: Replace with actual API call
    return of({ success: true, message: 'Profile picture removed successfully' }).pipe(delay(300));
  }

  // Mock data methods (to be replaced with actual API calls)

  private mockDashboardStats(): Observable<DashboardStats> {
    return of({
      upcomingEntries: 4,
      registeredHorses: 3,
      eventsThisSeason: 12,
      pendingResults: 2,
      totalSpent: 2450,
      pendingPayments: 850
    }).pipe(delay(300));
  }

  private mockRiderProfile(): Observable<Rider> {
    const profile: Rider = {
      id: '1',
      userId: 'user-1',
      firstName: 'Jane',
      lastName: 'Smith',
      idNumber: '9001015800084',
      email: 'jane.smith@shyft.com',
      phone: '083 123 4567',
      dateOfBirth: new Date('1990-01-15'),
      address: {
        street: '123 Main Street',
        city: 'Johannesburg',
        province: 'Gauteng',
        postalCode: '2000',
        country: 'South Africa'
      },
      clubId: 'club-1',
      clubName: 'Central Mounted Police',
      grade: 'Silver',
      membership: {
        status: 'Active',
        type: 'Senior Competitive',
        validFrom: new Date('2024-01-01'),
        validUntil: new Date('2024-12-31'),
        membershipNumber: 'SA-2024-001234'
      },
      preferences: {
        emailUpcomingEntries: true,
        smsResults: true,
        monthlyNewsletter: false,
        marketingCommunications: false
      },
      joinDate: new Date('2023-01-01')
    };
    return of(profile).pipe(delay(300));
  }

  private mockHorses(): Observable<Horse[]> {
    const horses: Horse[] = [
      {
        id: '1',
        riderId: '1',
        name: 'Starlight',
        registeredName: 'SS Starlight',
        breed: 'Warmblood',
        dateOfBirth: new Date('2016-03-15'),
        age: 8,
        gender: 'Mare',
        microchip: '123456789012345',
        passportNumber: 'SA-WB-2016-001',
        grade: 'Medium',
        status: 'Active'
      }
    ];
    return of(horses).pipe(delay(300));
  }

  private mockEntries(): Observable<Entry[]> {
    return of([]).pipe(delay(300));
  }

  private mockTransactions(): Observable<Transaction[]> {
    return of([]).pipe(delay(300));
  }

  private mockResults(): Observable<Result[]> {
    return of([]).pipe(delay(300));
  }
}

