// angular import
import { Component, TemplateRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ProductFilterComponent } from './product-filter/product-filter.component';
import ProductData from 'src/fake-data/product.json';
import { ScrollbarComponent } from 'src/app/theme/shared/components/scrollbar/scrollbar.component';

// bootstrap import
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';

// icons
import { IconService } from '@ant-design/icons-angular';
import { FilterOutline, SearchOutline, ShoppingCartOutline } from '@ant-design/icons-angular/icons';

@Component({
  selector: 'app-product',
  imports: [CommonModule, SharedModule, ProductFilterComponent, RouterModule, ScrollbarComponent],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss'
})
export class ProductComponent {
  private offcanvasService = inject(NgbOffcanvas);
  private iconService = inject(IconService);

  // public props
  isCollapsed = false;

  // Constructor
  constructor() {
    this.iconService.addIcon(...[FilterOutline, SearchOutline, ShoppingCartOutline]);
  }

  // public method
  showFilter(filter: TemplateRef<string>) {
    this.offcanvasService.open(filter, { position: 'start' });
  }

  // product name
  products = ProductData;

  onLikeChange(event: Event): void {
    const prodLike = event.target as HTMLInputElement;
    const parent = prodLike.parentNode as HTMLElement;

    if (prodLike.checked) {
      parent.insertAdjacentHTML(
        'beforeend',
        '<div class="pc-like"><div class="like-wrapper"><span><span class="pc-group"><span class="pc-dots"></span><span class="pc-dots"></span><span class="pc-dots"></span><span class="pc-dots"></span></span></span></div></div>'
      );
      parent.querySelector('.pc-like')?.classList.add('pc-like-animate');
      setTimeout(() => {
        parent.querySelector('.pc-like')?.remove();
      }, 3000);
    } else {
      parent.querySelector('.pc-like')?.remove();
    }
  }
}
