import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-club-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container-fluid">
      <h2>Club Dashboard</h2>
      <p>Manage club members and activities</p>
    </div>
  `
})
export class ClubDashboardComponent {}

