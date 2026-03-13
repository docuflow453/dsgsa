import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-rider-horses',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>My Horses</h1>
        <p>Manage your registered horses</p>
      </div>
      <div class="page-content">
        <p>Horses page content coming soon...</p>
      </div>
    </div>
  `,
  styles: [`
    .page-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 32px 24px;
    }
    .page-header {
      margin-bottom: 24px;
      h1 {
        font-size: 28px;
        font-weight: 700;
        margin: 0 0 8px 0;
      }
      p {
        color: #6b7280;
        margin: 0;
      }
    }
    .page-content {
      background: #ffffff;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }
  `]
})
export class RiderHorsesComponent {}

