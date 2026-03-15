// angular import
import { Component, inject } from '@angular/core';

// icons
import { IconService } from '@ant-design/icons-angular';
import {
  CloseCircleFill,
  DollarCircleFill,
  DownloadOutline,
  FileTextFill,
  FileTextOutline,
  HourglassFill,
  LinkOutline,
  MoreOutline,
  ReconciliationFill,
  SettingOutline,
  ShoppingFill
} from '@ant-design/icons-angular/icons';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { InvoiceChartComponent } from './invoice-chart/invoice-chart.component';
import { TotalExpensesChartComponent } from './total-expenses-chart/total-expenses-chart.component';

@Component({
  selector: 'app-invoice-dashboard',
  imports: [SharedModule, InvoiceChartComponent, TotalExpensesChartComponent],
  templateUrl: './invoice-dashboard.component.html',
  styleUrl: './invoice-dashboard.component.scss'
})
export class InvoiceDashboardComponent {
  private iconService = inject(IconService);

  // constructor
  constructor() {
    this.iconService.addIcon(
      ...[
        CloseCircleFill,
        DollarCircleFill,
        FileTextFill,
        HourglassFill,
        ReconciliationFill,
        ShoppingFill,
        MoreOutline,
        LinkOutline,
        DownloadOutline,
        FileTextOutline,
        SettingOutline
      ]
    );
  }

  // public method
  invoiceCard = [
    {
      title: 'All Invoices',
      icon: 'file-text',
      background: 'bg-primary'
    },
    {
      title: 'Reports',
      icon: 'reconciliation',
      background: 'bg-info'
    },
    {
      title: 'Paid',
      icon: 'dollar-circle',
      background: 'bg-success'
    },
    {
      title: 'Pending',
      icon: 'hourglass',
      background: 'bg-warning'
    },
    {
      title: 'Cancelled',
      icon: 'close-circle',
      background: 'bg-danger'
    },
    {
      title: 'Draft',
      icon: 'shopping',
      background: 'bg-primary'
    }
  ];

  UserList = [
    {
      avatar: 'assets/images/user/avatar-10.jpg',
      name: 'David Jones',
      value: '$329.20',
      time: '5 min ago'
    },
    {
      avatar: 'assets/images/user/avatar-8.jpg',
      name: 'Jenny Jones',
      value: '$182.89',
      time: '1 day ago'
    },
    {
      avatar: 'assets/images/user/avatar-6.jpg',
      name: 'Harry Ben',
      value: '3 week ago',
      time: '5 min ago'
    },
    {
      avatar: 'assets/images/user/avatar-5.jpg',
      name: 'Jenifer Vintage',
      value: '$182.89',
      time: '3 week ago'
    },
    {
      avatar: 'assets/images/user/avatar-3.jpg',
      name: 'Stebin Ben',
      value: '3 week ago',
      time: '1 month ago'
    }
  ];

  notificationList = [
    {
      title: 'Johnny sent you an invoice billed',
      link: true,
      linkValue: '$1,000',
      date: '2 August',
      icon: 'download',
      background: 'bg-light-success',
      text: false
    },
    {
      title: 'Sent an invoice to Aida Bugg amount of',
      link: true,
      linkValue: '$200',
      date: '7 hours ago',
      icon: 'file-text',
      background: 'bg-light-primary',
      text: false
    },
    {
      title: 'There was a failure to your setup',
      link: false,
      date: '5 hours ago',
      icon: 'setting',
      background: 'bg-light-danger',
      text: false
    },
    {
      title: 'Cristina danny invited to you join Meetingp',
      link: false,
      date: '6 hours ago',
      background: 'bg-light-primary',
      text: true
    },
    {
      title: 'Cristina danny invited to you join Meetingp',
      link: false,
      date: '5 hours ago',
      background: 'bg-light-primary',
      text: true
    }
  ];
}
