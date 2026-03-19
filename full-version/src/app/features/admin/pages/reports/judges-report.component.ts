/**
 * Judges Report Component
 * Directory of registered judges with their qualifications and status
 */

import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

// Shared Module
import { SharedModule } from '../../../../theme/shared/shared.module';

// Types for future implementation
export interface JudgeReportData {
  id: number;
  judgeNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: string;
  level: string;
  qualifications: string[];
  certificationDate: Date;
  expiryDate: Date;
  province: string;
  country: string;
  judgedCompetitions: number;
  lastJudgedDate: Date;
  specializations: string[];
  availabilityStatus: string;
}

@Component({
  selector: 'app-judges-report',
  standalone: true,
  imports: [SharedModule, RouterModule],
  templateUrl: './judges-report.component.html',
  styleUrl: './judges-report.component.scss'
})
export class JudgesReportComponent {
  // Placeholder for future implementation
  reportTitle = 'Judges Report';
  reportDescription = 'Comprehensive directory of registered judges with qualifications and status';
}

