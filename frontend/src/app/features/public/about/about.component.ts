import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <div class="container">
          <h1>About DSRiding</h1>
          <p>South Africa's Premier Dressage Competition Management Platform</p>
        </div>
      </div>

      <div class="container py-5">
        <div class="row mb-5">
          <div class="col-lg-8 mx-auto">
            <h2 class="mb-4">Our Mission</h2>
            <p class="lead">
              To provide a comprehensive, user-friendly platform that connects the South African 
              dressage community and streamlines competition management from entry to results.
            </p>
            <p>
              DSRiding was created to address the unique needs of the South African equestrian 
              community, providing a centralized system for managing competitions, entries, 
              payments, and results across all nine provinces.
            </p>
          </div>
        </div>

        <div class="row mb-5">
          <div class="col-lg-4 mb-4">
            <div class="value-card">
              <i class="bi bi-shield-check"></i>
              <h3>Reliability</h3>
              <p>Secure, dependable platform you can trust for all your competition needs.</p>
            </div>
          </div>
          <div class="col-lg-4 mb-4">
            <div class="value-card">
              <i class="bi bi-people"></i>
              <h3>Community</h3>
              <p>Connecting riders, clubs, and officials across South Africa.</p>
            </div>
          </div>
          <div class="col-lg-4 mb-4">
            <div class="value-card">
              <i class="bi bi-lightning"></i>
              <h3>Innovation</h3>
              <p>Continuously improving to meet the evolving needs of our users.</p>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col-lg-8 mx-auto">
            <h2 class="mb-4">What We Offer</h2>
            <ul class="feature-list">
              <li>Comprehensive competition management for show holding bodies</li>
              <li>Easy online entry system for riders</li>
              <li>Secure payment processing</li>
              <li>Real-time results and rankings</li>
              <li>Document management and reminders</li>
              <li>Provincial and national calendar integration</li>
              <li>Official registration and management</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-header {
      background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
      color: white;
      padding: 80px 0 60px;
      text-align: center;

      h1 {
        font-size: 3rem;
        font-weight: 700;
        margin-bottom: 16px;
      }

      p {
        font-size: 1.25rem;
        opacity: 0.95;
      }
    }

    .value-card {
      text-align: center;
      padding: 32px;
      border: 1px solid var(--border-color);
      border-radius: 12px;
      height: 100%;
      transition: all 0.3s;

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
      }

      i {
        font-size: 48px;
        color: var(--primary-color);
        margin-bottom: 20px;
      }

      h3 {
        font-size: 1.5rem;
        font-weight: 700;
        margin-bottom: 12px;
      }

      p {
        color: var(--text-secondary);
        margin: 0;
      }
    }

    .feature-list {
      li {
        margin-bottom: 12px;
        font-size: 1.125rem;
        color: var(--text-secondary);
      }
    }
  `]
})
export class AboutComponent {}

