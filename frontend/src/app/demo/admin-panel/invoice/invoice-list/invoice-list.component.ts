// angular import
import { Component, inject } from '@angular/core';

// icons
import { IconService } from '@ant-design/icons-angular';
import { CaretDownOutline, CaretUpOutline, FileDoneOutline, InfoCircleOutline } from '@ant-design/icons-angular/icons';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { InvoiceListChartComponent } from './invoice-list-chart/invoice-list-chart.component';
import { InvoiceListTableComponent } from './invoice-list-table/invoice-list-table.component';

@Component({
  selector: 'app-invoice-list',
  imports: [SharedModule, InvoiceListChartComponent, InvoiceListTableComponent],
  templateUrl: './invoice-list.component.html',
  styleUrl: './invoice-list.component.scss'
})
export class InvoiceListComponent {
  private iconService = inject(IconService);

  // constructor
  constructor() {
    this.iconService.addIcon(...[CaretUpOutline, CaretDownOutline, FileDoneOutline, InfoCircleOutline]);
  }

  // public method
  widgetCards = [
    {
      title: 'Paid',
      isLoss: false,
      value: '$7,825',
      percentage: 70.5,
      color: 'text-success',
      invoice: '9',
      data: [0, 20, 10, 45, 30, 55, 20, 30],
      colors: ['#52c41a']
    },
    {
      title: 'Unpaid',
      isLoss: true,
      value: '$1,880',
      percentage: 27.4,
      color: 'text-warning',
      invoice: '6',
      data: [30, 20, 55, 30, 45, 10, 20, 0],
      colors: ['#faad14']
    },
    {
      title: 'Overdue',
      isLoss: true,
      value: '$3,507',
      percentage: 27.4,
      color: 'text-danger',
      invoice: '4',
      data: [0, 20, 10, 45, 30, 55, 20, 30],
      colors: ['#ff4d4f']
    }
  ];
}
