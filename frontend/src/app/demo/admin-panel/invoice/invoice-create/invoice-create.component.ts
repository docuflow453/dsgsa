// angular import
import { Component, inject } from '@angular/core';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { AddressModalComponent } from './address-modal/address-modal.component';

// icons
import { IconService } from '@ant-design/icons-angular';
import { CloseOutline, DeleteOutline, EditOutline, PlusOutline } from '@ant-design/icons-angular/icons';

// bootstrap import
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-invoice-create',
  imports: [SharedModule],
  templateUrl: './invoice-create.component.html',
  styleUrl: './invoice-create.component.scss'
})
export class InvoiceCreateComponent {
  private iconService = inject(IconService);

  // public props
  modalService = inject(NgbModal);
  isCollapsed = false;
  multiCollapsed = true;

  // constructor
  constructor() {
    this.iconService.addIcon(...[EditOutline, PlusOutline, CloseOutline, DeleteOutline]);
  }

  // public methods
  openAddressBook() {
    this.modalService.open(AddressModalComponent, { size: 'lg', scrollable: true });
  }
}
