import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { PublicNavbarComponent } from '../public-navbar/public-navbar.component';
import { PublicFooterComponent } from '../public-footer/public-footer.component';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, PublicNavbarComponent, PublicFooterComponent],
  template: `
    <div
      class="public-layout coming-soon-shell"
      [style.--landing-bg-image]="backgroundImageStyle">
      <div class="shell-background" aria-hidden="true"></div>
      <app-public-navbar></app-public-navbar>
      <main class="public-content">
        <router-outlet></router-outlet>
      </main>
      <app-public-footer></app-public-footer>
    </div>
  `,
  styles: [`
    .public-layout {
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
        linear-gradient(180deg, rgba(7, 11, 22, 0.55), rgba(7, 11, 22, 0.92)),
        var(--landing-bg-image);
      background-position: center;
      background-repeat: no-repeat;
      background-size: cover;
      opacity: 0.9;
      pointer-events: none;
      z-index: 0;
    }

    .public-content {
      flex: 1;
      position: relative;
      z-index: 1;
    }

    app-public-navbar,
    app-public-footer {
      position: relative;
      z-index: 1;
    }
  `]
})
export class PublicLayoutComponent {
  readonly backgroundImageStyle = `url('${environment.landingBackgroundImageUrl}')`;
}


