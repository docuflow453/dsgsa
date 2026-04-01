// angular import
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-account-setting',
  imports: [CommonModule, SharedModule],
  templateUrl: './account-setting.component.html',
  styleUrl: './account-setting.component.scss'
})
export class AccountSettingComponent {
  // public props
  email_setting = [
    {
      title: 'Email Notification',
      check: true
    },
    {
      title: 'Send Copy To Personal Email',
      check: false
    }
  ];
  notification = [
    {
      title: 'News about PCT-themes products and feature updates',
      check: true
    },
    {
      title: 'Tips on getting more out of PCT-themes',
      check: true
    },
    {
      title: 'Things you missed since you last logged into PCT-themes',
      check: false
    },
    {
      title: 'News about products and other services',
      check: false
    },
    {
      title: 'Tips and Document business products',
      check: false
    }
  ];
  active_email = [
    {
      title: 'Have new notifications',
      check: true
    },
    {
      title: "You're sent a direct message",
      check: false
    },
    {
      title: 'Someone adds you as a connection',
      check: true
    }
  ];
}
