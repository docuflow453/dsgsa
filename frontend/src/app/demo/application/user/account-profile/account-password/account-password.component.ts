// angular import
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';

// icons
import { IconService } from '@ant-design/icons-angular';
import { LineOutline } from '@ant-design/icons-angular/icons';

@Component({
  selector: 'app-account-password',
  imports: [CommonModule, SharedModule],
  templateUrl: './account-password.component.html',
  styleUrl: './account-password.component.scss'
})
export class AccountPasswordComponent {
  private iconService = inject(IconService);

  // constructor
  constructor() {
    this.iconService.addIcon(...[LineOutline]);
  }
  // public method
  passwords = [
    {
      label: 'Old Password'
    },
    {
      label: 'New Password'
    },
    {
      label: 'Confirm Password'
    }
  ];

  condition = [
    {
      text: 'At least 8 characters'
    },
    {
      text: 'At least 1 lower letter (a-z)'
    },
    {
      text: 'At least 1 uppercase letter (A-Z)'
    },
    {
      text: 'At least 1 number (0-9)'
    },
    {
      text: 'At least 1 special characters'
    }
  ];
}
