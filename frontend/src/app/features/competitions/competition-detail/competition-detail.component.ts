import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-competition-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container-fluid">
      <h2>Competition Details</h2>
      <p>View competition information and classes</p>
    </div>
  `
})
export class CompetitionDetailComponent {}

