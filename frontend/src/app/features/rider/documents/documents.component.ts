import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Document {
  id: number;
  name: string;
  pocket: string;
  type: string;
  tags: string[];
  status: string;
  uploadedAt: Date;
}

@Component({
  selector: 'app-documents',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss']
})
export class DocumentsComponent {
  showUploadModal = signal(false);
  documents = signal<Document[]>([]);
  
  activeTab = 'documents';
  searchQuery = '';
  itemsPerPage = 10;

  tabs = [
    { id: 'documents', label: 'Documents', count: 0 },
    { id: 'favourites', label: 'Favourites', count: 0 },
    { id: 'missing', label: 'Missing', badge: '1' },
    { id: 'expired', label: 'Expired', count: 0 },
    { id: 'archived', label: 'Archived', count: 0 },
    { id: 'recently-deleted', label: 'Recently Deleted', count: 0 }
  ];

  openUploadModal(): void {
    this.showUploadModal.set(true);
  }

  closeUploadModal(): void {
    this.showUploadModal.set(false);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      console.log('Files selected:', input.files);
    }
  }
}

