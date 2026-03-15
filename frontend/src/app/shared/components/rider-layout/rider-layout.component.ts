import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { RiderNavbarComponent } from '../rider-navbar/rider-navbar.component';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-rider-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RiderNavbarComponent],
  template: `
    <div
      class="rider-layout coming-soon-shell"
      [style.--landing-bg-image]="backgroundImageStyle">
      <div class="shell-background" aria-hidden="true"></div>
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
      position: relative;
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      background: #070b16;
    }

    .shell-background {
      position: fixed;
      inset: 0;
      background-image:
        linear-gradient(180deg, rgba(7, 11, 22, 0.62), rgba(7, 11, 22, 0.94)),
        var(--landing-bg-image);
      background-position: center;
      background-repeat: no-repeat;
      background-size: cover;
      opacity: 0.84;
      pointer-events: none;
      z-index: 0;
    }

    .rider-content {
      flex: 1;
      padding: 0;
      position: relative;
      z-index: 1;
    }

    .rider-footer {
      position: relative;
      z-index: 1;
      padding: 24px 20px 32px;
      text-align: center;
      color: rgba(255, 255, 255, 0.74);
      font-size: 14px;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      background: linear-gradient(180deg, rgba(10, 14, 29, 0.18), rgba(10, 14, 29, 0.55));
      backdrop-filter: blur(12px);

      p {
        margin: 0;
      }
    }
  `]
})
export class RiderLayoutComponent {
  readonly backgroundImageStyle = `url('${environment.landingBackgroundImageUrl}')`;
}

