// angular import
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-my-account',
  imports: [CommonModule, SharedModule],
  templateUrl: './my-account.component.html',
  styleUrl: './my-account.component.scss'
})
export class MyAccountComponent {
  // public method
  advance_setting = [
    {
      title: 'Secure Browsing',
      text: "Browsing Securely ( https ) when it's necessary",
      style: 'pt-0'
    },
    {
      title: 'Login Notifications',
      text: 'Notify when login attempted from other place'
    },
    {
      title: 'Login Approvals',
      text: 'Approvals is not required when login from unrecognized devices.',
      style: 'pb-0'
    }
  ];

  recognized_device = [
    {
      title: 'Celt Desktop',
      text: '4351 Deans Lane',
      status_type: 'text-success',
      dot_background: 'bg-success',
      status: 'Active',
      style: 'pt-0'
    },
    {
      title: 'Imco Tablet',
      text: '4185 Michigan Avenue',
      status_type: 'text-muted',
      dot_background: 'bg-secondary',
      status: 'Active 5 days ago'
    },
    {
      title: 'Albs Mobile',
      text: '3462 Fairfax Drive',
      status_type: 'text-muted',
      dot_background: 'bg-secondary',
      status: ' Active 1 month ago',
      style: 'pb-0'
    }
  ];

  active_sessions = [
    {
      title: 'Celt Desktop',
      value: '4351 Deans Lane',
      style: 'pt-0'
    },
    {
      title: 'Moon Tablet',
      value: '4185 Michigan Avenue',
      style: 'pb-0'
    }
  ];
}
