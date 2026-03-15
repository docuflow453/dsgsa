// angular import
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { OfferModalComponent } from '../offer-modal/offer-modal.component';

// bootstrap import
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

// icons
import { IconService } from '@ant-design/icons-angular';
import { DeleteOutline, LeftOutline } from '@ant-design/icons-angular/icons';

@Component({
  selector: 'app-checkout-information',
  imports: [CommonModule, SharedModule],
  templateUrl: './checkout-information.component.html',
  styleUrl: './checkout-information.component.scss'
})
export class CheckoutInformationComponent {
  private modalService = inject(NgbModal);
  private iconService = inject(IconService);

  // Constructor
  constructor() {
    this.iconService.addIcon(...[LeftOutline, DeleteOutline]);
  }

  // public methods
  openOfferMOdal() {
    this.modalService.open(OfferModalComponent, { centered: true, size: 'lg' });
  }

  address = [
    {
      title: 'Martin Shaw',
      type: '(Office)',
      address: '1654 Zideh Plz, 27 Elabe Trailllllll, Suwecpimmmmmm, Kentucky, kGambia - HS6N 5ATkkk',
      number: '(939) 513-8172'
    },
    {
      title: 'Billy Castillo',
      type: '(Home)',
      address: '1359 Pusuw Park, 1057 Geptoc Key, Pazworog, Kentucky, Bahrain - FK6T 8HK',
      number: '(440) 597-4681'
    },
    {
      title: 'Brenda Murphy',
      type: '(Office)',
      address: '1654 Zideh Plz, 125 Test Rd, Knoxville, Knoxville, United States - 778',
      number: '8998877'
    }
  ];

  group = [
    {
      title: 'First Name',
      type: 'text',
      details: 'First Name'
    },
    {
      title: 'Last Name',
      type: 'text',
      details: 'Last Name'
    },
    {
      title: 'Email id',
      type: 'email',
      details: 'Enter Your Email'
    },
    {
      title: 'Date of Birth',
      type: 'date',
      details: 'Enter Your Birth Date'
    },
    {
      title: 'Phone number',
      type: 'number',
      details: 'Enter Your Phone Number'
    },
    {
      title: 'City',
      type: 'text',
      details: 'Enter Your City Name'
    }
  ];

  summary = [
    {
      title: 'Sub Total',
      amount: '$300.00'
    },
    {
      title: 'Estimated Delivery',
      amount: '-'
    },
    {
      title: 'Voucher',
      amount: '-'
    }
  ];

  coupons = [
    {
      color: 'border-secondary',
      offer: 'Up to 50% Off',
      code: 'MANTIS50',
      colorCode: 'btn-light-secondary'
    },
    {
      color: 'border-danger',
      offer: 'Festival Fires',
      code: 'FLAT05',
      colorCode: 'btn-light-danger'
    }
  ];

  couponsCode = [
    {
      offer: 'Get $150 off on your subscription',
      color: 'bg-primary',
      icon: 'ti ti-gift',
      description: 'When you subscribe to the unlimited consultation plan on Mantis.',
      code: 'SUB150',
      codeColor: 'btn-light-primary'
    },
    {
      offer: 'Save up to $200',
      color: 'bg-warning',
      icon: 'ti ti-gift',
      description: 'Make 4 play store recharge code purchases & save up to $200',
      code: 'UPTO200',
      codeColor: 'btn-light-warning'
    }
  ];
}
