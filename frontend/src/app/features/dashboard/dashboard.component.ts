import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '@core/services/auth.service';

interface DocumentStats {
  label: string;
  count: number;
  icon: string;
  color: string;
  route: string;
}

interface Pocket {
  id: number;
  name: string;
  icon: string;
  tags: string[];
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  authService = inject(AuthService);
  
  documentStats: DocumentStats[] = [
    { label: 'All Documents', count: 0, icon: 'bi-file-earmark-text', color: 'primary', route: '/my/documents' },
    { label: 'Favourites', count: 0, icon: 'bi-star', color: 'success', route: '/my/favourites' },
    { label: 'Missing', count: 1, icon: 'bi-exclamation-triangle', color: 'warning', route: '/my/missing' },
    { label: 'Expired', count: 0, icon: 'bi-clock-history', color: 'danger', route: '/my/expired' }
  ];

  pockets: Pocket[] = [
    { 
      id: 1, 
      name: 'Personal', 
      icon: 'bi-person',
      tags: ['Personal Miscellaneous', 'ID', 'Drivers Lic']
    }
  ];

  ngOnInit(): void {
    // Load dashboard data
  }
}

