import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Competition {
  id: number;
  name: string;
  date: string;
  location: string;
  province: string;
  status: 'upcoming' | 'open' | 'closed';
  entryClose: string;
}

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent {
  competitions: Competition[] = [
    {
      id: 1,
      name: 'Spring Dressage Championship',
      date: '2026-04-15',
      location: 'Johannesburg Equestrian Centre',
      province: 'Gauteng',
      status: 'open',
      entryClose: '2026-04-08'
    },
    {
      id: 2,
      name: 'Western Cape Provincial Show',
      date: '2026-04-22',
      location: 'Cape Town Riding Club',
      province: 'Western Cape',
      status: 'open',
      entryClose: '2026-04-15'
    },
    {
      id: 3,
      name: 'KZN Dressage Festival',
      date: '2026-05-06',
      location: 'Durban Equestrian Park',
      province: 'KwaZulu-Natal',
      status: 'upcoming',
      entryClose: '2026-04-29'
    },
    {
      id: 4,
      name: 'National Dressage Championships',
      date: '2026-06-12',
      location: 'Pretoria Show Grounds',
      province: 'Gauteng',
      status: 'upcoming',
      entryClose: '2026-06-05'
    }
  ];

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'open':
        return 'badge bg-success';
      case 'upcoming':
        return 'badge bg-primary';
      case 'closed':
        return 'badge bg-secondary';
      default:
        return 'badge bg-secondary';
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-ZA', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }
}

