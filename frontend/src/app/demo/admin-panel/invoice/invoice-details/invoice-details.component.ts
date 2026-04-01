// angular import
import { Component, effect, inject } from '@angular/core';
import { RouterModule } from '@angular/router';

// icons
import { IconService } from '@ant-design/icons-angular';
import { DownloadOutline, EditOutline, PrinterOutline, ShareAltOutline } from '@ant-design/icons-angular/icons';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ThemeService } from 'src/app/theme/shared/service/customs-theme.service';

// third party
import { NgxPrintModule } from 'ngx-print';

@Component({
  selector: 'app-invoice-details',
  imports: [SharedModule, RouterModule, NgxPrintModule],
  templateUrl: './invoice-details.component.html',
  styleUrl: './invoice-details.component.scss'
})
export class InvoiceDetailsComponent {
  private iconService = inject(IconService);
  private themeService = inject(ThemeService);

  // public propos
  isDarkMode: boolean = false;
  iconsColors = 'text-dark';

  // constructor
  constructor() {
    this.iconService.addIcon(...[EditOutline, DownloadOutline, PrinterOutline, ShareAltOutline]);
    effect(() => {
      this.isDarkTheme(this.themeService.isDarkMode());
    });
  }

  // private methods
  private isDarkTheme(isDark: boolean) {
    this.isDarkMode = isDark;
    this.iconsColors = isDark === true ? 'text-white' : 'text-dark';
  }

  // public methods
  detailsIcons = [
    {
      icon: 'edit',
      link: '/invoice/edit'
    },
    {
      icon: 'printer'
    },
    {
      icon: 'share-alt'
    }
  ];

  address = [
    {
      type: 'Form',
      name: 'Garcia-Cameron and Sons',
      street: '8534 Saunders Hill Apt. 583',
      phone: '(970) 982-3353',
      email: 'brandon07@pierce.com'
    },
    {
      type: 'To',
      name: 'Dickinson-Cummerata',
      street: '55D Leatha Way Ernaburgh, NT 2146',
      phone: '75-9079921',
      email: 'kasandra.conn@borer.com'
    }
  ];

  products = [
    {
      id: 1,
      name: 'Mauris',
      description: 'Malesuada adipiscing',
      qty: 2,
      price: 80.0
    },
    {
      id: 2,
      name: 'Vitae',
      description: 'Hac egestas',
      qty: 3,
      price: 40.0
    },
    {
      id: 3,
      name: 'Mauris',
      description: 'Malesuada adipiscing',
      qty: 4,
      price: 80.0
    }
  ];
}
