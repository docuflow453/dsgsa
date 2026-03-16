/**
 * Rider Feature Module - Data Models
 */

export interface Address {
  street: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
}

export interface Membership {
  status: 'Active' | 'Pending' | 'Expired' | 'Suspended';
  type: string;
  validFrom: Date;
  validUntil: Date;
  membershipNumber: string;
}

export interface NotificationPreferences {
  emailUpcomingEntries: boolean;
  smsResults: boolean;
  monthlyNewsletter: boolean;
  marketingCommunications: boolean;
}

export interface Rider {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  idNumber: string;
  email: string;
  phone: string;
  dateOfBirth: Date;
  address: Address;
  clubId: string;
  clubName?: string;
  grade?: string;
  membership: Membership;
  preferences: NotificationPreferences;
  joinDate: Date;
  profileImage?: string;
}

export interface Horse {
  id: string;
  riderId: string;
  name: string;
  registeredName: string;
  breed: string;
  dateOfBirth: Date;
  age?: number;
  gender: 'Gelding' | 'Mare' | 'Stallion';
  microchip: string;
  passportNumber: string;
  grade: string;
  status: 'Active' | 'Inactive' | 'Retired';
  documents?: Document[];
  imageUrl?: string;
}

export interface TestEntry {
  id: string;
  testName: string;
  testLevel: string;
  className: string;
  time?: string;
  score?: number;
  percentage?: number;
  placing?: number;
}

export interface Entry {
  id: string;
  eventId: string;
  eventName: string;
  eventDate: Date;
  venue?: string;
  riderId: string;
  horseId: string;
  horseName?: string;
  tests: TestEntry[];
  status: 'Draft' | 'Entered' | 'Confirmed' | 'Withdrawn' | 'Completed';
  paymentStatus: 'Pending' | 'Paid' | 'Refunded';
  totalAmount?: number;
  createdAt: Date;
}

export interface Transaction {
  id: string;
  riderId: string;
  date: Date;
  type: 'Entry' | 'Membership' | 'Registration' | 'Other';
  description: string;
  reference: string;
  amount: number;
  status: 'Pending' | 'Paid' | 'Failed' | 'Refunded';
  paymentMethod?: string;
  receiptUrl?: string;
  dueDate?: Date;
}

export interface DashboardStats {
  upcomingEntries: number;
  registeredHorses: number;
  eventsThisSeason: number;
  pendingResults: number;
  totalSpent: number;
  pendingPayments: number;
}

export interface Result {
  id: string;
  eventName: string;
  eventDate: Date;
  testName: string;
  horseName: string;
  score: number;
  percentage: number;
  placing: number;
  totalCompetitors?: number;
}

