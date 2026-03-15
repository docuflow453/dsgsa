// angular import
import { Component, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

// data
import tableData from 'src/fake-data/default-data.json';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { UserCardChartComponent } from 'src/app/theme/shared/apexchart/user-card-chart/user-card-chart.component';
import { MarketingCardChartComponent } from 'src/app/theme/shared/apexchart/marketing-card-chart/marketing-card-chart.component';
import { OrderCardChartComponent } from 'src/app/theme/shared/apexchart/order-card-chart/order-card-chart.component';
import { SaleCardChartComponent } from 'src/app/theme/shared/apexchart/sale-card-chart/sale-card-chart.component';
import { IncomeOverChartComponent } from 'src/app/theme/shared/apexchart/income-over-chart/income-over-chart.component';
import { SalesReportChartComponent } from 'src/app/theme/shared/apexchart/sales-report-chart/sales-report-chart.component';
import { AnalyticsChartComponent } from 'src/app/theme/shared/apexchart/analytics-chart/analytics-chart.component';
import { AcquisitionChartComponent } from 'src/app/theme/shared/apexchart/acquisition-chart/acquisition-chart.component';
import { ThemeService } from 'src/app/theme/shared/service/customs-theme.service';

// icons
import { IconService } from '@ant-design/icons-angular';
import { CheckOutline, ClockCircleOutline, CloseOutline, PlusOutline } from '@ant-design/icons-angular/icons';

@Component({
  selector: 'app-analytics',
  imports: [
    CommonModule,
    SharedModule,
    UserCardChartComponent,
    MarketingCardChartComponent,
    AcquisitionChartComponent,
    OrderCardChartComponent,
    AnalyticsChartComponent,
    SaleCardChartComponent,
    IncomeOverChartComponent,
    SalesReportChartComponent
  ],
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss']
})
export class AnalyticsComponent {
  private iconService = inject(IconService);
  private themeService = inject(ThemeService);

  // public props
  isDarkThemes!: boolean;

  // constructor
  constructor() {
    this.iconService.addIcon(...[CheckOutline, CloseOutline, ClockCircleOutline, PlusOutline]);
    effect(() => {
      this.isDarkTheme(this.themeService.isDarkMode());
    });
  }

  // private methods
  private isDarkTheme(isDark: boolean) {
    this.isDarkThemes = isDark;
  }

  // public method
  page_view = [
    {
      title: 'Admin Home',
      link: '/demo/admin/index.html',
      amount: '7755',
      percentage: '31.74%'
    },
    {
      title: 'Form Elements',
      link: '/demo/admin/forms.html',
      amount: '5215',
      percentage: '28.53%'
    },
    {
      title: 'Utilities',
      link: '/demo/admin/util.html',
      amount: '4848',
      percentage: '25.74%'
    },
    {
      title: 'Form Validation',
      link: '/demo/admin/validation.html',
      amount: '3275',
      percentage: '23.17%'
    },
    {
      title: 'Modals',
      link: '/demo/admin/modals.html',
      amount: '3003',
      percentage: '22.21%'
    }
  ];

  transaction = [
    {
      background: 'text-success bg-light-success',
      icon: 'check',
      title: 'Order #002434',
      time: 'Today, 2:00 AM',
      amount: '+ $1,430',
      percentage: '78%'
    },
    {
      background: 'text-danger bg-light-danger',
      icon: 'close',
      title: 'Order #984947',
      time: '5 August, 1:45 PM',
      amount: '- $302',
      percentage: '8%'
    },
    {
      background: 'text-primary bg-light-primary',
      icon: 'clock-circle',
      title: 'Order #988784',
      time: '7 hours ago',
      amount: '- $682',
      percentage: '16%'
    }
  ];

  recentOrder = tableData;

  summaryIncome = [
    {
      title: 'Published Project',
      color: 'primary',
      background: 'progress-primary',
      value: '30',
      percentage: '30%'
    },
    {
      title: 'Completed Task',
      color: 'success',
      background: 'progress-success',
      value: '90',
      percentage: '90%'
    },
    {
      title: 'Pending Task',
      color: 'danger',
      background: 'progress-danger',
      value: '50',
      percentage: '50%'
    },
    {
      title: 'Issues',
      color: 'warning',
      background: 'progress-warning',
      value: '55',
      percentage: '55%'
    }
  ];
}
