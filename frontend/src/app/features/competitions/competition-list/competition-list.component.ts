import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-competition-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container-fluid">
      <h2>Competitions</h2>
      <p>Browse and enter upcoming competitions</p>
    </div>
  `
})
export class CompetitionListComponent {}

