import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import {
  Rider,
  Horse,
  Entry,
  Transaction,
  DashboardStats,
  Result,
  Club,
  RiderClub,
  MembershipType,
  Year,
  Subscription,
  SaefMembership,
  MembershipApplication,
  Invoice
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
   * Get rider's affiliated clubs
   */
  getRiderClubs(): Observable<RiderClub[]> {
    // TODO: Replace with actual API call
    return this.mockRiderClubs();
  }

  /**
   * Search available clubs (for typeahead)
   */
  searchClubs(term: string): Observable<Club[]> {
    // TODO: Replace with actual API call
    return this.mockAvailableClubs().pipe(
      map(clubs => clubs.filter(club =>
        club.name.toLowerCase().includes(term.toLowerCase()) ||
        (club.abbreviation && club.abbreviation.toLowerCase().includes(term.toLowerCase())) ||
        club.city.toLowerCase().includes(term.toLowerCase()) ||
        club.province.toLowerCase().includes(term.toLowerCase())
      ))
    );
  }

  /**
   * Get all available clubs
   */
  getAvailableClubs(): Observable<Club[]> {
    // TODO: Replace with actual API call
    return this.mockAvailableClubs();
  }

  /**
   * Add club affiliation
   */
  addClubAffiliation(clubId: string, isPrimary: boolean = false): Observable<RiderClub> {
    return this.http.post<RiderClub>(`${this.API_URL}/clubs`, { clubId, isPrimary });
  }

  /**
   * Remove club affiliation
   */
  removeClubAffiliation(riderClubId: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/clubs/${riderClubId}`);
  }

  /**
   * Set primary club
   */
  setPrimaryClub(riderClubId: string): Observable<RiderClub> {
    return this.http.put<RiderClub>(`${this.API_URL}/clubs/${riderClubId}/primary`, {});
  }

  /**
   * Update password
   */
  updatePassword(data: { currentPassword: string; newPassword: string }): Observable<any> {
    // TODO: Replace with actual API call
    return of({ success: true, message: 'Password updated successfully' }).pipe(delay(300));
  }

  /**
   * Get rider's SAEF memberships
   */
  getSaefMemberships(riderId?: string, year?: string): Observable<SaefMembership[]> {
    // TODO: Replace with actual API call
    return this.mockSaefMemberships(riderId, year);
  }

  /**
   * Get available membership types
   */
  getMembershipTypes(): Observable<MembershipType[]> {
    // TODO: Replace with actual API call
    return this.mockMembershipTypes();
  }

  /**
   * Get available years
   */
  getYears(): Observable<Year[]> {
    // TODO: Replace with actual API call
    return this.mockYears();
  }

  /**
   * Get available subscriptions for a year
   */
  getSubscriptions(yearId: string): Observable<Subscription[]> {
    // TODO: Replace with actual API call
    return this.mockSubscriptions(yearId);
  }

  /**
   * Submit membership application
   */
  submitMembershipApplication(application: MembershipApplication): Observable<SaefMembership> {
    return this.http.post<SaefMembership>(`${this.API_URL}/saef-memberships`, application);
  }

  /**
   * Get rider's invoices
   */
  getInvoices(riderId?: string, status?: string): Observable<Invoice[]> {
    // TODO: Replace with actual API call
    return this.mockInvoices(riderId, status);
  }

  /**
   * Get invoice by ID
   */
  getInvoiceById(invoiceId: string): Observable<Invoice> {
    return this.http.get<Invoice>(`${this.API_URL}/invoices/${invoiceId}`);
  }

  /**
   * Download invoice PDF
   */
  downloadInvoice(invoiceId: string): Observable<Blob> {
    return this.http.get(`${this.API_URL}/invoices/${invoiceId}/download`, {
      responseType: 'blob'
    });
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

  private mockRiderClubs(): Observable<RiderClub[]> {
    const riderClubs: RiderClub[] = [
      {
        id: 'rc-1',
        riderId: '1',
        clubId: 'club-1',
        club: {
          id: 'club-1',
          name: 'Central Mounted Police Equestrian Club',
          abbreviation: 'CMP',
          province: 'Gauteng',
          city: 'Johannesburg',
          contactPerson: 'Sarah Mitchell',
          contactEmail: 'sarah.mitchell@shyft.com',
          contactPhone: '011 234 5678',
          website: 'https://cmp-equestrian.co.za',
          status: 'Active',
          memberCount: 145
        },
        isPrimary: true,
        affiliatedDate: new Date('2023-01-15'),
        status: 'Active'
      }
    ];
    return of(riderClubs).pipe(delay(300));
  }

  private mockAvailableClubs(): Observable<Club[]> {
    const clubs: Club[] = [
      {
        id: 'club-1',
        name: 'Central Mounted Police Equestrian Club',
        abbreviation: 'CMP',
        province: 'Gauteng',
        city: 'Johannesburg',
        contactPerson: 'Sarah Mitchell',
        contactEmail: 'sarah.mitchell@shyft.com',
        contactPhone: '011 234 5678',
        website: 'https://cmp-equestrian.co.za',
        status: 'Active',
        memberCount: 145
      },
      {
        id: 'club-2',
        name: 'Kyalami Equestrian Park',
        abbreviation: 'KEP',
        province: 'Gauteng',
        city: 'Midrand',
        contactPerson: 'Michael Thompson',
        contactEmail: 'michael.thompson@byteorbit.com',
        contactPhone: '011 567 8901',
        website: 'https://kyalami-equestrian.co.za',
        status: 'Active',
        memberCount: 230
      },
      {
        id: 'club-3',
        name: 'Inanda Polo Club',
        abbreviation: 'IPC',
        province: 'Gauteng',
        city: 'Sandton',
        contactPerson: 'Emma Wilson',
        contactEmail: 'emma.wilson@shyft.com',
        contactPhone: '011 234 9876',
        website: 'https://inanda-polo.co.za',
        status: 'Active',
        memberCount: 180
      },
      {
        id: 'club-4',
        name: 'Summerveld Equestrian Centre',
        abbreviation: 'SEC',
        province: 'KwaZulu-Natal',
        city: 'Pietermaritzburg',
        contactPerson: 'David Roberts',
        contactEmail: 'david.roberts@byteorbit.com',
        contactPhone: '033 123 4567',
        website: 'https://summerveld-ec.co.za',
        status: 'Active',
        memberCount: 95
      },
      {
        id: 'club-5',
        name: 'Cape Town Dressage Group',
        abbreviation: 'CTDG',
        province: 'Western Cape',
        city: 'Cape Town',
        contactPerson: 'Lisa Anderson',
        contactEmail: 'lisa.anderson@shyft.com',
        contactPhone: '021 456 7890',
        website: 'https://ctdg.co.za',
        status: 'Active',
        memberCount: 210
      },
      {
        id: 'club-6',
        name: 'Stellenbosch Riding Club',
        abbreviation: 'SRC',
        province: 'Western Cape',
        city: 'Stellenbosch',
        contactPerson: 'James van der Merwe',
        contactEmail: 'james.vandermerwe@byteorbit.com',
        contactPhone: '021 887 6543',
        website: 'https://stellenbosch-riding.co.za',
        status: 'Active',
        memberCount: 120
      },
      {
        id: 'club-7',
        name: 'Durban Equestrian Centre',
        abbreviation: 'DEC',
        province: 'KwaZulu-Natal',
        city: 'Durban',
        contactPerson: 'Rachel Naidoo',
        contactEmail: 'rachel.naidoo@shyft.com',
        contactPhone: '031 765 4321',
        website: 'https://durban-equestrian.co.za',
        status: 'Active',
        memberCount: 165
      },
      {
        id: 'club-8',
        name: 'Pretoria Dressage Academy',
        abbreviation: 'PDA',
        province: 'Gauteng',
        city: 'Pretoria',
        contactPerson: 'Peter Botha',
        contactEmail: 'peter.botha@byteorbit.com',
        contactPhone: '012 345 6789',
        website: 'https://pretoria-dressage.co.za',
        status: 'Active',
        memberCount: 140
      }
    ];
    return of(clubs).pipe(delay(300));
  }

  private mockSaefMemberships(riderId?: string, year?: string): Observable<SaefMembership[]> {
    const currentYear = new Date().getFullYear();
    const memberships: SaefMembership[] = [];

    // Mock: No active membership for current year (to show empty state)
    // Uncomment below to test with active membership
    /*
    memberships.push({
      id: 'sm-1',
      riderId: '1',
      riderName: 'Jane Smith',
      yearId: 'year-2026',
      yearTitle: '2026',
      approvedAt: new Date('2026-01-15'),
      approvedBy: 'admin-1',
      approvedByName: 'Admin User',
      createdAt: new Date('2026-01-10'),
      updatedAt: new Date('2026-01-15'),
      status: 'Active'
    });
    */

    return of(memberships).pipe(delay(300));
  }

  private mockMembershipTypes(): Observable<MembershipType[]> {
    const types: MembershipType[] = [
      {
        id: 'mt-1',
        name: 'Pony Rider Competitive',
        code: 'PONY_COMP',
        description: 'For competitive pony riders',
        isActive: true
      },
      {
        id: 'mt-2',
        name: 'Children Competitive',
        code: 'CHILD_COMP',
        description: 'For competitive children riders',
        isActive: true
      },
      {
        id: 'mt-3',
        name: 'Junior Competitive',
        code: 'JUNIOR_COMP',
        description: 'For competitive junior riders',
        isActive: true
      },
      {
        id: 'mt-4',
        name: 'Senior Competitive',
        code: 'SENIOR_COMP',
        description: 'For competitive senior riders',
        isActive: true
      },
      {
        id: 'mt-5',
        name: 'Non-Graded Senior (Adult) Rider',
        code: 'NON_GRADED_SENIOR',
        description: 'For non-graded adult riders',
        isActive: true
      },
      {
        id: 'mt-6',
        name: 'Non-Graded Pony/Child/Junior Rider',
        code: 'NON_GRADED_YOUTH',
        description: 'For non-graded youth riders',
        isActive: true
      },
      {
        id: 'mt-7',
        name: 'Non-Participating Owner',
        code: 'OWNER',
        description: 'For horse owners who do not compete',
        isActive: true
      },
      {
        id: 'mt-8',
        name: 'Official',
        code: 'OFFICIAL',
        description: 'For judges, stewards, and other officials',
        isActive: true
      }
    ];
    return of(types).pipe(delay(300));
  }

  private mockYears(): Observable<Year[]> {
    const years: Year[] = [
      {
        id: 'year-2026',
        title: '2026',
        startDate: new Date('2026-01-01'),
        endDate: new Date('2026-12-31'),
        isActive: true
      },
      {
        id: 'year-2027',
        title: '2027',
        startDate: new Date('2027-01-01'),
        endDate: new Date('2027-12-31'),
        isActive: false
      }
    ];
    return of(years).pipe(delay(300));
  }

  private mockSubscriptions(yearId: string): Observable<Subscription[]> {
    const subscriptions: Subscription[]  = [
      {
        id: 'sub-1',
        name: 'Annual Membership - Competitive',
        description: 'Full year competitive membership',
        fee: 1500,
        yearId: yearId,
        yearTitle: '2026',
        membershipIds: ['mt-1', 'mt-2', 'mt-3', 'mt-4'],
        membershipNames: ['Pony Rider Competitive', 'Children Competitive', 'Junior Competitive', 'Senior Competitive'],
        isOfficial: false,
        isRecreational: false,
        isActive: true
      },
      {
        id: 'sub-2',
        name: 'Annual Membership - Non-Graded',
        description: 'Full year non-graded membership',
        fee: 800,
        yearId: yearId,
        yearTitle: '2026',
        membershipIds: ['mt-5', 'mt-6'],
        membershipNames: ['Non-Graded Senior (Adult) Rider', 'Non-Graded Pony/Child/Junior Rider'],
        isOfficial: false,
        isRecreational: true,
        isActive: true
      },
      {
        id: 'sub-3',
        name: 'Annual Membership - Owner',
        description: 'Full year owner membership',
        fee: 500,
        yearId: yearId,
        yearTitle: '2026',
        membershipIds: ['mt-7'],
        membershipNames: ['Non-Participating Owner'],
        isOfficial: false,
        isRecreational: false,
        isActive: true
      },
      {
        id: 'sub-4',
        name: 'Annual Membership - Official',
        description: 'Full year official membership',
        fee: 1200,
        yearId: yearId,
        yearTitle: '2026',
        membershipIds: ['mt-8'],
        membershipNames: ['Official'],
        isOfficial: true,
        isRecreational: false,
        isActive: true
      }
    ];
    return of(subscriptions).pipe(delay(300));
  }

  private mockInvoices(riderId?: string, status?: string): Observable<Invoice[]> {
    const invoices: Invoice[] = [
      {
        id: 'inv-1',
        invoiceNumber: 'INV-2026-001',
        riderId: '1',
        riderName: 'Jane Smith',
        issueDate: new Date('2026-01-15'),
        dueDate: new Date('2026-02-15'),
        status: 'Paid',
        items: [
          {
            id: 'item-1',
            description: 'SAEF Senior Competitive Membership - 2026',
            quantity: 1,
            unitPrice: 1500,
            total: 1500
          }
        ],
        subtotal: 1500,
        tax: 225,
        total: 1725,
        paidAmount: 1725,
        paidDate: new Date('2026-01-20'),
        paymentMethod: 'Credit Card',
        notes: 'Thank you for your membership renewal',
        type: 'Membership'
      },
      {
        id: 'inv-2',
        invoiceNumber: 'INV-2026-002',
        riderId: '1',
        riderName: 'Jane Smith',
        issueDate: new Date('2026-02-10'),
        dueDate: new Date('2026-03-10'),
        status: 'Pending',
        items: [
          {
            id: 'item-2',
            description: 'Entry Fee - Spring Dressage Championship',
            quantity: 2,
            unitPrice: 350,
            total: 700
          },
          {
            id: 'item-3',
            description: 'Stable Fee - 2 days',
            quantity: 2,
            unitPrice: 150,
            total: 300
          }
        ],
        subtotal: 1000,
        tax: 150,
        total: 1150,
        paidAmount: 0,
        notes: 'Payment due before event date',
        type: 'Entry Fee'
      },
      {
        id: 'inv-3',
        invoiceNumber: 'INV-2025-089',
        riderId: '1',
        riderName: 'Jane Smith',
        issueDate: new Date('2025-11-20'),
        dueDate: new Date('2025-12-20'),
        status: 'Paid',
        items: [
          {
            id: 'item-4',
            description: 'Entry Fee - Winter Classic',
            quantity: 1,
            unitPrice: 400,
            total: 400
          }
        ],
        subtotal: 400,
        tax: 60,
        total: 460,
        paidAmount: 460,
        paidDate: new Date('2025-11-25'),
        paymentMethod: 'EFT',
        type: 'Entry Fee'
      },
      {
        id: 'inv-4',
        invoiceNumber: 'INV-2026-003',
        riderId: '1',
        riderName: 'Jane Smith',
        issueDate: new Date('2026-02-01'),
        dueDate: new Date('2026-01-25'),
        status: 'Overdue',
        items: [
          {
            id: 'item-5',
            description: 'Annual Club Subscription - CMP',
            quantity: 1,
            unitPrice: 500,
            total: 500
          }
        ],
        subtotal: 500,
        tax: 75,
        total: 575,
        paidAmount: 0,
        notes: 'Payment overdue - please settle as soon as possible',
        type: 'Subscription'
      }
    ];

    // Filter by status if provided
    let filteredInvoices = invoices;
    if (status && status !== 'All') {
      filteredInvoices = invoices.filter(inv => inv.status === status);
    }

    return of(filteredInvoices).pipe(delay(300));
  }
}

