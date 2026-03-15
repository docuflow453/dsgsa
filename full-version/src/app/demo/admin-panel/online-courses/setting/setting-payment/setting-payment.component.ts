// angular import
import { Component, inject } from '@angular/core';
import { CdkStepperModule } from '@angular/cdk/stepper';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { PaymentDetailsComponent } from './payment-details/payment-details.component';

// icons
import { IconService } from '@ant-design/icons-angular';
import { LeftOutline } from '@ant-design/icons-angular/icons';

@Component({
  selector: 'app-setting-payment',
  imports: [SharedModule, PaymentDetailsComponent, CdkStepperModule],
  templateUrl: './setting-payment.component.html',
  styleUrl: './setting-payment.component.scss'
})
export class SettingPaymentComponent {
  private iconService = inject(IconService);

  // constructor
  constructor() {
    this.iconService.addIcon(...[LeftOutline]);
  }
}
