// angular import
import { Component, ElementRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

// bootstrap import
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { OfferModalComponent } from '../offer-modal/offer-modal.component';

// icons
import { IconService } from '@ant-design/icons-angular';
import { CloseOutline, DeleteOutline, EditOutline, LeftOutline } from '@ant-design/icons-angular/icons';

@Component({
  selector: 'app-checkout-payment',
  imports: [CommonModule, SharedModule],
  templateUrl: './checkout-payment.component.html',
  styleUrl: './checkout-payment.component.scss'
})
export class CheckoutPaymentComponent {
  private modalService = inject(NgbModal);
  private iconService = inject(IconService);

  // Constructor
  constructor() {
    this.iconService.addIcon(...[EditOutline, DeleteOutline, CloseOutline, LeftOutline]);
  }

  // public method
  addAddress(address: ElementRef) {
    this.modalService.open(address, { centered: true, scrollable: true });
  }

  // public methods
  openOfferMOdal() {
    this.modalService.open(OfferModalComponent, { centered: true, size: 'lg' });
  }

  editAddress = [
    {
      title: 'City',
      text: 'Enter City'
    },
    {
      title: 'State',
      text: 'Enter State'
    },
    {
      title: 'Country',
      text: 'Enter Country'
    },
    {
      title: 'Area Code',
      text: 'Enter Area Code'
    }
  ];

  payment_method = [
    {
      title: 'Credit / Debit Card',
      text: '10% off with master card',
      src: 'assets/images/application/card.png'
    },
    {
      title: 'Pay with PayPal',
      text: '5% off on first payment',
      src: 'assets/images/application/paypal.png'
    },
    {
      title: 'Cash on Delivery',
      text: 'When you use this payment',
      src: 'assets/images/application/cod.png'
    }
  ];

  card_payment = [
    {
      title: 'John Smith',
      src: 'assets/images/application/mastercard.png'
    },
    {
      title: 'Jennifer winged',
      src: 'assets/images/application/visa.png'
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

  radios = [
    {
      type: 'Home'
    },
    {
      type: 'Office'
    }
  ];
}
