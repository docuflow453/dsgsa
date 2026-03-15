// angular import
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { IconService } from '@ant-design/icons-angular';
import { HomeOutline } from '@ant-design/icons-angular/icons';

@Component({
  selector: 'app-breadcrumb',
  imports: [CommonModule, SharedModule],
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent {
  private iconService = inject(IconService);

  // public props
  isDisabled = true;

  // constructor
  constructor() {
    this.iconService.addIcon(...[HomeOutline]);
  }

  //public methods
  toggleDisabled() {
    this.isDisabled = !this.isDisabled;
  }

  getPageSymbol(current: number) {
    return ['A', 'B', 'C', 'D', 'E', 'F', 'G'][current - 1];
  }
}
