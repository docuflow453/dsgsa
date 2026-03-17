import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ShowHoldingBodyService } from '../../services/show-holding-body.service';
import { Member } from '../../models/show-holding-body.model';

@Component({
  selector: 'app-shb-members',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.scss']
})
export class MembersComponent implements OnInit {
  activeTab: 'approved' | 'pending' = 'approved';
  approvedMembers: Member[] = [];
  pendingMembers: Member[] = [];
  filteredApprovedMembers: Member[] = [];
  filteredPendingMembers: Member[] = [];
  searchQuery = '';
  loading = true;
  
  // Modal states
  showApprovalModal = false;
  showRejectionModal = false;
  showRemoveModal = false;
  showDetailsModal = false;
  selectedMember: Member | null = null;
  rejectionReason = '';
  processingAction = false;
  
  // Toast notification
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';
  showToast = false;

  // Pagination
  currentPage = 1;
  itemsPerPage = 10;

  constructor(
    private shbService: ShowHoldingBodyService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Check for tab query parameter
    this.route.queryParams.subscribe(params => {
      if (params['tab'] === 'pending') {
        this.activeTab = 'pending';
      }
    });

    this.loadMembers();
  }

  loadMembers(): void {
    this.loading = true;

    this.shbService.getApprovedMembers().subscribe(members => {
      this.approvedMembers = members;
      this.filteredApprovedMembers = members;
      this.loading = false;
    });

    this.shbService.getPendingMembers().subscribe(members => {
      this.pendingMembers = members;
      this.filteredPendingMembers = members;
    });
  }

  setActiveTab(tab: 'approved' | 'pending'): void {
    this.activeTab = tab;
    this.searchQuery = '';
    this.currentPage = 1;
  }

  searchMembers(): void {
    const query = this.searchQuery.toLowerCase();

    if (this.activeTab === 'approved') {
      this.filteredApprovedMembers = this.approvedMembers.filter(member =>
        member.firstName.toLowerCase().includes(query) ||
        member.lastName.toLowerCase().includes(query) ||
        member.email.toLowerCase().includes(query) ||
        member.membershipNumber.toLowerCase().includes(query)
      );
    } else {
      this.filteredPendingMembers = this.pendingMembers.filter(member =>
        member.firstName.toLowerCase().includes(query) ||
        member.lastName.toLowerCase().includes(query) ||
        member.email.toLowerCase().includes(query) ||
        member.membershipNumber.toLowerCase().includes(query)
      );
    }
    this.currentPage = 1;
  }

  // Modal actions
  openApprovalModal(member: Member): void {
    this.selectedMember = member;
    this.showApprovalModal = true;
  }

  openRejectionModal(member: Member): void {
    this.selectedMember = member;
    this.rejectionReason = '';
    this.showRejectionModal = true;
  }

  openRemoveModal(member: Member): void {
    this.selectedMember = member;
    this.showRemoveModal = true;
  }

  openDetailsModal(member: Member): void {
    this.selectedMember = member;
    this.showDetailsModal = true;
  }

  closeAllModals(): void {
    this.showApprovalModal = false;
    this.showRejectionModal = false;
    this.showRemoveModal = false;
    this.showDetailsModal = false;
    this.selectedMember = null;
    this.rejectionReason = '';
  }

  // Approve member
  confirmApproval(): void {
    if (!this.selectedMember) return;

    this.processingAction = true;
    this.shbService.approveMember({ memberId: this.selectedMember.id }).subscribe({
      next: (response) => {
        this.showSuccessToast(response.message);
        this.loadMembers();
        this.closeAllModals();
        this.processingAction = false;
      },
      error: (error) => {
        this.showErrorToast('Failed to approve member. Please try again.');
        this.processingAction = false;
      }
    });
  }

  // Reject member
  confirmRejection(): void {
    if (!this.selectedMember || !this.rejectionReason.trim()) {
      this.showErrorToast('Please provide a reason for rejection.');
      return;
    }

    this.processingAction = true;
    this.shbService.rejectMember({
      memberId: this.selectedMember.id,
      reason: this.rejectionReason
    }).subscribe({
      next: (response) => {
        this.showSuccessToast(response.message);
        this.loadMembers();
        this.closeAllModals();
        this.processingAction = false;
      },
      error: (error) => {
        this.showErrorToast('Failed to reject member. Please try again.');
        this.processingAction = false;
      }
    });
  }

  // Remove member
  confirmRemoval(): void {
    if (!this.selectedMember) return;

    this.processingAction = true;
    this.shbService.removeMember(this.selectedMember.id).subscribe({
      next: (response) => {
        this.showSuccessToast(response.message);
        this.loadMembers();
        this.closeAllModals();
        this.processingAction = false;
      },
      error: (error) => {
        this.showErrorToast('Failed to remove member. Please try again.');
        this.processingAction = false;
      }
    });
  }

  // Toast notifications
  showSuccessToast(message: string): void {
    this.toastMessage = message;
    this.toastType = 'success';
    this.showToast = true;
    setTimeout(() => {
      this.showToast = false;
    }, 3000);
  }

  showErrorToast(message: string): void {
    this.toastMessage = message;
    this.toastType = 'error';
    this.showToast = true;
    setTimeout(() => {
      this.showToast = false;
    }, 3000);
  }

  // Utility methods
  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-ZA', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }

  getHorseNames(member: Member): string {
    return member.horses.map(h => h.name).join(', ');
  }

  get paginatedMembers(): Member[] {
    const members = this.activeTab === 'approved'
      ? this.filteredApprovedMembers
      : this.filteredPendingMembers;

    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return members.slice(startIndex, endIndex);
  }

  get totalPages(): number {
    const members = this.activeTab === 'approved'
      ? this.filteredApprovedMembers
      : this.filteredPendingMembers;
    return Math.ceil(members.length / this.itemsPerPage);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }
}


