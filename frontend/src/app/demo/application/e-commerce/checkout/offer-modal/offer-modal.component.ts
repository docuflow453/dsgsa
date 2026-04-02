// angular import
import { Component, inject } from '@angular/core';

// bootstrap import
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-offer-modal',
  imports: [SharedModule],
  templateUrl: './offer-modal.component.html',
  styleUrl: './offer-modal.component.scss'
})
export class OfferModalComponent {
  // private method
  modal = inject(NgbActiveModal);
}
