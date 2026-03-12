import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-horse-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container-fluid">
      <h2>Horse Details</h2>
      <p>View horse information</p>
    </div>
  `
})
export class HorseDetailComponent {}

