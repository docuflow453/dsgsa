// angular import
import { AsyncPipe, DecimalPipe, CommonModule } from '@angular/common';
import { Component, ElementRef, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

// rxjs import
import { Observable } from 'rxjs';

// bootstrap import
import { NgbModal, NgbPaginationModule, NgbTooltipModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';

// project import
import { customer } from '../../customer/customer-list/customer-data.config/customer';
import { CustomerDataService } from '../../customer/customer-list/customer-data.config/customer-data.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';

// icons
import { IconService } from '@ant-design/icons-angular';
import {
  CloseOutline,
  DeleteOutline,
  DownloadOutline,
  EditOutline,
  EnvironmentOutline,
  EyeOutline,
  LinkOutline,
  MailOutline,
  PhoneOutline,
  PlusOutline
} from '@ant-design/icons-angular/icons';

@Component({
  selector: 'app-user-list',
  imports: [FormsModule, AsyncPipe, NgbTypeaheadModule, NgbPaginationModule, CommonModule, NgbTooltipModule, SharedModule],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  providers: [CustomerDataService, DecimalPipe]
})
export class UserListComponent {
  service = inject(CustomerDataService);
  private modalService = inject(NgbModal);
  private iconService = inject(IconService);
  customer$: Observable<customer[]>;
  total$: Observable<number>;

  closeResult!: string;

  constructor() {
    this.customer$ = this.service.customer$;
    this.total$ = this.service.total$;
    this.iconService.addIcon(
      ...[
        EyeOutline,
        EditOutline,
        DeleteOutline,
        CloseOutline,
        LinkOutline,
        MailOutline,
        PhoneOutline,
        EnvironmentOutline,
        PlusOutline,
        DownloadOutline
      ]
    );
  }

  openLg(content: ElementRef) {
    this.modalService.open(content, { size: 'lg', scrollable: true });
  }

  openCustomer(details: ElementRef) {
    this.modalService.open(details, { size: 'lg', scrollable: true });
  }

  user = {
    name: 'Aaron Poole',
    avatar: 'assets/images/user/avatar-5.jpg',
    jobTitle: 'Manufacturing Director',
    info: [
      { label: 'Age', value: '45' },
      { label: 'Progress', value: '86%', style: 'border border-top-0 border-bottom-0' },
      { label: 'Visits', value: '7634' }
    ],
    contacts: [
      { iconClass: 'mail', value: 'bo@gmail.com' },
      { iconClass: 'phone', value: '+1 (247) 849-6968' },
      { iconClass: 'environment', value: 'Lesotho' }
    ],
    website: 'https://anshan.dh.url'
  };

  userInformation = [
    {
      fields: [
        { label: 'Full Name', value: 'Aaron Poole' },
        { label: 'Father Name', value: 'Mr. Ralph Sabatini' }
      ]
    },
    {
      fields: [
        { label: 'Country', value: 'Lesotho' },
        { label: 'Zip Code', value: '247 849' }
      ]
    }
  ];
}
