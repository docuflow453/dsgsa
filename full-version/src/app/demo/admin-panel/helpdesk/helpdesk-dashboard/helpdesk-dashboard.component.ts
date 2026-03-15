// angular import
import { Component, inject } from '@angular/core';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { SupportBarChartComponent } from './support-bar-chart/support-bar-chart.component';
import { SatisfactionChartComponent } from './satisfaction-chart/satisfaction-chart.component';

// icons
import { IconService } from '@ant-design/icons-angular';
import { BellOutline, FileTextOutline, MoreOutline, ReadOutline, ShoppingCartOutline } from '@ant-design/icons-angular/icons';

@Component({
  selector: 'app-helpdesk-dashboard',
  imports: [SharedModule, SupportBarChartComponent, SatisfactionChartComponent],
  templateUrl: './helpdesk-dashboard.component.html',
  styleUrl: './helpdesk-dashboard.component.scss'
})
export class HelpdeskDashboardComponent {
  private iconService = inject(IconService);

  // constructor
  constructor() {
    this.iconService.addIcon(...[MoreOutline, BellOutline, ShoppingCartOutline, FileTextOutline, ReadOutline]);
  }

  // public method
  socialMedia = [
    {
      name: 'Facebook Source',
      color: 'primary',
      sourceList: [
        {
          title: 'Page Profile',
          value: 25
        },
        {
          title: 'Favorite',
          value: 85
        },
        {
          title: 'Like Story',
          value: 65
        }
      ]
    },
    {
      name: 'Twitter Source',
      color: 'danger',
      sourceList: [
        {
          title: 'Wall Profile',
          value: 85
        },
        {
          title: 'Favorite',
          value: 25
        },
        {
          title: 'Like Tweets',
          value: 65
        }
      ]
    }
  ];

  activityList = [
    {
      color: 'bg-light-primary text-primary',
      icon: 'bell',
      title: 'You have 3 pending tasks.'
    },
    {
      color: 'bg-light-danger text-danger',
      icon: 'shopping-cart',
      title: 'New order received'
    },
    {
      color: 'bg-light-success text-success',
      icon: 'file-text',
      title: 'You have 3 pending tasks.'
    },
    {
      color: 'bg-light-warning text-warning',
      icon: 'shopping-cart',
      title: 'New order received'
    },
    {
      color: 'bg-light-primary text-primary',
      icon: 'bell',
      title: 'You have 3 pending tasks.'
    },
    {
      color: 'bg-light-danger text-danger',
      icon: 'shopping-cart',
      title: 'New order received'
    }
  ];
}
