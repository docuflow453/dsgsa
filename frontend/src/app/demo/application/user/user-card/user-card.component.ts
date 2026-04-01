// angular import
import { Component, ElementRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import cardData from 'src/fake-data/user-card.json';
import { CardPreviewComponent } from './card-preview/card-preview.component';

// bootstrap import
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

// icons
import { IconService } from '@ant-design/icons-angular';
import {
  EnvironmentOutline,
  LinkOutline,
  MailOutline,
  MoreOutline,
  PhoneOutline,
  PlusOutline,
  SearchOutline
} from '@ant-design/icons-angular/icons';

@Component({
  selector: 'app-user-card',
  imports: [CommonModule, SharedModule, CardPreviewComponent],
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.scss']
})
export class UserCardComponent {
  private modalService = inject(NgbModal);
  private iconService = inject(IconService);

  // public method
  card_detail = cardData;

  // Constructor
  constructor() {
    this.iconService.addIcon(...[SearchOutline, PlusOutline, MoreOutline, MailOutline, PhoneOutline, EnvironmentOutline, LinkOutline]);
  }

  // public method
  open(preview: ElementRef) {
    this.modalService.open(preview, { size: 'xl' });
  }
}
