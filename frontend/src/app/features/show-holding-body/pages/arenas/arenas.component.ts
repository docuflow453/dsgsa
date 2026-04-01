import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ShowHoldingBodyService } from '../../services/show-holding-body.service';

export interface Arena {
  id: string;
  name: string;
  description: string;
  size: string;
  surface: string;
  capacity: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

@Component({
  selector: 'app-arenas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './arenas.component.html',
  styleUrls: ['./arenas.component.scss']
})
export class ArenasComponent implements OnInit {
  arenas: Arena[] = [];
  loading = true;
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';
  showToast = false;

  constructor(private shbService: ShowHoldingBodyService) {}

  ngOnInit(): void {
    this.loadArenas();
  }

  loadArenas(): void {
    this.loading = true;
    this.shbService.getArenas().subscribe({
      next: (arenas) => {
        this.arenas = arenas;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading arenas:', error);
        this.showErrorToast('Failed to load arenas');
        this.loading = false;
      }
    });
  }

  toggleStatus(arena: Arena): void {
    const updatedArena = { ...arena, isActive: !arena.isActive };
    this.shbService.updateArena(arena.id, updatedArena).subscribe({
      next: (response) => {
        this.showSuccessToast(`Arena ${updatedArena.isActive ? 'activated' : 'deactivated'} successfully`);
        this.loadArenas();
      },
      error: (error) => {
        this.showErrorToast('Failed to update arena status');
      }
    });
  }

  showSuccessToast(message: string): void {
    this.toastMessage = message;
    this.toastType = 'success';
    this.showToast = true;
    setTimeout(() => { this.showToast = false; }, 3000);
  }

  showErrorToast(message: string): void {
    this.toastMessage = message;
    this.toastType = 'error';
    this.showToast = true;
    setTimeout(() => { this.showToast = false; }, 3000);
  }
}

