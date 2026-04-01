import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CompetitionService } from '../../../services/competition.service';
import { EntryWizardService } from '../../../services/entry-wizard.service';
import { Competition, CompetitionClass, CompetitionExtra } from '../../../models/rider.model';

@Component({
  selector: 'app-competition-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './competition-detail.component.html',
  styleUrls: ['./competition-detail.component.scss']
})
export class CompetitionDetailComponent implements OnInit {
  competition: Competition | null = null;
  competitionClasses: CompetitionClass[] = [];
  competitionExtras: CompetitionExtra[] = [];
  loading = true;
  competitionId: string = '';
  activeTab = 'overview';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private competitionService: CompetitionService,
    private wizardService: EntryWizardService
  ) {}

  ngOnInit(): void {
    this.competitionId = this.route.snapshot.paramMap.get('id') || '';
    this.loadCompetitionDetails();
  }

  loadCompetitionDetails(): void {
    this.loading = true;

    // Load competition details
    this.competitionService.getCompetitionBySlug(this.competitionId).subscribe({
      next: (competition) => {
        this.competition = competition;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading competition:', error);
        this.loading = false;
      }
    });

    // Load competition classes
    this.competitionService.getCompetitionClasses(this.competitionId).subscribe({
      next: (classes) => {
        this.competitionClasses = classes;
      },
      error: (error) => {
        console.error('Error loading classes:', error);
      }
    });

    // Load competition extras
    this.competitionService.getCompetitionExtras(this.competitionId).subscribe({
      next: (extras) => {
        this.competitionExtras = extras;
      },
      error: (error) => {
        console.error('Error loading extras:', error);
      }
    });
  }

  enterOnline(): void {
    if (this.competition) {
      this.wizardService.setCompetition(this.competition);
      this.router.navigate(['/my/entries/entry-details', this.competition.slug]);
    }
  }

  backToCalendar(): void {
    this.router.navigate(['/my/calendar']);
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-ZA', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR'
    }).format(amount);
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

  isClosed(closingDate: Date): boolean {
    return this.getDaysUntilClosing(closingDate) < 0;
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  getGradeLabel(grade: string): string {
    const gradeMap: { [key: string]: string } = {
      'preliminary': 'Preliminary',
      'novice': 'Novice',
      'elementary': 'Elementary',
      'medium': 'Medium',
      'advanced': 'Advanced',
      'prix_st_georges': 'Prix St. Georges',
      'intermediate_i': 'Intermediate I',
      'intermediate_ii': 'Intermediate II',
      'grand_prix': 'Grand Prix'
    };
    return gradeMap[grade] || grade;
  }
}

