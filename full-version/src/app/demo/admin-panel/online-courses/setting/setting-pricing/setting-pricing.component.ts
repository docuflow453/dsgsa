// angular import
import { Component, OnInit } from '@angular/core';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-setting-pricing',
  imports: [SharedModule],
  templateUrl: './setting-pricing.component.html',
  styleUrl: './setting-pricing.component.scss'
})
export class SettingPricingComponent implements OnInit {
  // public props
  activeButton!: string;

  // life cycle
  ngOnInit(): void {
    this.activeButton = 'Monthly';
  }

  // public methods
  setActiveButton(button: string): void {
    this.activeButton = button;
  }

  prices = [
    {
      type: 'basic',
      title: 'Basic',
      service: '03',
      yearly: 269,
      monthly: 69,
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
      type: 'popular',
      title: 'Basic',
      service: '05',
      yearly: 529,
      monthly: 129,
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
          available: true,
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
      type: 'Basic',
      title: 'Premium',
      service: '08',
      yearly: 1299,
      monthly: 599,
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
          available: true,
          title: 'Create Multiple Products'
        },
        {
          available: true,
          title: 'Create a SaaS Project'
        },
        {
          available: true,
          title: 'Resale Product'
        },
        {
          available: true,
          title: 'Separate sale of our UI Elements?'
        }
      ]
    }
  ];
}
