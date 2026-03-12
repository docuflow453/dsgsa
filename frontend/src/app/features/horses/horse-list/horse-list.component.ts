import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-horse-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container-fluid">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2>Horses</h2>
        <a routerLink="/horses/new" class="btn btn-primary">
          <i class="bi bi-plus-lg"></i>
          Register Horse
        </a>
      </div>
      <p>Manage your registered horses</p>
    </div>
  `
})
export class HorseListComponent {}

