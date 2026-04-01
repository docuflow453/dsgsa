/**
 * Temporary Memberships Report Component
 * List of temporary/short-term memberships
 */

import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

// Shared Module
import { SharedModule } from '../../../../theme/shared/shared.module';

// Types for future implementation
export interface TemporaryMembershipData {
  id: number;
  memberNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  membershipType: string;
  startDate: Date;
  endDate: Date;
  duration: number;
  purpose: string;
  event: string;
  status: string;
  club: string;
  province: string;
  renewalEligible: boolean;
  convertedToPermanent: boolean;
}

@Component({
  selector: 'app-temporary-memberships-report',
  standalone: true,
  imports: [SharedModule, RouterModule],
  templateUrl: './temporary-memberships-report.component.html',
  styleUrl: './temporary-memberships-report.component.scss'
})
export class TemporaryMembershipsReportComponent {
  // Placeholder for future implementation
  reportTitle = 'Temporary Memberships Report';
  reportDescription = 'List of temporary and short-term memberships with expiry tracking';
}

