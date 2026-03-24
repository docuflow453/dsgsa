import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RiderService } from '../../../services/rider.service';
import { Horse, HorseVaccination, HorseDocument, HorseAffiliation, HorseOwnership } from '../../../models/rider.model';

@Component({
  selector: 'app-horse-form',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule],
  templateUrl: './horse-form.component.html',
  styleUrls: ['./horse-form.component.scss']
})
export class HorseFormComponent implements OnInit {
  horseForm!: FormGroup;
  isEditMode = false;
  horseId: string | null = null;
  loading = true;
  saving = false;
  successMessage = '';
  errorMessage = '';
  activeTab = 1;

  // Tab data management
  vaccinations: HorseVaccination[] = [];
  documents: HorseDocument[] = [];
  affiliations: HorseAffiliation[] = [];
  ownershipHistory: HorseOwnership[] = [];

  // Form state for adding new records
  newVaccination: Partial<HorseVaccination> = {};
  newDocument: Partial<HorseDocument> = {};
  newAffiliation: Partial<HorseAffiliation> = {};
  newOwnership: Partial<HorseOwnership> = {};

  // Toggle states for inline forms
  showAddVaccination = false;
  showAddDocument = false;
  showAddAffiliation = false;
  showTransferOwnership = false;

  breeds = [
    'Hanoverian',
    'Warmblood',
    'Dutch Warmblood',
    'Thoroughbred',
    'Quarter Horse',
    'Lusitano',
    'Oldenburg',
    'Trakehner',
    'Friesian',
    'Andalusian',
    'Other'
  ];

  genders: ('Gelding' | 'Mare' | 'Stallion')[] = ['Gelding', 'Mare', 'Stallion'];
  statuses: ('Active' | 'Inactive' | 'Retired')[] = ['Active', 'Inactive', 'Retired'];
  grades = ['Preliminary', 'Elementary', 'Medium', 'Advanced', 'Grand Prix'];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private riderService: RiderService
  ) {}

  ngOnInit(): void {
    this.initializeForm();

    this.horseId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.horseId;

    if (this.isEditMode && this.horseId) {
      this.loadHorse(this.horseId);
    } else {
      this.loading = false;
    }
  }

  initializeForm(): void {
    this.horseForm = this.fb.group({
      name: ['', Validators.required],
      registeredName: ['', Validators.required],
      breed: ['', Validators.required],
      gender: ['Gelding', Validators.required],
      dateOfBirth: ['', Validators.required],
      color: [''],
      height: [''],
      markings: [''],
      microchip: ['', Validators.required],
      passportNumber: ['', Validators.required],
      feiNumber: [''],
      grade: ['', Validators.required],
      status: ['Active', Validators.required],
      sire: [''],
      dam: [''],
      breeder: [''],
      owner: [''],
      notes: ['']
    });
  }

  loadHorse(id: string): void {
    this.loading = true;
    this.riderService.getHorseById(id).subscribe({
      next: (horse) => {
        this.populateForm(horse);
        this.vaccinations = horse.vaccinations || [];
        this.documents = horse.documents || [];
        this.affiliations = horse.affiliations || [];
        this.ownershipHistory = horse.ownershipHistory || [];
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load horse details';
        this.loading = false;
      }
    });
  }

  populateForm(horse: Horse): void {
    this.horseForm.patchValue({
      name: horse.name,
      registeredName: horse.registeredName,
      breed: horse.breed,
      gender: horse.gender,
      dateOfBirth: this.formatDateForInput(horse.dateOfBirth),
      color: horse.color || '',
      height: horse.height || '',
      markings: horse.markings || '',
      microchip: horse.microchip,
      passportNumber: horse.passportNumber,
      feiNumber: horse.feiNumber || '',
      grade: horse.grade,
      status: horse.status,
      sire: horse.sire || '',
      dam: horse.dam || '',
      breeder: horse.breeder || '',
      owner: horse.owner || '',
      notes: horse.notes || ''
    });
  }

  formatDateForInput(date: Date): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  setActiveTab(tab: number): void {
    this.activeTab = tab;
  }

  onSubmit(): void {
    if (this.horseForm.invalid) {
      this.markFormGroupTouched(this.horseForm);
      this.errorMessage = 'Please fill in all required fields';
      return;
    }

    this.saving = true;
    this.successMessage = '';
    this.errorMessage = '';

    const formData = this.horseForm.value;
    const horseData = {
      ...formData,
      dateOfBirth: new Date(formData.dateOfBirth)
    };

    const operation = this.isEditMode && this.horseId
      ? this.riderService.updateHorse(this.horseId, horseData)
      : this.riderService.addHorse(horseData);

    operation.subscribe({
      next: (horse) => {
        this.successMessage = this.isEditMode ? 'Horse updated successfully!' : 'Horse added successfully!';
        this.saving = false;
        setTimeout(() => {
          this.router.navigate(['/my/horses', horse.id]);
        }, 1500);
      },
      error: (error) => {
        this.errorMessage = this.isEditMode ? 'Failed to update horse' : 'Failed to add horse';
        this.saving = false;
      }
    });
  }

  cancel(): void {
    if (this.isEditMode && this.horseId) {
      this.router.navigate(['/my/horses', this.horseId]);
    } else {
      this.router.navigate(['/my/horses']);
    }
  }

  hasError(field: string, error: string): boolean {
    const control = this.horseForm.get(field);
    return !!(control && control.hasError(error) && (control.dirty || control.touched));
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  // Vaccination Management Methods
  toggleAddVaccination(): void {
    this.showAddVaccination = !this.showAddVaccination;
    if (!this.showAddVaccination) {
      this.newVaccination = {};
    }
  }

  addVaccination(): void {
    if (this.newVaccination.vaccinationType && this.newVaccination.vaccinationDate) {
      const vaccination: HorseVaccination = {
        id: this.generateId(),
        horseId: this.horseId || '',
        vaccinationType: this.newVaccination.vaccinationType,
        vaccinationDate: new Date(this.newVaccination.vaccinationDate),
        expiryDate: this.newVaccination.expiryDate ? new Date(this.newVaccination.expiryDate) : undefined,
        batchNumber: this.newVaccination.batchNumber,
        veterinarian: this.newVaccination.veterinarian,
        notes: this.newVaccination.notes
      };
      this.vaccinations.push(vaccination);
      this.newVaccination = {};
      this.showAddVaccination = false;
    }
  }

  deleteVaccination(id: string): void {
    this.vaccinations = this.vaccinations.filter(v => v.id !== id);
  }

  // Document Management Methods
  toggleAddDocument(): void {
    this.showAddDocument = !this.showAddDocument;
    if (!this.showAddDocument) {
      this.newDocument = {};
    }
  }

  addDocument(): void {
    if (this.newDocument.documentType && this.newDocument.title && this.newDocument.fileName) {
      const document: HorseDocument = {
        id: this.generateId(),
        horseId: this.horseId || '',
        documentType: this.newDocument.documentType as any,
        title: this.newDocument.title,
        fileName: this.newDocument.fileName,
        fileUrl: this.newDocument.fileName, // Placeholder URL
        uploadDate: new Date(),
        notes: this.newDocument.notes
      };
      this.documents.push(document);
      this.newDocument = {};
      this.showAddDocument = false;
    }
  }

  deleteDocument(id: string): void {
    this.documents = this.documents.filter(d => d.id !== id);
  }

  downloadDocument(document: HorseDocument): void {
    // Placeholder for download functionality
    console.log('Downloading document:', document.fileName);
  }

  // Affiliation Management Methods
  toggleAddAffiliation(): void {
    this.showAddAffiliation = !this.showAddAffiliation;
    if (!this.showAddAffiliation) {
      this.newAffiliation = {};
    }
  }

  addAffiliation(): void {
    if (this.newAffiliation.organizationName && this.newAffiliation.registrationNumber) {
      const affiliation: HorseAffiliation = {
        id: this.generateId(),
        horseId: this.horseId || '',
        organizationName: this.newAffiliation.organizationName,
        registrationNumber: this.newAffiliation.registrationNumber,
        registrationDate: this.newAffiliation.registrationDate || new Date(),
        expiryDate: this.newAffiliation.expiryDate,
        status: (this.newAffiliation.status as any) || 'Active'
      };
      this.affiliations.push(affiliation);
      this.newAffiliation = {};
      this.showAddAffiliation = false;
    }
  }

  deleteAffiliation(id: string): void {
    this.affiliations = this.affiliations.filter(a => a.id !== id);
  }

  // Ownership Management Methods
  toggleTransferOwnership(): void {
    this.showTransferOwnership = !this.showTransferOwnership;
    if (!this.showTransferOwnership) {
      this.newOwnership = {};
    }
  }

  transferOwnership(): void {
    if (this.newOwnership.ownerName) {
      // Mark current ownership as ended
      this.ownershipHistory.forEach(o => {
        if (o.isCurrent) {
          o.isCurrent = false;
          o.ownershipEndDate = new Date();
        }
      });

      // Add new ownership record
      const ownership: HorseOwnership = {
        id: this.generateId(),
        horseId: this.horseId || '',
        ownerName: this.newOwnership.ownerName,
        ownerEmail: this.newOwnership.ownerEmail,
        ownerPhone: this.newOwnership.ownerPhone,
        ownershipStartDate: new Date(),
        isCurrent: true,
        transferReason: this.newOwnership.transferReason,
        notes: this.newOwnership.notes
      };
      this.ownershipHistory.unshift(ownership);

      // Update current owner in form
      this.horseForm.patchValue({ owner: this.newOwnership.ownerName });

      this.newOwnership = {};
      this.showTransferOwnership = false;
    }
  }

  getCurrentOwner(): HorseOwnership | undefined {
    return this.ownershipHistory.find(o => o.isCurrent);
  }

  getPreviousOwners(): HorseOwnership[] {
    return this.ownershipHistory.filter(o => !o.isCurrent);
  }

  private generateId(): string {
    return 'temp_' + Math.random().toString(36).substr(2, 9);
  }

  formatDate(date: Date | undefined): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-ZA', { day: '2-digit', month: 'short', year: 'numeric' });
  }
}

