// angular import
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { CheckoutInformationComponent } from './checkout-information/checkout-information.component';
import { CheckoutPaymentComponent } from './checkout-payment/checkout-payment.component';
import { OfferModalComponent } from './offer-modal/offer-modal.component';

//icons
import { IconService } from '@ant-design/icons-angular';
import {
  CloseOutline,
  CreditCardOutline,
  DeleteOutline,
  GiftOutline,
  MinusOutline,
  PlusOutline,
  ShopOutline,
  ShoppingCartOutline,
  TrophyOutline,
  LeftOutline
} from '@ant-design/icons-angular/icons';

// bootstrap import
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-checkout',
  imports: [CommonModule, SharedModule, CheckoutInformationComponent, CheckoutPaymentComponent],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent {
  private iconService = inject(IconService);

  // private property
  private modalService = inject(NgbModal);

  // constructor
  constructor() {
    this.iconService.addIcon(
      ...[
        ShoppingCartOutline,
        CreditCardOutline,
        ShopOutline,
        MinusOutline,
        PlusOutline,
        DeleteOutline,
        TrophyOutline,
        GiftOutline,
        CloseOutline,
        LeftOutline
      ]
    );
  }
  // public method
  inputNumber = 0;

  plus() {
    this.inputNumber = this.inputNumber + 1;
  }
  minus() {
    if (this.inputNumber != 0) {
      this.inputNumber = this.inputNumber - 1;
    }
  }

  summary = [
    {
      title: 'Sub Total',
      amount: '$100.00'
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

  openOfferMOdal() {
    this.modalService.open(OfferModalComponent, { centered: true, size: 'lg' });
  }
}
