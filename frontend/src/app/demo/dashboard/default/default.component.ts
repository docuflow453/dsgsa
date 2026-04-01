// angular import
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

// project import
import tableData from 'src/fake-data/default-data.json';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { MonthlyBarChartComponent } from 'src/app/theme/shared/apexchart/monthly-bar-chart/monthly-bar-chart.component';
import { IncomeOverviewChartComponent } from 'src/app/theme/shared/apexchart/income-overview-chart/income-overview-chart.component';
import { AnalyticsChartComponent } from 'src/app/theme/shared/apexchart/analytics-chart/analytics-chart.component';
import { SalesReportChartComponent } from 'src/app/theme/shared/apexchart/sales-report-chart/sales-report-chart.component';

// icons
import { IconService } from '@ant-design/icons-angular';
import { FallOutline, GiftOutline, MessageOutline, RiseOutline, SettingOutline } from '@ant-design/icons-angular/icons';

@Component({
  selector: 'app-default',
  imports: [
    CommonModule,
    SharedModule,
    MonthlyBarChartComponent,
    IncomeOverviewChartComponent,
    AnalyticsChartComponent,
    SalesReportChartComponent
  ],
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.scss']
})
export class DefaultComponent {
  private iconService = inject(IconService);

  // constructor
  constructor() {
    this.iconService.addIcon(...[RiseOutline, FallOutline, SettingOutline, GiftOutline, MessageOutline]);
  }

  // public method
  recentOrder = tableData;

  AnalyticEcommerce = [
    {
      title: 'Active Members',
      amount: '2,847',
      background: 'bg-light-primary ',
      border: 'border-primary',
      icon: 'rise',
      percentage: '12.5%',
      color: 'text-primary',
      number: '318'
    },
    {
      title: 'Registered Horses',
      amount: '3,562',
      background: 'bg-light-success ',
      border: 'border-success',
      icon: 'rise',
      percentage: '8.3%',
      color: 'text-success',
      number: '273'
    },
    {
      title: 'Competition Entries',
      amount: '1,245',
      background: 'bg-light-info ',
      border: 'border-info',
      icon: 'rise',
      percentage: '15.7%',
      color: 'text-info',
      number: '169'
    },
    {
      title: 'Total Revenue',
      amount: 'R 487,350',
      background: 'bg-light-warning ',
      border: 'border-warning',
      icon: 'rise',
      percentage: '22.4%',
      color: 'text-warning',
      number: 'R 89,250'
    }
  ];

  transaction = [
    {
      background: 'text-success bg-light-success',
      icon: 'gift',
      title: 'Entry Payment - Spring Championships',
      time: 'Today, 9:15 AM',
      amount: '+ R 3,450',
      percentage: '12 entries'
    },
    {
      background: 'text-primary bg-light-primary',
      icon: 'message',
      title: 'Membership Renewal - Premium',
      time: 'Yesterday, 3:30 PM',
      amount: '+ R 1,850',
      percentage: '5 members'
    },
    {
      background: 'text-info bg-light-info',
      icon: 'gift',
      title: 'Horse Registration Fees',
      time: '2 days ago',
      amount: '+ R 2,100',
      percentage: '7 horses'
    },
    {
      background: 'text-warning bg-light-warning',
      icon: 'setting',
      title: 'Judge Payment - Provincial Show',
      time: '3 days ago',
      amount: '- R 4,500',
      percentage: '3 judges'
    },
    {
      background: 'text-success bg-light-success',
      icon: 'gift',
      title: 'Entry Payment - Winter Series',
      time: '4 days ago',
      amount: '+ R 2,850',
      percentage: '9 entries'
    }
  ];
}
