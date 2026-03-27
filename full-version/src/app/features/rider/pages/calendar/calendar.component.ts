import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CompetitionService } from '../../services/competition.service';
import { Competition } from '../../models/rider.model';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
  competitions: Competition[] = [];
  filteredCompetitions: Competition[] = [];
  loading = true;
  searchQuery = '';
  selectedProvince = 'all';
  selectedMonth = 'all';

  provinces = [
    'Eastern Cape',
    'Free State',
    'Gauteng',
    'KwaZulu-Natal',
    'Limpopo',
    'Mpumalanga',
    'Northern Cape',
    'North West',
    'Western Cape'
  ];

  months = [
    { value: 0, label: 'January' },
    { value: 1, label: 'February' },
    { value: 2, label: 'March' },
    { value: 3, label: 'April' },
    { value: 4, label: 'May' },
    { value: 5, label: 'June' },
    { value: 6, label: 'July' },
    { value: 7, label: 'August' },
    { value: 8, label: 'September' },
    { value: 9, label: 'October' },
    { value: 10, label: 'November' },
    { value: 11, label: 'December' }
  ];

  constructor(
    private competitionService: CompetitionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCompetitions();
  }

  loadCompetitions(): void {
    this.loading = true;
    this.competitionService.getOpenCompetitions().subscribe({
      next: (competitions) => {
        this.competitions = competitions;
        this.filteredCompetitions = competitions;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading competitions:', error);
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    let filtered = this.competitions;

    // Search filter
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(comp =>
        comp.name.toLowerCase().includes(query) ||
        comp.venue.toLowerCase().includes(query) ||
        comp.city.toLowerCase().includes(query)
      );
    }

    // Province filter
    if (this.selectedProvince !== 'all') {
      filtered = filtered.filter(comp => comp.province === this.selectedProvince);
    }

    // Month filter
    if (this.selectedMonth !== 'all') {
      const monthNum = parseInt(this.selectedMonth);
      filtered = filtered.filter(comp => new Date(comp.startDate).getMonth() === monthNum);
    }

    this.filteredCompetitions = filtered;
  }

  viewCompetition(competition: Competition): void {
    this.router.navigate(['/my/calendar', competition.id]);
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-ZA', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }

  getDaysUntilClosing(closingDate: Date): number {
    const today = new Date();
    const closing = new Date(closingDate);
    const diffTime = closing.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  isClosingSoon(closingDate: Date): boolean {
    return this.getDaysUntilClosing(closingDate) <= 7 && this.getDaysUntilClosing(closingDate) > 0;
  }

  isClosingToday(closingDate: Date): boolean {
    return this.getDaysUntilClosing(closingDate) === 0;
  }

  isClosed(closingDate: Date): boolean {
    return this.getDaysUntilClosing(closingDate) < 0;
  }

  getStatusBadgeClass(competition: Competition): string {
    if (this.isClosed(competition.closingDate)) {
      return 'bg-secondary';
    }
    if (this.isClosingToday(competition.closingDate)) {
      return 'bg-danger';
    }
    if (this.isClosingSoon(competition.closingDate)) {
      return 'bg-warning';
    }
    return 'bg-success';
  }

  getStatusText(competition: Competition): string {
    if (this.isClosed(competition.closingDate)) {
      return 'Closed';
    }
    if (this.isClosingToday(competition.closingDate)) {
      return 'Closing Today';
    }
    if (this.isClosingSoon(competition.closingDate)) {
      return 'Closing Soon';
    }
    return 'Open';
  }
}

