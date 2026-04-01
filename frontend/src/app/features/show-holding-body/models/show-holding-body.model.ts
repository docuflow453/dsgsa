/**
 * Show Holding Body Models
 */

export interface ShowHoldingBody {
  id: string;
  name: string;
  registrationNumber: string;
  email: string;
  phone: string;
  website?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
  primaryContactName: string;
  primaryContactEmail: string;
  primaryContactPhone: string;
  bankName?: string;
  accountNumber?: string;
  branchCode?: string;
  accountType?: string;
  accountHolderName?: string;
  notificationPreferences: NotificationPreferences;
  timezone: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export interface NotificationPreferences {
  emailNotifications: boolean;
  smsNotifications: boolean;
  newMemberRequests: boolean;
  competitionUpdates: boolean;
  paymentNotifications: boolean;
  systemAnnouncements: boolean;
}

export interface DashboardStats {
  totalCompetitions: number;
  upcomingEvents: number;
  totalEntries: number;
  totalRevenue: number;
  pendingApprovals: number;
  approvedMembers: number;
  recentActivity: ActivityItem[];
}

export interface ActivityItem {
  id: string;
  type: 'member_request' | 'competition_entry' | 'payment' | 'competition_created';
  title: string;
  description: string;
  timestamp: Date;
  icon: string;
  iconColor: string;
}

export interface Member {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  membershipNumber: string;
  profileImage?: string;
  horses: MemberHorse[];
  dateRequested: Date;
  dateApproved?: Date;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  totalEntries: number;
  lastActivity: Date;
}

export interface MemberHorse {
  id: string;
  name: string;
  registeredName: string;
  breed: string;
}

export interface MemberApprovalRequest {
  memberId: string;
  notes?: string;
}

export interface MemberRejectionRequest {
  memberId: string;
  reason: string;
}

export interface Competition {
  id: string;
  name: string;
  date: Date;
  venue: string;
  totalEntries: number;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
}

export interface RevenueData {
  month: string;
  amount: number;
}

export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

export interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor?: string | string[];
  borderColor?: string | string[];
  borderWidth?: number;
}

