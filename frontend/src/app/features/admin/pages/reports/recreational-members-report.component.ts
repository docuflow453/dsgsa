/**
 * Recreational Members Report Component
 * List of non-competitive/recreational members
 */

import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

// Shared Module
import { SharedModule } from '../../../../theme/shared/shared.module';

// Types for future implementation
export interface RecreationalMemberData {
  id: number;
  memberNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  membershipType: string;
  joinDate: Date;
  expiryDate: Date;
  club: string;
  province: string;
  horseCount: number;
  participationLevel: string;
  interests: string[];
  lastActivityDate: Date;
}

@Component({
  selector: 'app-recreational-members-report',
  standalone: true,
  imports: [SharedModule, RouterModule],
  templateUrl: './recreational-members-report.component.html',
  styleUrl: './recreational-members-report.component.scss'
})
export class RecreationalMembersReportComponent {
  // Placeholder for future implementation
  reportTitle = 'Recreational Members Report';
  reportDescription = 'List of non-competitive and recreational members with activity tracking';
}

