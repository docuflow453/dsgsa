import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Result {
  id: number;
  competition: string;
  date: string;
  location: string;
  province: string;
}

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <div class="container">
          <h1>Competition Results</h1>
          <p>View results from past competitions</p>
        </div>
      </div>

      <div class="container py-5">
        <div class="row mb-4">
          <div class="col-lg-8 mx-auto">
            <div class="search-bar">
              <input type="text" class="form-control" placeholder="Search competitions...">
              <button class="btn btn-primary">
                <i class="bi bi-search"></i>
                Search
              </button>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col-lg-8 mx-auto">
            @for (result of results; track result.id) {
              <div class="result-card">
                <div class="result-info">
                  <h3>{{ result.competition }}</h3>
                  <div class="result-meta">
                    <span><i class="bi bi-calendar"></i> {{ result.date }}</span>
                    <span><i class="bi bi-geo-alt"></i> {{ result.location }}</span>
                    <span><i class="bi bi-map"></i> {{ result.province }}</span>
                  </div>
                </div>
                <button class="btn btn-outline-primary">
                  <i class="bi bi-file-earmark-text"></i>
                  View Results
                </button>
              </div>
            }
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

    .search-bar {
      display: flex;
      gap: 12px;
      background: white;
      padding: 24px;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

      .form-control {
        flex: 1;
      }
    }

    .result-card {
      background: white;
      border: 1px solid var(--border-color);
      border-radius: 12px;
      padding: 24px;
      margin-bottom: 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 20px;
      transition: all 0.3s;

      &:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        border-color: var(--primary-color);
      }

      .result-info {
        flex: 1;

        h3 {
          font-size: 1.25rem;
          font-weight: 700;
          margin-bottom: 12px;
          color: var(--text-primary);
        }

        .result-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          color: var(--text-secondary);
          font-size: 0.9375rem;

          span {
            display: flex;
            align-items: center;
            gap: 6px;

            i {
              color: var(--primary-color);
            }
          }
        }
      }

      .btn {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        white-space: nowrap;
      }
    }
  `]
})
export class ResultsComponent {
  results: Result[] = [
    {
      id: 1,
      competition: 'Spring Dressage Championship 2026',
      date: 'March 15, 2026',
      location: 'Johannesburg Equestrian Centre',
      province: 'Gauteng'
    },
    {
      id: 2,
      competition: 'Western Cape Provincial Show',
      date: 'February 22, 2026',
      location: 'Cape Town Riding Club',
      province: 'Western Cape'
    }
  ];
}

