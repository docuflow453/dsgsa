// project import
import { AsyncPipe, DecimalPipe, CommonModule } from '@angular/common';
import { Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

// rxjs import
import { Observable } from 'rxjs';

// bootstrap import
import { NgbModal, NgbPaginationModule, NgbTooltipModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';

// project import
import { product } from './product.config/product';
import { ProductDataService } from './product.config/product-data.service';
import { IconService } from '@ant-design/icons-angular';
import { CloseOutline, DownloadOutline, EyeOutline, PlusOutline, StarFill, StarOutline } from '@ant-design/icons-angular/icons';
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-product-list',

  imports: [FormsModule, AsyncPipe, NgbTypeaheadModule, NgbPaginationModule, CommonModule, NgbTooltipModule, RouterModule, SharedModule],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
  providers: [ProductDataService, DecimalPipe]
})
export class ProductListComponent {
  service = inject(ProductDataService);
  private modalService = inject(NgbModal);
  private iconService = inject(IconService);

  @ViewChild('details', { static: true }) detailsModal!: TemplateRef<product>;

  // public props
  product$: Observable<product[]>;
  total$: Observable<number>;
  selectedProduct?: product;

  closeResult!: string;

  // constructor
  constructor() {
    const service = this.service;

    this.product$ = service.product$;
    this.total$ = service.total$;
    this.iconService.addIcon(...[EyeOutline, DownloadOutline, PlusOutline, StarOutline, StarFill, CloseOutline]);
  }

  openProduct(product: product) {
    this.selectedProduct = product;
    this.modalService.open(this.detailsModal, { size: 'lg' });
  }
}
