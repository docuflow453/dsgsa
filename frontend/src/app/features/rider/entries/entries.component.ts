import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-entries',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container-fluid">
      <h2>My Entries</h2>
      <p>View and manage your competition entries</p>
    </div>
  `
})
export class EntriesComponent {}

