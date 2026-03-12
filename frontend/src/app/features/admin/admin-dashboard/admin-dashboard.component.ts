import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container-fluid">
      <h2>Admin Dashboard</h2>
      <p>System administration and management</p>
    </div>
  `
})
export class AdminDashboardComponent {}

