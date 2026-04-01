import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import {
  ShowHoldingBody,
  DashboardStats,
  Member,
  MemberApprovalRequest,
  MemberRejectionRequest,
  RevenueData,
  ChartData
} from '../models/show-holding-body.model';

@Injectable({
  providedIn: 'root'
})
export class ShowHoldingBodyService {
  
  private mockSHB: ShowHoldingBody = {
    id: 'shb-001',
    name: 'Cape Town Equestrian Centre',
    registrationNumber: 'SHB-2024-001',
    email: 'info@ctequestrian.co.za',
    phone: '+27 21 555 0123',
    website: 'https://www.ctequestrian.co.za',
    addressLine1: '123 Equestrian Drive',
    addressLine2: 'Constantia',
    city: 'Cape Town',
    province: 'Western Cape',
    postalCode: '7806',
    country: 'South Africa',
    primaryContactName: 'Sarah Mitchell',
    primaryContactEmail: 'sarah.mitchell@ctequestrian.co.za',
    primaryContactPhone: '+27 82 555 0123',
    bankName: 'First National Bank',
    accountNumber: '62012345678',
    branchCode: '250655',
    accountType: 'Business Cheque Account',
    accountHolderName: 'Cape Town Equestrian Centre',
    notificationPreferences: {
      emailNotifications: true,
      smsNotifications: true,
      newMemberRequests: true,
      competitionUpdates: true,
      paymentNotifications: true,
      systemAnnouncements: true
    },
    timezone: 'Africa/Johannesburg',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date(),
    isActive: true
  };

  private mockApprovedMembers: Member[] = [
    {
      id: 'member-001',
      firstName: 'Emma',
      lastName: 'Thompson',
      email: 'emma.thompson@shyft.com',
      phone: '+27 82 123 4567',
      membershipNumber: 'SAEF-2024-001',
      profileImage: 'assets/images/user/avatar-1.jpg',
      horses: [
        { id: 'h1', name: 'Midnight Star', registeredName: 'Midnight Star ZA', breed: 'Warmblood' },
        { id: 'h2', name: 'Silver Dream', registeredName: 'Silver Dream ZA', breed: 'Thoroughbred' }
      ],
      dateRequested: new Date('2024-01-10'),
      dateApproved: new Date('2024-01-12'),
      status: 'approved',
      totalEntries: 15,
      lastActivity: new Date('2024-03-15')
    },
    {
      id: 'member-002',
      firstName: 'Michael',
      lastName: 'Roberts',
      email: 'michael.roberts@byteorbit.com',
      phone: '+27 83 234 5678',
      membershipNumber: 'SAEF-2024-002',
      profileImage: 'assets/images/user/avatar-2.jpg',
      horses: [
        { id: 'h3', name: 'Thunder', registeredName: 'Thunder Bay ZA', breed: 'Hanoverian' }
      ],
      dateRequested: new Date('2024-01-15'),
      dateApproved: new Date('2024-01-17'),
      status: 'approved',
      totalEntries: 12,
      lastActivity: new Date('2024-03-14')
    },
    {
      id: 'member-003',
      firstName: 'Jessica',
      lastName: 'Williams',
      email: 'jessica.williams@shyft.com',
      phone: '+27 84 345 6789',
      membershipNumber: 'SAEF-2024-003',
      profileImage: 'assets/images/user/avatar-3.jpg',
      horses: [
        { id: 'h4', name: 'Royal Prince', registeredName: 'Royal Prince ZA', breed: 'Dutch Warmblood' },
        { id: 'h5', name: 'Golden Girl', registeredName: 'Golden Girl ZA', breed: 'Oldenburg' }
      ],
      dateRequested: new Date('2024-02-01'),
      dateApproved: new Date('2024-02-03'),
      status: 'approved',
      totalEntries: 20,
      lastActivity: new Date('2024-03-16')
    },
    {
      id: 'member-004',
      firstName: 'David',
      lastName: 'Anderson',
      email: 'david.anderson@byteorbit.com',
      phone: '+27 85 456 7890',
      membershipNumber: 'SAEF-2024-004',
      horses: [
        { id: 'h6', name: 'Bella', registeredName: 'Bella Vista ZA', breed: 'Friesian' }
      ],
      dateRequested: new Date('2024-02-10'),
      dateApproved: new Date('2024-02-12'),
      status: 'approved',
      totalEntries: 8,
      lastActivity: new Date('2024-03-10')
    },
    {
      id: 'member-005',
      firstName: 'Sophie',
      lastName: 'Martinez',
      email: 'sophie.martinez@shyft.com',
      phone: '+27 86 567 8901',
      membershipNumber: 'SAEF-2024-005',
      profileImage: 'assets/images/user/avatar-4.jpg',
      horses: [
        { id: 'h7', name: 'Apollo', registeredName: 'Apollo Rising ZA', breed: 'Lusitano' }
      ],
      dateRequested: new Date('2024-02-20'),
      dateApproved: new Date('2024-02-22'),
      status: 'approved',
      totalEntries: 10,
      lastActivity: new Date('2024-03-12')
    }
  ];

  private mockPendingMembers: Member[] = [
    {
      id: 'member-006',
      firstName: 'James',
      lastName: 'Taylor',
      email: 'james.taylor@byteorbit.com',
      phone: '+27 87 678 9012',
      membershipNumber: 'SAEF-2024-006',
      horses: [
        { id: 'h8', name: 'Storm', registeredName: 'Storm Chaser ZA', breed: 'Andalusian' }
      ],
      dateRequested: new Date('2024-03-15'),
      status: 'pending',
      totalEntries: 0,
      lastActivity: new Date('2024-03-15')
    },
    {
      id: 'member-007',
      firstName: 'Olivia',
      lastName: 'Brown',
      email: 'olivia.brown@shyft.com',
      phone: '+27 88 789 0123',
      membershipNumber: 'SAEF-2024-007',
      profileImage: 'assets/images/user/avatar-5.jpg',
      horses: [
        { id: 'h9', name: 'Duchess', registeredName: 'Duchess of York ZA', breed: 'Trakehner' },
        { id: 'h10', name: 'Prince', registeredName: 'Prince Charming ZA', breed: 'Westphalian' }
      ],
      dateRequested: new Date('2024-03-16'),
      status: 'pending',
      totalEntries: 0,
      lastActivity: new Date('2024-03-16')
    }
  ];

  constructor() {}

  // Get SHB profile
  getProfile(): Observable<ShowHoldingBody> {
    return of(this.mockSHB).pipe(delay(300));
  }

  // Update SHB profile
  updateProfile(profile: Partial<ShowHoldingBody>): Observable<ShowHoldingBody> {
    this.mockSHB = { ...this.mockSHB, ...profile, updatedAt: new Date() };
    return of(this.mockSHB).pipe(delay(300));
  }

  // Get dashboard statistics
  getDashboardStats(): Observable<DashboardStats> {
    const stats: DashboardStats = {
      totalCompetitions: 24,
      upcomingEvents: 5,
      totalEntries: 156,
      totalRevenue: 245800,
      pendingApprovals: this.mockPendingMembers.length,
      approvedMembers: this.mockApprovedMembers.length,
      recentActivity: [
        {
          id: '1',
          type: 'member_request',
          title: 'New Member Request',
          description: 'Olivia Brown requested membership',
          timestamp: new Date('2024-03-16T10:30:00'),
          icon: 'ti-user-plus',
          iconColor: '#2563eb'
        }
      ]
    };
    return of(stats).pipe(delay(300));
  }

  // Get approved members
  getApprovedMembers(): Observable<Member[]> {
    return of(this.mockApprovedMembers).pipe(delay(300));
  }

  // Get pending members
  getPendingMembers(): Observable<Member[]> {
    return of(this.mockPendingMembers).pipe(delay(300));
  }

  // Approve member
  approveMember(request: MemberApprovalRequest): Observable<{ success: boolean; message: string }> {
    const memberIndex = this.mockPendingMembers.findIndex(m => m.id === request.memberId);
    if (memberIndex !== -1) {
      const member = this.mockPendingMembers[memberIndex];
      member.status = 'approved';
      member.dateApproved = new Date();
      this.mockApprovedMembers.push(member);
      this.mockPendingMembers.splice(memberIndex, 1);
      return of({ success: true, message: `${member.firstName} ${member.lastName} has been approved successfully.` }).pipe(delay(300));
    }
    return of({ success: false, message: 'Member not found.' }).pipe(delay(300));
  }

  // Reject member
  rejectMember(request: MemberRejectionRequest): Observable<{ success: boolean; message: string }> {
    const memberIndex = this.mockPendingMembers.findIndex(m => m.id === request.memberId);
    if (memberIndex !== -1) {
      const member = this.mockPendingMembers[memberIndex];
      member.status = 'rejected';
      member.rejectionReason = request.reason;
      this.mockPendingMembers.splice(memberIndex, 1);
      return of({ success: true, message: `${member.firstName} ${member.lastName} has been rejected.` }).pipe(delay(300));
    }
    return of({ success: false, message: 'Member not found.' }).pipe(delay(300));
  }

  // Remove approved member
  removeMember(memberId: string): Observable<{ success: boolean; message: string }> {
    const memberIndex = this.mockApprovedMembers.findIndex(m => m.id === memberId);
    if (memberIndex !== -1) {
      const member = this.mockApprovedMembers[memberIndex];
      this.mockApprovedMembers.splice(memberIndex, 1);
      return of({ success: true, message: `${member.firstName} ${member.lastName} has been removed.` }).pipe(delay(300));
    }
    return of({ success: false, message: 'Member not found.' }).pipe(delay(300));
  }

  // Get revenue data for charts
  getRevenueData(): Observable<RevenueData[]> {
    const data: RevenueData[] = [
      { month: 'Jan', amount: 18500 },
      { month: 'Feb', amount: 22300 },
      { month: 'Mar', amount: 19800 },
      { month: 'Apr', amount: 25600 },
      { month: 'May', amount: 28900 },
      { month: 'Jun', amount: 31200 }
    ];
    return of(data).pipe(delay(300));
  }

  // Get entries chart data
  getEntriesChartData(): Observable<ChartData> {
    const data: ChartData = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [
        {
          label: 'Competition Entries',
          data: [45, 52, 48, 65, 72, 68],
          backgroundColor: 'rgba(37, 99, 235, 0.1)',
          borderColor: '#2563eb',
          borderWidth: 2
        }
      ]
    };
    return of(data).pipe(delay(300));
  }

  // Competition Management Methods
  getCompetitions(): Observable<any[]> {
    const mockCompetitions = [
      {
        id: 'comp-001',
        name: 'Spring Dressage Championship 2026',
        startDate: new Date('2026-04-15'),
        endDate: new Date('2026-04-17'),
        venue: 'Cape Town Equestrian Centre',
        city: 'Cape Town',
        province: 'Western Cape',
        status: 'published',
        totalClasses: 24,
        totalEntries: 156,
        totalRevenue: 234500.00,
        createdAt: new Date('2026-01-10'),
        updatedAt: new Date('2026-03-05')
      },
      {
        id: 'comp-002',
        name: 'Winter Classic Dressage Show',
        startDate: new Date('2026-06-20'),
        endDate: new Date('2026-06-21'),
        venue: 'Stellenbosch Riding Academy',
        city: 'Stellenbosch',
        province: 'Western Cape',
        status: 'draft',
        totalClasses: 18,
        totalEntries: 0,
        totalRevenue: 0,
        createdAt: new Date('2026-02-15'),
        updatedAt: new Date('2026-03-10')
      },
      {
        id: 'comp-003',
        name: 'Autumn Dressage Festival',
        startDate: new Date('2026-03-10'),
        endDate: new Date('2026-03-12'),
        venue: 'Durbanville Equestrian Park',
        city: 'Durbanville',
        province: 'Western Cape',
        status: 'ongoing',
        totalClasses: 20,
        totalEntries: 142,
        totalRevenue: 198750.00,
        createdAt: new Date('2025-12-01'),
        updatedAt: new Date('2026-03-09')
      },
      {
        id: 'comp-004',
        name: 'Summer Dressage Spectacular',
        startDate: new Date('2025-12-15'),
        endDate: new Date('2025-12-17'),
        venue: 'Cape Town Equestrian Centre',
        city: 'Cape Town',
        province: 'Western Cape',
        status: 'completed',
        totalClasses: 22,
        totalEntries: 168,
        totalRevenue: 287600.00,
        createdAt: new Date('2025-09-20'),
        updatedAt: new Date('2025-12-18')
      }
    ];
    return of(mockCompetitions).pipe(delay(500));
  }

  getCompetitionById(id: string): Observable<any> {
    const mockCompetition = {
      id: id,
      name: 'Spring Dressage Championship 2026',
      startDate: new Date('2026-04-15'),
      endDate: new Date('2026-04-17'),
      venue: 'Cape Town Equestrian Centre',
      city: 'Cape Town',
      province: 'Western Cape',
      status: 'published',
      totalClasses: 24,
      totalEntries: 156,
      totalRevenue: 234500.00,
      createdAt: new Date('2026-01-10'),
      updatedAt: new Date('2026-03-05'),
      description: 'Annual spring championship featuring all levels of dressage competition',
      contactEmail: 'entries@ctequestrian.co.za',
      contactPhone: '+27 21 555 0123',
      closingDate: new Date('2026-04-08'),
      maxEntries: 200
    };
    return of(mockCompetition).pipe(delay(300));
  }

  deleteCompetition(id: string): Observable<any> {
    return of({ success: true, message: 'Competition deleted successfully' }).pipe(delay(500));
  }

  // Extras Management Methods
  getExtras(): Observable<any[]> {
    const mockExtras = [
      {
        id: 'extra-001',
        name: 'Stable per night',
        description: 'Overnight stabling for one horse',
        price: 150.00,
        category: 'stabling',
        isActive: true,
        createdAt: new Date('2026-01-10'),
        updatedAt: new Date('2026-03-01')
      },
      {
        id: 'extra-002',
        name: 'Hay bale',
        description: 'Premium quality hay bale',
        price: 85.00,
        category: 'feed',
        isActive: true,
        createdAt: new Date('2026-01-10'),
        updatedAt: new Date('2026-02-15')
      },
      {
        id: 'extra-003',
        name: 'Shavings bedding',
        description: 'Wood shavings bedding per bag',
        price: 65.00,
        category: 'bedding',
        isActive: true,
        createdAt: new Date('2026-01-10'),
        updatedAt: new Date('2026-02-20')
      },
      {
        id: 'extra-004',
        name: 'Grooming service',
        description: 'Professional grooming service',
        price: 200.00,
        category: 'services',
        isActive: true,
        createdAt: new Date('2026-01-15'),
        updatedAt: new Date('2026-03-05')
      },
      {
        id: 'extra-005',
        name: 'Veterinary check',
        description: 'Pre-competition veterinary inspection',
        price: 350.00,
        category: 'services',
        isActive: false,
        createdAt: new Date('2026-01-20'),
        updatedAt: new Date('2026-02-28')
      }
    ];
    return of(mockExtras).pipe(delay(500));
  }

  createExtra(data: any): Observable<any> {
    return of({ success: true, message: 'Extra created successfully', data }).pipe(delay(500));
  }

  updateExtra(id: string, data: any): Observable<any> {
    return of({ success: true, message: 'Extra updated successfully', data }).pipe(delay(500));
  }

  deleteExtra(id: string): Observable<any> {
    return of({ success: true, message: 'Extra deleted successfully' }).pipe(delay(500));
  }

  // Levies Management Methods
  getLevies(): Observable<any[]> {
    const mockLevies = [
      {
        id: 'levy-001',
        name: 'SAEF Levy',
        description: 'South African Equestrian Federation levy per entry',
        amount: 25.00,
        type: 'fixed',
        applicableTo: 'entry',
        isActive: true,
        createdAt: new Date('2026-01-10'),
        updatedAt: new Date('2026-03-01')
      },
      {
        id: 'levy-002',
        name: 'Provincial Levy',
        description: 'Provincial association levy',
        amount: 15.00,
        type: 'fixed',
        applicableTo: 'entry',
        isActive: true,
        createdAt: new Date('2026-01-10'),
        updatedAt: new Date('2026-02-15')
      },
      {
        id: 'levy-003',
        name: 'Administration Fee',
        description: 'Competition administration fee',
        amount: 5,
        type: 'percentage',
        applicableTo: 'competition',
        isActive: true,
        createdAt: new Date('2026-01-15'),
        updatedAt: new Date('2026-03-05')
      }
    ];
    return of(mockLevies).pipe(delay(500));
  }

  createLevy(data: any): Observable<any> {
    return of({ success: true, message: 'Levy created successfully', data }).pipe(delay(500));
  }

  updateLevy(id: string, data: any): Observable<any> {
    return of({ success: true, message: 'Levy updated successfully', data }).pipe(delay(500));
  }

  deleteLevy(id: string): Observable<any> {
    return of({ success: true, message: 'Levy deleted successfully' }).pipe(delay(500));
  }

  // Arenas Management Methods
  getArenas(): Observable<any[]> {
    const mockArenas = [
      {
        id: 'arena-001',
        name: 'Main Arena',
        description: 'Primary competition arena with premium surface',
        size: '60m x 20m',
        surface: 'Sand and fiber mix',
        capacity: 500,
        isActive: true,
        createdAt: new Date('2026-01-10'),
        updatedAt: new Date('2026-03-01')
      },
      {
        id: 'arena-002',
        name: 'Practice Arena',
        description: 'Warm-up and practice arena',
        size: '40m x 20m',
        surface: 'Sand',
        capacity: 200,
        isActive: true,
        createdAt: new Date('2026-01-10'),
        updatedAt: new Date('2026-02-15')
      }
    ];
    return of(mockArenas).pipe(delay(500));
  }

  createArena(data: any): Observable<any> {
    return of({ success: true, message: 'Arena created successfully', data }).pipe(delay(500));
  }

  updateArena(id: string, data: any): Observable<any> {
    return of({ success: true, message: 'Arena updated successfully', data }).pipe(delay(500));
  }

  deleteArena(id: string): Observable<any> {
    return of({ success: true, message: 'Arena deleted successfully' }).pipe(delay(500));
  }

  // Payment Methods Management
  getPaymentMethods(): Observable<any[]> {
    const mockPaymentMethods = [
      {
        id: 'pm-001',
        name: 'Electronic Funds Transfer (EFT)',
        description: 'Direct bank transfer',
        isActive: true,
        processingFee: 0,
        createdAt: new Date('2026-01-10'),
        updatedAt: new Date('2026-03-01')
      },
      {
        id: 'pm-002',
        name: 'Credit Card',
        description: 'Visa, Mastercard payments',
        isActive: true,
        processingFee: 2.5,
        createdAt: new Date('2026-01-10'),
        updatedAt: new Date('2026-02-15')
      }
    ];
    return of(mockPaymentMethods).pipe(delay(500));
  }

  updatePaymentMethod(id: string, data: any): Observable<any> {
    return of({ success: true, message: 'Payment method updated successfully', data }).pipe(delay(500));
  }
}


