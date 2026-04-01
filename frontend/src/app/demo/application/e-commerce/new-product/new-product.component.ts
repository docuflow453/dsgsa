// project import
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

//icons
import { IconService } from '@ant-design/icons-angular';
import { UploadOutline } from '@ant-design/icons-angular/icons';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-new-product',
  imports: [CommonModule, SharedModule],
  templateUrl: './new-product.component.html',
  styleUrls: ['./new-product.component.scss']
})
export class NewProductComponent {
  private iconService = inject(IconService);

  // constructor
  constructor() {
    this.iconService.addIcon(...[UploadOutline]);
  }
}
