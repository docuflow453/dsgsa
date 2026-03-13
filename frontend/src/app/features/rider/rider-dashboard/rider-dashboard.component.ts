import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '@core/services/auth.service';

interface StatCard {
  value: number;
  label: string;
  icon: string;
  color: string;
}

interface UpcomingEntry {
  event: string;
  date: string;
  horse: string;
  class: string;
  status: 'Confirmed' | 'Pending';
}

interface RecentResult {
  position: number;
  event: string;
  details: string;
  date: string;
}

@Component({
  selector: 'app-rider-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './rider-dashboard.component.html',
  styleUrls: ['./rider-dashboard.component.scss']
})
export class RiderDashboardComponent implements OnInit {
  authService = inject(AuthService);

  upcomingEntriesCount = 4;
  nextEventDays = 9;

  stats: StatCard[] = [
    { value: 4, label: 'Upcoming Entries', icon: 'bi-calendar-check', color: 'yellow' },
    { value: 3, label: 'Registered Horses', icon: 'bi-heart', color: 'gray' },
    { value: 12, label: 'Events This Season', icon: 'bi-calendar-event', color: 'green' },
    { value: 7, label: 'Podium Finishes', icon: 'bi-trophy', color: 'red' }
  ];

  upcomingEntries: UpcomingEntry[] = [
    {
      event: 'Spring Classic Show',
      date: 'Mar 22, 2026',
      horse: 'Thunder Bay',
      class: 'Hunter 3\'',
      status: 'Confirmed'
    },
    {
      event: 'Riverside Open',
      date: 'Apr 05, 2026',
      horse: 'Silver Mist',
      class: 'Jumper 1.10m',
      status: 'Confirmed'
    },
    {
      event: 'Lakeside Dressage Cup',
      date: 'Apr 18, 2026',
      horse: 'Noble Star',
      class: 'Training Level',
      status: 'Pending'
    },
    {
      event: 'Grand Prix Qualifier',
      date: 'May 02, 2026',
      horse: 'Thunder Bay',
      class: 'Jumper 1.30m',
      status: 'Confirmed'
    }
  ];

  recentResults: RecentResult[] = [
    {
      position: 1,
      event: 'Winter Championship',
      details: 'Thunder Bay · Jumper 1.20m',
      date: 'Feb 28, 2026'
    },
    {
      position: 3,
      event: 'Valley Classic',
      details: 'Silver Mist · Hunter 3\'',
      date: 'Feb 14, 2026'
    },
    {
      position: 2,
      event: 'City Equestrian Cup',
      details: 'Noble Star · Dressage Training',
      date: 'Jan 30, 2026'
    }
  ];

  ngOnInit(): void {
    // Load rider dashboard data
  }

  getPositionClass(position: number): string {
    if (position === 1) return 'gold';
    if (position === 2) return 'silver';
    if (position === 3) return 'bronze';
    return 'other';
  }

  getPositionSuffix(position: number): string {
    if (position === 1) return 'st';
    if (position === 2) return 'nd';
    if (position === 3) return 'rd';
    return 'th';
  }
}

