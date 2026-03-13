import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { RiderNavbarComponent } from '../rider-navbar/rider-navbar.component';

@Component({
  selector: 'app-rider-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RiderNavbarComponent],
  template: `
    <div class="rider-layout">
      <app-rider-navbar></app-rider-navbar>
      <main class="rider-content">
        <router-outlet></router-outlet>
      </main>
      <footer class="rider-footer">
        <p>© 2026 DSRiding. All rights reserved.</p>
      </footer>
    </div>
  `,
  styles: [`
    .rider-layout {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      background-color: #f5f5f5;
    }

    .rider-content {
      flex: 1;
      padding: 0;
    }

    .rider-footer {
      background-color: #ffffff;
      border-top: 1px solid #e5e7eb;
      padding: 20px;
      text-align: center;
      color: #6b7280;
      font-size: 14px;

      p {
        margin: 0;
      }
    }
  `]
})
export class RiderLayoutComponent {}

