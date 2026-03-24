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
   * Get horse by ID
   */
  getHorseById(id: string): Observable<Horse> {
    // TODO: Replace with actual API call
    return this.mockHorses().pipe(
      map(horses => {
        const horse = horses.find(h => h.id === id);
        if (!horse) {
          throw new Error('Horse not found');
        }
        return horse;
      })
    );
  }

  /**
   * Add new horse
   */
  addHorse(horse: Partial<Horse>): Observable<Horse> {
    // TODO: Replace with actual API call
    const newHorse: Horse = {
      id: `horse-${Date.now()}`,
      riderId: '1',
      name: horse.name || '',
      registeredName: horse.registeredName || '',
      breed: horse.breed || '',
      dateOfBirth: horse.dateOfBirth || new Date(),
      age: horse.age,
      gender: horse.gender || 'Gelding',
      color: horse.color,
      height: horse.height,
      microchip: horse.microchip || '',
      passportNumber: horse.passportNumber || '',
      grade: horse.grade || '',
      status: horse.status || 'Active',
      vaccinations: horse.vaccinations || [],
      documents: horse.documents || [],
      affiliations: horse.affiliations || [],
      imageUrl: horse.imageUrl,
      sire: horse.sire,
      dam: horse.dam,
      breeder: horse.breeder,
      owner: horse.owner,
      notes: horse.notes
    };
    return of(newHorse).pipe(delay(500));
  }

  /**
   * Update horse
   */
  updateHorse(id: string, horse: Partial<Horse>): Observable<Horse> {
    // TODO: Replace with actual API call
    return this.getHorseById(id).pipe(
      map(existingHorse => ({
        ...existingHorse,
        ...horse
      })),
      delay(500)
    );
  }

  /**
   * Delete horse
   */
  deleteHorse(id: string): Observable<void> {
    // TODO: Replace with actual API call
    return of(void 0).pipe(delay(300));
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
        id: 'horse-1',
        riderId: '1',
        name: 'Midnight Star',
        registeredName: 'Blackwood Midnight Star',
        breed: 'Hanoverian',
        color: 'Black',
        height: 16.2,
        dateOfBirth: new Date('2015-04-12'),
        age: 11,
        gender: 'Mare',
        microchip: '528210004567891',
        passportNumber: 'FEI104HN45678',
        grade: 'Medium',
        status: 'Active',
        sire: 'Donnerhall',
        dam: 'Weltmeyer Lady',
        breeder: 'Blackwood Stud Farm',
        owner: 'Jane Smith',
        imageUrl: 'assets/images/horses/horse-1.jpg',
        vaccinations: [
          {
            id: 'vacc-1',
            horseId: 'horse-1',
            vaccinationType: 'African Horse Sickness',
            vaccinationDate: new Date('2026-01-15'),
            expiryDate: new Date('2027-01-15'),
            batchNumber: 'AHS-2026-001',
            veterinarian: 'Dr. Sarah Mitchell',
            notes: 'Annual booster administered'
          },
          {
            id: 'vacc-2',
            horseId: 'horse-1',
            vaccinationType: 'Equine Influenza',
            vaccinationDate: new Date('2025-10-20'),
            expiryDate: new Date('2026-10-20'),
            batchNumber: 'EI-2025-456',
            veterinarian: 'Dr. Sarah Mitchell'
          }
        ],
        documents: [
          {
            id: 'doc-1',
            horseId: 'horse-1',
            documentType: 'Passport',
            title: 'FEI Passport',
            fileName: 'midnight-star-passport.pdf',
            fileUrl: '/documents/midnight-star-passport.pdf',
            uploadDate: new Date('2024-01-10')
          },
          {
            id: 'doc-2',
            horseId: 'horse-1',
            documentType: 'Vaccination',
            title: 'Vaccination Record 2026',
            fileName: 'vaccination-record-2026.pdf',
            fileUrl: '/documents/vaccination-record-2026.pdf',
            uploadDate: new Date('2026-01-15'),
            expiryDate: new Date('2027-01-15')
          }
        ],
        affiliations: [
          {
            id: 'aff-1',
            horseId: 'horse-1',
            organizationName: 'South African Equestrian Federation',
            registrationNumber: 'SAEF-2026-1234',
            registrationDate: new Date('2026-01-01'),
            expiryDate: new Date('2026-12-31'),
            status: 'Active'
          }
        ],
        notes: 'Excellent temperament, suitable for medium level dressage competitions'
      },
      {
        id: 'horse-2',
        riderId: '1',
        name: 'Golden Dream',
        registeredName: 'Sunridge Golden Dream',
        breed: 'Warmblood',
        color: 'Chestnut',
        height: 16.0,
        dateOfBirth: new Date('2017-06-22'),
        age: 9,
        gender: 'Gelding',
        microchip: '528210004567892',
        passportNumber: 'FEI104WB78901',
        grade: 'Elementary',
        status: 'Active',
        sire: 'Rubinstein',
        dam: 'Golden Glow',
        breeder: 'Sunridge Equestrian',
        owner: 'Jane Smith',
        imageUrl: 'assets/images/horses/horse-2.jpg',
        vaccinations: [
          {
            id: 'vacc-3',
            horseId: 'horse-2',
            vaccinationType: 'African Horse Sickness',
            vaccinationDate: new Date('2026-02-10'),
            expiryDate: new Date('2027-02-10'),
            batchNumber: 'AHS-2026-002',
            veterinarian: 'Dr. Michael Thompson'
          }
        ],
        documents: [
          {
            id: 'doc-3',
            horseId: 'horse-2',
            documentType: 'Registration',
            title: 'Warmblood Registration Certificate',
            fileName: 'golden-dream-registration.pdf',
            fileUrl: '/documents/golden-dream-registration.pdf',
            uploadDate: new Date('2023-05-15')
          }
        ],
        affiliations: [],
        notes: 'Young and promising, progressing well in training'
      },
      {
        id: 'horse-3',
        riderId: '1',
        name: 'Silver Shadow',
        registeredName: 'Silverstone Shadow Dancer',
        breed: 'Thoroughbred',
        color: 'Grey',
        height: 16.1,
        dateOfBirth: new Date('2014-08-30'),
        age: 12,
        gender: 'Mare',
        microchip: '528210004567893',
        passportNumber: 'FEI104TB23456',
        grade: 'Advanced',
        status: 'Active',
        sire: 'Silver Charm',
        dam: 'Shadow Dancer',
        breeder: 'Silverstone Stud',
        owner: 'Jane Smith',
        imageUrl: 'assets/images/horses/horse-3.jpg',
        vaccinations: [
          {
            id: 'vacc-4',
            horseId: 'horse-3',
            vaccinationType: 'African Horse Sickness',
            vaccinationDate: new Date('2025-12-05'),
            expiryDate: new Date('2026-12-05'),
            batchNumber: 'AHS-2025-789',
            veterinarian: 'Dr. Emma Wilson',
            notes: 'No adverse reactions'
          },
          {
            id: 'vacc-5',
            horseId: 'horse-3',
            vaccinationType: 'Tetanus',
            vaccinationDate: new Date('2025-11-20'),
            expiryDate: new Date('2026-11-20'),
            batchNumber: 'TET-2025-123',
            veterinarian: 'Dr. Emma Wilson'
          }
        ],
        documents: [],
        affiliations: [
          {
            id: 'aff-2',
            horseId: 'horse-3',
            organizationName: 'South African Equestrian Federation',
            registrationNumber: 'SAEF-2026-5678',
            registrationDate: new Date('2026-01-01'),
            expiryDate: new Date('2026-12-31'),
            status: 'Active'
          }
        ],
        notes: 'Experienced competition horse, excellent record in advanced dressage'
      },
      {
        id: 'horse-4',
        riderId: '1',
        name: 'Royal Prince',
        registeredName: 'Kingswood Royal Prince',
        breed: 'Dutch Warmblood',
        color: 'Bay',
        height: 17.0,
        dateOfBirth: new Date('2016-05-18'),
        age: 10,
        gender: 'Stallion',
        microchip: '528210004567894',
        passportNumber: 'FEI104DW34567',
        grade: 'Medium',
        status: 'Active',
        sire: 'Jazz',
        dam: 'Royal Lady',
        breeder: 'Kingswood Stud',
        owner: 'Jane Smith',
        vaccinations: [
          {
            id: 'vacc-6',
            horseId: 'horse-4',
            vaccinationType: 'African Horse Sickness',
            vaccinationDate: new Date('2026-01-25'),
            expiryDate: new Date('2027-01-25'),
            batchNumber: 'AHS-2026-003',
            veterinarian: 'Dr. David Roberts'
          }
        ],
        documents: [
          {
            id: 'doc-4',
            horseId: 'horse-4',
            documentType: 'Medical',
            title: 'Pre-Purchase Veterinary Examination',
            fileName: 'royal-prince-vet-exam.pdf',
            fileUrl: '/documents/royal-prince-vet-exam.pdf',
            uploadDate: new Date('2024-03-20')
          }
        ],
        affiliations: [],
        notes: 'Strong and athletic, excellent movement'
      },
      {
        id: 'horse-5',
        riderId: '1',
        name: 'Bella Luna',
        registeredName: 'Moonlight Bella Luna',
        breed: 'Lusitano',
        color: 'Palomino',
        height: 15.3,
        dateOfBirth: new Date('2018-03-10'),
        age: 8,
        gender: 'Mare',
        microchip: '528210004567895',
        passportNumber: 'FEI104LU56789',
        grade: 'Preliminary',
        status: 'Active',
        sire: 'Lusitano Gold',
        dam: 'Bella Donna',
        breeder: 'Moonlight Stables',
        owner: 'Jane Smith',
        vaccinations: [],
        documents: [],
        affiliations: [],
        notes: 'Beautiful mare with excellent potential, currently in training'
      },
      {
        id: 'horse-6',
        riderId: '1',
        name: 'Thunder Storm',
        registeredName: 'Stormridge Thunder',
        breed: 'Quarter Horse',
        color: 'Dun',
        height: 15.2,
        dateOfBirth: new Date('2012-11-05'),
        age: 14,
        gender: 'Gelding',
        microchip: '528210004567896',
        passportNumber: 'FEI104QH67890',
        grade: 'Elementary',
        status: 'Retired',
        sire: 'Thunder Bolt',
        dam: 'Storm Queen',
        breeder: 'Stormridge Ranch',
        owner: 'Jane Smith',
        vaccinations: [
          {
            id: 'vacc-7',
            horseId: 'horse-6',
            vaccinationType: 'African Horse Sickness',
            vaccinationDate: new Date('2025-11-10'),
            expiryDate: new Date('2026-11-10'),
            batchNumber: 'AHS-2025-456',
            veterinarian: 'Dr. Lisa Anderson'
          }
        ],
        documents: [],
        affiliations: [],
        notes: 'Retired from competition, now used for training purposes'
      },
      {
        id: 'horse-7',
        riderId: '1',
        name: 'Diamond Dust',
        registeredName: 'Crystal Diamond Dust',
        breed: 'Oldenburg',
        color: 'White',
        height: 16.3,
        dateOfBirth: new Date('2019-02-14'),
        age: 7,
        gender: 'Mare',
        microchip: '528210004567897',
        passportNumber: 'FEI104OL78901',
        grade: 'Preliminary',
        status: 'Inactive',
        sire: 'Diamond King',
        dam: 'Crystal Queen',
        breeder: 'Crystal Stud Farm',
        owner: 'Jane Smith',
        vaccinations: [],
        documents: [
          {
            id: 'doc-5',
            horseId: 'horse-7',
            documentType: 'Other',
            title: 'Insurance Certificate',
            fileName: 'diamond-dust-insurance.pdf',
            fileUrl: '/documents/diamond-dust-insurance.pdf',
            uploadDate: new Date('2025-06-01'),
            expiryDate: new Date('2026-06-01')
          }
        ],
        affiliations: [],
        notes: 'Currently on break due to minor injury, expected to return to training soon'
      },
      {
        id: 'horse-8',
        riderId: '1',
        name: 'Copper Flame',
        registeredName: 'Firestone Copper Flame',
        breed: 'Trakehner',
        color: 'Sorrel',
        height: 16.1,
        dateOfBirth: new Date('2017-09-25'),
        age: 9,
        gender: 'Gelding',
        microchip: '528210004567898',
        passportNumber: 'FEI104TR89012',
        grade: 'Elementary',
        status: 'Active',
        sire: 'Copper King',
        dam: 'Flame Dancer',
        breeder: 'Firestone Equestrian',
        owner: 'Jane Smith',
        vaccinations: [
          {
            id: 'vacc-8',
            horseId: 'horse-8',
            vaccinationType: 'African Horse Sickness',
            vaccinationDate: new Date('2026-02-20'),
            expiryDate: new Date('2027-02-20'),
            batchNumber: 'AHS-2026-004',
            veterinarian: 'Dr. Peter Botha'
          },
          {
            id: 'vacc-9',
            horseId: 'horse-8',
            vaccinationType: 'Equine Influenza',
            vaccinationDate: new Date('2026-02-20'),
            expiryDate: new Date('2027-02-20'),
            batchNumber: 'EI-2026-789',
            veterinarian: 'Dr. Peter Botha'
          }
        ],
        documents: [
          {
            id: 'doc-6',
            horseId: 'horse-8',
            documentType: 'Passport',
            title: 'FEI Passport',
            fileName: 'copper-flame-passport.pdf',
            fileUrl: '/documents/copper-flame-passport.pdf',
            uploadDate: new Date('2023-09-01')
          }
        ],
        affiliations: [
          {
            id: 'aff-3',
            horseId: 'horse-8',
            organizationName: 'South African Equestrian Federation',
            registrationNumber: 'SAEF-2026-9012',
            registrationDate: new Date('2026-01-01'),
            expiryDate: new Date('2026-12-31'),
            status: 'Active'
          }
        ],
        notes: 'Consistent performer, reliable in competitions'
      }
    ];
    return of(horses).pipe(delay(100));
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

