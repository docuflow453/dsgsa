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

export interface HorseVaccination {
  id: string;
  horseId: string;
  vaccinationType: string;
  vaccinationDate: Date;
  expiryDate?: Date;
  batchNumber?: string;
  veterinarian?: string;
  notes?: string;
}

export interface HorseDocument {
  id: string;
  horseId: string;
  documentType: 'Passport' | 'Registration' | 'Vaccination' | 'Medical' | 'Other';
  title: string;
  fileName: string;
  fileUrl: string;
  uploadDate: Date;
  expiryDate?: Date;
  notes?: string;
}

export interface HorseAffiliation {
  id: string;
  horseId: string;
  organizationName: string;
  registrationNumber: string;
  registrationDate: Date;
  expiryDate?: Date;
  status: 'Active' | 'Expired' | 'Pending';
}

export interface HorseOwnership {
  id: string;
  horseId: string;
  ownerName: string;
  ownerEmail?: string;
  ownerPhone?: string;
  ownershipStartDate: Date;
  ownershipEndDate?: Date;
  isCurrent: boolean;
  transferReason?: string;
  notes?: string;
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
  color?: string;
  height?: number;
  markings?: string;
  microchip: string;
  passportNumber: string;
  feiNumber?: string;
  grade: string;
  status: 'Active' | 'Inactive' | 'Retired';
  vaccinations?: HorseVaccination[];
  documents?: HorseDocument[];
  affiliations?: HorseAffiliation[];
  ownershipHistory?: HorseOwnership[];
  imageUrl?: string;
  sire?: string;
  dam?: string;
  breeder?: string;
  owner?: string;
  notes?: string;
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

export interface Club {
  id: string;
  name: string;
  abbreviation?: string;
  province: string;
  city: string;
  contactPerson?: string;
  contactEmail?: string;
  contactPhone?: string;
  website?: string;
  status: 'Active' | 'Inactive';
  memberCount?: number;
}

export interface RiderClub {
  id: string;
  riderId: string;
  clubId: string;
  club: Club;
  isPrimary: boolean;
  affiliatedDate: Date;
  status: 'Active' | 'Inactive';
}

export interface MembershipType {
  id: string;
  name: string;
  code: string;
  description?: string;
  isActive: boolean;
}

export interface Year {
  id: string;
  title: string;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
}

export interface Subscription {
  id: string;
  name: string;
  description: string;
  fee: number;
  yearId: string;
  yearTitle: string;
  membershipIds: string[];
  membershipNames: string[];
  isOfficial: boolean;
  isRecreational: boolean;
  isActive: boolean;
}

export interface SaefMembership {
  id: string;
  riderId: string;
  riderName: string;
  yearId: string;
  yearTitle: string;
  approvedAt?: Date;
  approvedBy?: string;
  approvedByName?: string;
  createdAt: Date;
  updatedAt: Date;
  status: 'Pending' | 'Active' | 'Expired';
}

export interface MembershipType {
  id: string;
  name: string;
  code: string;
  description?: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface MembershipApplication {
  membershipTypeId: string;
  subscriptionId?: string;
  yearId: string;
  acceptTerms: boolean;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  riderId: string;
  riderName: string;
  issueDate: Date;
  dueDate: Date;
  status: 'Draft' | 'Pending' | 'Paid' | 'Overdue' | 'Cancelled';
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  paidAmount: number;
  paidDate?: Date;
  paymentMethod?: string;
  notes?: string;
  type: 'Membership' | 'Entry Fee' | 'Subscription' | 'Other';
}

export interface Competition {
  id: string;
  name: string;
  slug: string;
  competitionType: 'dressage' | 'show_jumping' | 'eventing' | 'combined';
  startDate: Date;
  endDate: Date;
  venue: string;
  city: string;
  province: string;
  closingDate: Date;
  status: 'draft' | 'published' | 'ongoing' | 'completed' | 'cancelled';
  description?: string;
  contactEmail?: string;
  contactPhone?: string;
  maxEntries?: number;
  totalClasses?: number;
  totalEntries?: number;
}

export interface CompetitionClass {
  id: string;
  competitionId: string;
  name: string;
  grade?: string;
  classType?: string;
  fee: number;
  approximateStartTime?: string;
  description?: string;
  isActive: boolean;
}

export interface CompetitionExtra {
  id: string;
  competitionId: string;
  name: string;
  description?: string;
  price: number;
  quantity?: number;
  isStable: boolean;
  isActive: boolean;
}

export interface EntryWizardState {
  competition?: Competition;
  riderId?: string;
  riderName?: string;
  isCurrentUserRider: boolean;
  horseId?: string;
  horseName?: string;
  selectedClasses: CompetitionClass[];
  selectedExtras: { extra: CompetitionExtra; quantity: number }[];
  totalAmount: number;
}

export interface CreateEntryRequest {
  competitionId: string;
  riderId: string;
  horseId: string;
  classes: string[];
  extras?: { extraId: string; quantity: number }[];
}

