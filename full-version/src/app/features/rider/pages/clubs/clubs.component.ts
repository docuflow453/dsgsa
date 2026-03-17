import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule, NgbTypeaheadSelectItemEvent } from '@ng-bootstrap/ng-bootstrap';
import { Observable, OperatorFunction } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { RiderService } from '../../services/rider.service';
import { Club, RiderClub } from '../../models/rider.model';

/**
 * Clubs Component - Manage rider's club affiliations
 */
@Component({
  selector: 'app-clubs',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbModule],
  templateUrl: './clubs.component.html',
  styleUrls: ['./clubs.component.scss']
})
export class ClubsComponent implements OnInit {
  riderClubs: RiderClub[] = [];
  loading = false;
  showAddForm = false;
  searchModel: any;
  selectedClub: Club | null = null;
  isPrimary = false;
  submitting = false;
  errorMessage = '';

  constructor(private riderService: RiderService) {}

  ngOnInit(): void {
    this.loadRiderClubs();
  }

  loadRiderClubs(): void {
    this.loading = true;
    this.riderService.getRiderClubs().subscribe({
      next: (clubs) => {
        this.riderClubs = clubs;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading clubs:', error);
        this.loading = false;
      }
    });
  }

  toggleAddForm(): void {
    this.showAddForm = !this.showAddForm;
    if (!this.showAddForm) {
      this.resetForm();
    }
  }

  resetForm(): void {
    this.searchModel = null;
    this.selectedClub = null;
    this.isPrimary = false;
    this.errorMessage = '';
  }

  // Typeahead search function
  search: OperatorFunction<string, readonly Club[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(term => 
        term.length < 2 
          ? of([]) 
          : this.riderService.searchClubs(term).pipe(
              catchError(() => of([]))
            )
      )
    );

  // Format result for display in dropdown
  formatter = (club: Club) => club.name;

  // Handle club selection from typeahead
  onClubSelect(event: NgbTypeaheadSelectItemEvent<Club>): void {
    this.selectedClub = event.item;
  }

  // Add club affiliation
  addClub(): void {
    if (!this.selectedClub) {
      this.errorMessage = 'Please select a club from the list';
      return;
    }

    // Check if already affiliated
    const alreadyAffiliated = this.riderClubs.some(rc => rc.clubId === this.selectedClub!.id);
    if (alreadyAffiliated) {
      this.errorMessage = 'You are already affiliated with this club';
      return;
    }

    this.submitting = true;
    this.errorMessage = '';

    this.riderService.addClubAffiliation(this.selectedClub.id, this.isPrimary).subscribe({
      next: (riderClub) => {
        this.riderClubs.push(riderClub);
        this.submitting = false;
        this.toggleAddForm();
        this.loadRiderClubs(); // Reload to get fresh data
      },
      error: (error) => {
        console.error('Error adding club:', error);
        this.errorMessage = 'Failed to add club affiliation. Please try again.';
        this.submitting = false;
      }
    });
  }

  // Remove club affiliation
  removeClub(riderClub: RiderClub): void {
    if (!confirm(`Are you sure you want to remove your affiliation with ${riderClub.club.name}?`)) {
      return;
    }

    this.riderService.removeClubAffiliation(riderClub.id).subscribe({
      next: () => {
        this.riderClubs = this.riderClubs.filter(rc => rc.id !== riderClub.id);
      },
      error: (error) => {
        console.error('Error removing club:', error);
        alert('Failed to remove club affiliation. Please try again.');
      }
    });
  }

  // Set primary club
  setPrimary(riderClub: RiderClub): void {
    this.riderService.setPrimaryClub(riderClub.id).subscribe({
      next: () => {
        // Update local state
        this.riderClubs.forEach(rc => {
          rc.isPrimary = rc.id === riderClub.id;
        });
      },
      error: (error) => {
        console.error('Error setting primary club:', error);
        alert('Failed to set primary club. Please try again.');
      }
    });
  }
}

