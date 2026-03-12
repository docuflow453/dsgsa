import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { PublicNavbarComponent } from '../public-navbar/public-navbar.component';
import { PublicFooterComponent } from '../public-footer/public-footer.component';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, PublicNavbarComponent, PublicFooterComponent],
  template: `
    <div class="public-layout">
      <app-public-navbar></app-public-navbar>
      <main class="public-content">
        <router-outlet></router-outlet>
      </main>
      <app-public-footer></app-public-footer>
    </div>
  `,
  styles: [`
    .public-layout {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }

    .public-content {
      flex: 1;
    }
  `]
})
export class PublicLayoutComponent {}

