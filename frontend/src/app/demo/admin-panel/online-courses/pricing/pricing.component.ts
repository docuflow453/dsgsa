// angular import
import { Component } from '@angular/core';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-pricing',
  imports: [SharedModule],
  templateUrl: './pricing.component.html',
  styleUrl: './pricing.component.scss'
})
export class PricingComponent {
  // public props
  selectedImage: string = 'assets/images/admin/price-regular.svg';
  selectedPackageIndex = 1;

  // public method
  priceList = [
    {
      title: 'FREE',
      type: 'Basic Features',
      price: 0,
      checked: false,
      imageSrc: 'assets/images/admin/price-free.svg',
      items: ['One End Product', 'No attribution required', 'TypeScript']
    },
    {
      title: 'REGULAR',
      type: 'Trending',
      price: 99,
      checked: true,
      imageSrc: 'assets/images/admin/price-regular.svg',
      items: ['One End Product', 'No attribution required', 'TypeScript', 'Figma Design Resources', 'Create Multiple Products']
    },
    {
      title: 'PRO',
      type: 'For advanced',
      price: 199,
      checked: false,
      imageSrc: 'assets/images/admin/price-pro.svg',
      items: [
        'One End Product',
        'No attribution required',
        'TypeScript',
        'Figma Design Resources',
        'Create Multiple Products',
        'Create a SaaS Project'
      ]
    },
    {
      title: 'Business',
      type: 'For advanced',
      price: 299,
      checked: false,
      imageSrc: 'assets/images/admin/price-business.svg',
      items: [
        'One End Product',
        'No attribution required',
        'TypeScript',
        'Figma Design Resources',
        'Create Multiple Products',
        'Create a SaaS Project',
        'Resale Product',
        'Separate sale of our UI Elements?'
      ]
    }
  ];

  onRadioChange(imageSrc: string) {
    this.selectedImage = imageSrc;
  }

  selectPackage(index: number): void {
    this.selectedPackageIndex = index;
  }
}
