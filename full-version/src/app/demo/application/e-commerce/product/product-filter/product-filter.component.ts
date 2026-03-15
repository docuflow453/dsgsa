// angular import
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';

// third party
import { LabelType, NgxSliderModule, Options } from '@angular-slider/ngx-slider';
import { IconService } from '@ant-design/icons-angular';
import { StarFill, StarOutline } from '@ant-design/icons-angular/icons';

@Component({
  selector: 'app-product-filter',
  imports: [CommonModule, SharedModule, NgxSliderModule],
  templateUrl: './product-filter.component.html',
  styleUrl: './product-filter.component.scss'
})
export class ProductFilterComponent {
  private iconService = inject(IconService);

  // public props
  isCollapsed = false;
  categoriesIsCollapsed = false;
  colorIsCollapsed = false;
  priceIsCollapsed = false;
  ratingIsCollapsed = false;
  selected = 0;

  minValue = 0;
  maxValue = 300;
  options: Options = {
    floor: 0,
    ceil: 1000,
    translate: (label: LabelType): string => {
      switch (label) {
        case LabelType.Low:
          return '';
        case LabelType.High:
          return '';
        default:
          return '';
      }
    }
  };

  // constructor
  constructor() {
    this.iconService.addIcon(...[StarOutline, StarFill]);
  }

  // public method
  genders = [
    {
      type: 'Male',
      check: true
    },
    {
      type: 'Female',
      check: false
    },
    {
      type: 'Kids',
      check: false
    }
  ];

  categories = [
    {
      type: 'All',
      check: true
    },
    {
      type: 'Electronics',
      check: false
    },
    {
      type: 'Fashion',
      check: false
    },
    {
      type: 'Book',
      check: false
    },
    {
      type: 'Toys',
      check: false
    },
    {
      type: 'Home & Kitchen',
      check: false
    }
  ];

  Colors = [
    {
      type: 'text-primary'
    },
    {
      type: 'text-secondary'
    },
    {
      type: 'text-danger'
    },
    {
      type: 'text-success'
    },
    {
      type: 'text-warning'
    },
    {
      type: 'text-info'
    },
    {
      type: 'text-dark'
    }
  ];
}
