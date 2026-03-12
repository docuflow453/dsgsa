import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-competition-entry',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container-fluid">
      <h2>Competition Entry</h2>
      <p>Enter a competition</p>
    </div>
  `
})
export class CompetitionEntryComponent {}

