import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Competition, CompetitionClass, CompetitionExtra, CreateEntryRequest, Entry } from '../models/rider.model';

/**
 * Competition Service - Handles competition-related API calls
 */
@Injectable({
  providedIn: 'root'
})
export class CompetitionService {
  private readonly API_URL = '/api';

  constructor(private http: HttpClient) {}

  /**
   * Get all open/published competitions
   */
  getOpenCompetitions(): Observable<Competition[]> {
    // TODO: Replace with actual API call
    // return this.http.get<Competition[]>(`${this.API_URL}/competitions/?status=published`);
    return this.mockOpenCompetitions();
  }

  /**
   * Get competition by slug
   */
  getCompetitionBySlug(slug: string): Observable<Competition> {
    // TODO: Replace with actual API call
    // return this.http.get<Competition>(`${this.API_URL}/competitions/${slug}/`);
    return this.mockCompetitionBySlug(slug);
  }

  /**
   * Get classes for a competition
   */
  getCompetitionClasses(competitionId: string): Observable<CompetitionClass[]> {
    // TODO: Replace with actual API call
    // return this.http.get<CompetitionClass[]>(`${this.API_URL}/competition-classes/?competition=${competitionId}`);
    return this.mockCompetitionClasses(competitionId);
  }

  /**
   * Get extras for a competition
   */
  getCompetitionExtras(competitionId: string): Observable<CompetitionExtra[]> {
    // TODO: Replace with actual API call
    // return this.http.get<CompetitionExtra[]>(`${this.API_URL}/competition-extras/?competition=${competitionId}`);
    return this.mockCompetitionExtras(competitionId);
  }

  /**
   * Create entry with classes and extras
   */
  createEntry(request: CreateEntryRequest): Observable<Entry> {
    return this.http.post<Entry>(`${this.API_URL}/entries/`, request);
  }

  /**
   * Search riders (for typeahead)
   */
  searchRiders(term: string): Observable<any[]> {
    // TODO: Replace with actual API call
    // return this.http.get<any[]>(`${this.API_URL}/riders/?search=${term}`);
    return this.mockSearchRiders(term);
  }

  /**
   * Search horses (for typeahead)
   */
  searchHorses(term: string): Observable<any[]> {
    // TODO: Replace with actual API call
    // return this.http.get<any[]>(`${this.API_URL}/horses/?search=${term}`);
    return this.mockSearchHorses(term);
  }

  // Mock data methods (to be replaced with actual API calls)

  private mockOpenCompetitions(): Observable<Competition[]> {
    const competitions: Competition[] = [
      {
        id: 'comp-001',
        name: 'Spring Dressage Championship 2026',
        slug: 'spring-dressage-championship-2026',
        competitionType: 'dressage',
        startDate: new Date('2026-04-15'),
        endDate: new Date('2026-04-17'),
        venue: 'Cape Town Equestrian Centre',
        city: 'Cape Town',
        province: 'Western Cape',
        closingDate: new Date('2026-04-08'),
        status: 'published',
        description: 'Annual spring championship featuring all levels of dressage competition',
        contactEmail: 'entries@ctequestrian.co.za',
        contactPhone: '+27 21 555 0123',
        maxEntries: 200,
        totalClasses: 24,
        totalEntries: 156
      },
      {
        id: 'comp-002',
        name: 'Gauteng Provincial Dressage',
        slug: 'gauteng-provincial-dressage',
        competitionType: 'dressage',
        startDate: new Date('2026-05-10'),
        endDate: new Date('2026-05-12'),
        venue: 'Kyalami Equestrian Park',
        city: 'Midrand',
        province: 'Gauteng',
        closingDate: new Date('2026-05-03'),
        status: 'published',
        description: 'Provincial championship for all grades',
        contactEmail: 'info@kyalami-equestrian.co.za',
        contactPhone: '+27 11 567 8901',
        maxEntries: 150,
        totalClasses: 18,
        totalEntries: 89
      },
      {
        id: 'comp-003',
        name: 'KZN Summer Series - Round 1',
        slug: 'kzn-summer-series-round-1',
        competitionType: 'dressage',
        startDate: new Date('2026-06-05'),
        endDate: new Date('2026-06-06'),
        venue: 'Summerveld Equestrian Centre',
        city: 'Pietermaritzburg',
        province: 'KwaZulu-Natal',
        closingDate: new Date('2026-05-29'),
        status: 'published',
        description: 'First round of the popular summer series',
        contactEmail: 'entries@summerveld-ec.co.za',
        contactPhone: '+27 33 123 4567',
        maxEntries: 100,
        totalClasses: 15,
        totalEntries: 45
      }
    ];
    return of(competitions).pipe(delay(500));
  }

  private mockCompetitionBySlug(slug: string): Observable<Competition> {
    const competition: Competition = {
      id: 'comp-001',
      name: 'Spring Dressage Championship 2026',
      slug: 'spring-dressage-championship-2026',
      competitionType: 'dressage',
      startDate: new Date('2026-04-15'),
      endDate: new Date('2026-04-17'),
      venue: 'Cape Town Equestrian Centre',
      city: 'Cape Town',
      province: 'Western Cape',
      closingDate: new Date('2026-04-08'),
      status: 'published',
      description: 'Annual spring championship featuring all levels of dressage competition',
      contactEmail: 'entries@ctequestrian.co.za',
      contactPhone: '+27 21 555 0123',
      maxEntries: 200,
      totalClasses: 24,
      totalEntries: 156
    };
    return of(competition).pipe(delay(300));
  }

  private mockCompetitionClasses(competitionId: string): Observable<CompetitionClass[]> {
    const classes: CompetitionClass[] = [
      {
        id: 'class-001',
        competitionId,
        name: 'Preliminary 1A',
        grade: 'Preliminary',
        classType: 'Dressage Test',
        fee: 250,
        approximateStartTime: '08:00',
        description: 'Preliminary level test 1A',
        isActive: true
      },
      {
        id: 'class-002',
        competitionId,
        name: 'Preliminary 1B',
        grade: 'Preliminary',
        classType: 'Dressage Test',
        fee: 250,
        approximateStartTime: '09:30',
        description: 'Preliminary level test 1B',
        isActive: true
      },
      {
        id: 'class-003',
        competitionId,
        name: 'Novice 2A',
        grade: 'Novice',
        classType: 'Dressage Test',
        fee: 300,
        approximateStartTime: '11:00',
        description: 'Novice level test 2A',
        isActive: true
      },
      {
        id: 'class-004',
        competitionId,
        name: 'Novice 2B',
        grade: 'Novice',
        classType: 'Dressage Test',
        fee: 300,
        approximateStartTime: '13:00',
        description: 'Novice level test 2B',
        isActive: true
      },
      {
        id: 'class-005',
        competitionId,
        name: 'Elementary 3A',
        grade: 'Elementary',
        classType: 'Dressage Test',
        fee: 350,
        approximateStartTime: '14:30',
        description: 'Elementary level test 3A',
        isActive: true
      },
      {
        id: 'class-006',
        competitionId,
        name: 'Medium 4A',
        grade: 'Medium',
        classType: 'Dressage Test',
        fee: 400,
        approximateStartTime: '08:00',
        description: 'Medium level test 4A (Day 2)',
        isActive: true
      }
    ];
    return of(classes).pipe(delay(300));
  }

  private mockCompetitionExtras(competitionId: string): Observable<CompetitionExtra[]> {
    const extras: CompetitionExtra[] = [
      {
        id: 'extra-001',
        competitionId,
        name: 'Stable',
        description: 'Stable for one horse per day',
        price: 150,
        quantity: 50,
        isStable: true,
        isActive: true
      },
      {
        id: 'extra-002',
        competitionId,
        name: 'Bedding',
        description: 'Shavings bedding per stable',
        price: 80,
        quantity: 100,
        isStable: false,
        isActive: true
      },
      {
        id: 'extra-003',
        competitionId,
        name: 'Hay',
        description: 'Hay bale',
        price: 60,
        quantity: 100,
        isStable: false,
        isActive: true
      },
      {
        id: 'extra-004',
        competitionId,
        name: 'Parking',
        description: 'Reserved parking space',
        price: 50,
        quantity: 80,
        isStable: false,
        isActive: true
      },
      {
        id: 'extra-005',
        competitionId,
        name: 'Programme',
        description: 'Competition programme',
        price: 25,
        isStable: false,
        isActive: true
      }
    ];
    return of(extras).pipe(delay(300));
  }

  private mockSearchRiders(term: string): Observable<any[]> {
    const riders = [
      { id: '1', firstName: 'Jane', lastName: 'Smith', email: 'jane.smith@shyft.com', saefNumber: 'SA-2024-001234' },
      { id: '2', firstName: 'Sarah', lastName: 'Parker', email: 'sarah.parker@byteorbit.com', saefNumber: 'SA-2024-001235' },
      { id: '3', firstName: 'Emma', lastName: 'Wilson', email: 'emma.wilson@shyft.com', saefNumber: 'SA-2024-001236' },
      { id: '4', firstName: 'Lisa', lastName: 'Anderson', email: 'lisa.anderson@byteorbit.com', saefNumber: 'SA-2024-001237' }
    ];
    const filtered = riders.filter(r =>
      r.firstName.toLowerCase().includes(term.toLowerCase()) ||
      r.lastName.toLowerCase().includes(term.toLowerCase()) ||
      r.email.toLowerCase().includes(term.toLowerCase()) ||
      r.saefNumber.toLowerCase().includes(term.toLowerCase())
    );
    return of(filtered).pipe(delay(300));
  }

  private mockSearchHorses(term: string): Observable<any[]> {
    const horses = [
      { id: '1', name: 'Starlight', registeredName: 'SS Starlight', passportNumber: 'SA-WB-2016-001', breed: 'Warmblood' },
      { id: '2', name: 'Thunder', registeredName: 'Thunder Bay', passportNumber: 'SA-TB-2015-045', breed: 'Thoroughbred' },
      { id: '3', name: 'Moonbeam', registeredName: 'Moonbeam Magic', passportNumber: 'SA-WB-2017-089', breed: 'Warmblood' },
      { id: '4', name: 'Phoenix', registeredName: 'Phoenix Rising', passportNumber: 'SA-WB-2018-123', breed: 'Warmblood' }
    ];
    const filtered = horses.filter(h =>
      h.name.toLowerCase().includes(term.toLowerCase()) ||
      h.registeredName.toLowerCase().includes(term.toLowerCase()) ||
      h.passportNumber.toLowerCase().includes(term.toLowerCase())
    );
    return of(filtered).pipe(delay(300));
  }
}
