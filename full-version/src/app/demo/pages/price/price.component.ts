// angular import
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { BUY_NOW } from 'src/app/app-config';

// icons
import { IconService } from '@ant-design/icons-angular';
import { InfoCircleOutline } from '@ant-design/icons-angular/icons';

@Component({
  selector: 'app-price',
  imports: [CommonModule, SharedModule],
  templateUrl: './price.component.html',
  styleUrls: ['./price.component.scss']
})
export class PriceComponent {
  private iconService = inject(IconService);

  // public props
  isChecked = true;
  buy_now_link = BUY_NOW;

  // constructor
  constructor() {
    this.iconService.addIcon(...[InfoCircleOutline]);
  }

  // public methods
  priceCard = [
    {
      image: 'assets/images/pages/img-price-standard.svg',
      price_type: 'Standard',
      btn_type: 'btn-outline-primary bg-transparent text-primary',
      yearly: 69,
      monthly: 729,
      includeItems: [
        {
          available: true,
          title: 'One End Product'
        },
        {
          available: true,
          title: 'No attribution required'
        },
        {
          available: false,
          title: 'TypeScript'
        },
        {
          available: false,
          title: 'Figma Design Resources'
        },
        {
          available: false,
          title: 'Create Multiple Products'
        },
        {
          available: false,
          title: 'Create a SaaS Project'
        },
        {
          available: false,
          title: 'Resale Product'
        },
        {
          available: false,
          title: 'Separate sale of our UI Elements?'
        }
      ]
    },
    {
      image: 'assets/images/pages/img-price-standardplus.svg',
      price_type: 'Standard Plus',
      btn_type: 'btn-primary',
      yearly: 129,
      monthly: 1449,
      includeItems: [
        {
          available: true,
          title: 'One End Product'
        },
        {
          available: true,
          title: 'No attribution required'
        },
        {
          available: true,
          title: 'TypeScript'
        },
        {
          available: true,
          title: 'Figma Design Resources'
        },
        {
          available: false,
          title: 'Create Multiple Products'
        },
        {
          available: false,
          title: 'Create a SaaS Project'
        },
        {
          available: false,
          title: 'Resale Product'
        },
        {
          available: false,
          title: 'Separate sale of our UI Elements?'
        }
      ]
    },
    {
      image: 'assets/images/pages/img-price-extended.svg',
      price_type: 'Extended',
      btn_type: 'btn-outline-primary bg-transparent text-primary',
      yearly: 599,
      monthly: 7089,
      includeItems: [
        {
          available: true,
          title: 'One End Product'
        },
        {
          available: true,
          title: 'No attribution required'
        },
        {
          available: true,
          title: 'TypeScript'
        },
        {
          available: true,
          title: 'Figma Design Resources'
        },
        {
          available: false,
          title: 'Create Multiple Products'
        },
        {
          available: true,
          title: 'Create a SaaS Project'
        },
        {
          available: false,
          title: 'Resale Product'
        },
        {
          available: false,
          title: 'Separate sale of our UI Elements?'
        }
      ]
    }
  ];
}
