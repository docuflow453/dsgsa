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
  selector: 'app-invoice-edit',
  imports: [SharedModule],
  templateUrl: './invoice-edit.component.html',
  styleUrl: './invoice-edit.component.scss'
})
export class InvoiceEditComponent {
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

  productList = [
    {
      id: 1,
      name: 'Apple Series 4 GPS A38 MM Space',
      description: 'Apple Watch SE Smartwatch',
      qty: 3,
      price: 275
    },
    {
      id: 1,
      name: 'Boat On-Ear Wireless',
      description: 'Mic Bluetooth 4.2, Rockerz 450R',
      qty: 45,
      price: 82
    },
    {
      id: 1,
      name: 'Fitbit MX30 Smart Watch',
      description: '(MX30- waterproof) watch',
      qty: 70,
      price: 85
    }
  ];
}
