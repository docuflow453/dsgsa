// angular import
import { Component, ElementRef, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';

// rxjs import
import { Observable } from 'rxjs';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { customer } from './helpdesk-customer-type';
import { helpDeskCustomerService } from './helpdesk-customer.service';

// icon
import { DeleteOutline, EditOutline, UserOutline } from '@ant-design/icons-angular/icons';
import { IconService } from '@ant-design/icons-angular';

// bootstrap import
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-helpdesk-customer',
  imports: [SharedModule],
  templateUrl: './helpdesk-customer.component.html',
  styleUrl: './helpdesk-customer.component.scss',
  providers: [helpDeskCustomerService, DecimalPipe]
})
export class HelpdeskCustomerComponent {
  service = inject(helpDeskCustomerService);
  private iconService = inject(IconService);
  private modalService = inject(NgbModal);

  // public props
  customers$: Observable<customer[]>;
  total$: Observable<number>;

  // constructor
  constructor() {
    const service = this.service;

    this.customers$ = service.customers$;
    this.total$ = service.total$;
    this.iconService.addIcon(...[DeleteOutline, EditOutline, UserOutline]);
  }

  addCustomer(details: ElementRef) {
    this.modalService.open(details);
  }
}
