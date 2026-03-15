// angular import
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { MonthlyBarChartComponent } from 'src/app/theme/shared/apexchart/monthly-bar-chart/monthly-bar-chart.component';
import { IncomeOverviewChartComponent } from 'src/app/theme/shared/apexchart/income-overview-chart/income-overview-chart.component';
import { AnalyticsChartComponent } from 'src/app/theme/shared/apexchart/analytics-chart/analytics-chart.component';
import { UserCardChartComponent } from 'src/app/theme/shared/apexchart/user-card-chart/user-card-chart.component';
import { SaleCardChartComponent } from 'src/app/theme/shared/apexchart/sale-card-chart/sale-card-chart.component';
import { OrderCardChartComponent } from 'src/app/theme/shared/apexchart/order-card-chart/order-card-chart.component';
import { MarketingCardChartComponent } from 'src/app/theme/shared/apexchart/marketing-card-chart/marketing-card-chart.component';
import { SalesReportChartComponent } from 'src/app/theme/shared/apexchart/sales-report-chart/sales-report-chart.component';
import { IncomeOverChartComponent } from 'src/app/theme/shared/apexchart/income-over-chart/income-over-chart.component';
import { AcquisitionChartComponent } from 'src/app/theme/shared/apexchart/acquisition-chart/acquisition-chart.component';

@Component({
  selector: 'app-widget-chart',
  imports: [
    CommonModule,
    SharedModule,
    MonthlyBarChartComponent,
    IncomeOverviewChartComponent,
    AnalyticsChartComponent,
    UserCardChartComponent,
    SaleCardChartComponent,
    OrderCardChartComponent,
    MarketingCardChartComponent,
    SalesReportChartComponent,
    IncomeOverChartComponent,
    AcquisitionChartComponent
  ],
  templateUrl: './widget-chart.component.html',
  styleUrls: ['./widget-chart.component.scss']
})
export class WidgetChartComponent {
  // private props
  channels = [
    {
      title: 'Top Channels',
      icon: 'ti ti-device-analytics',
      background: 'text-secondary bg-light-secondary',
      time: 'Today, 2:00 AM',
      amount: '+ $1,430',
      percentage: '35%'
    },
    {
      title: 'Top Pages',
      icon: 'ti ti-file-text',
      background: 'text-primary bg-light-primary',
      time: 'Today, 6:00 AM',
      amount: '- $1430',
      percentage: '35%'
    }
  ];
}
