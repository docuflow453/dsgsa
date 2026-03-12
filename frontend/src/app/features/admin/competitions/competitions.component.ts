import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-competitions',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container-fluid">
      <h2>Competition Management</h2>
      <p>Manage competitions and classes</p>
    </div>
  `
})
export class AdminCompetitionsComponent {}

