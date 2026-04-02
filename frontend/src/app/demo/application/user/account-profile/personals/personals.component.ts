// angular import
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';

//icons
import { IconService } from '@ant-design/icons-angular';
import { TwitterSquareFill, FacebookFill, LinkedinFill } from '@ant-design/icons-angular/icons';

@Component({
  selector: 'app-personals',
  imports: [CommonModule, SharedModule],
  templateUrl: './personals.component.html',
  styleUrl: './personals.component.scss'
})
export class PersonalsComponent {
  private iconService = inject(IconService);

  // constructor
  constructor() {
    this.iconService.addIcon(...[TwitterSquareFill, FacebookFill, LinkedinFill]);
  }
  // public method
  personal = [
    {
      label: 'First Name',
      value: 'Anshan',
      detail: 'First Name'
    },
    {
      label: 'Last Name',
      value: 'HAndgun',
      detail: 'Last Name'
    },
    {
      label: 'Country',
      value: 'New York',
      detail: 'Country Name'
    },
    {
      label: 'Zip Code',
      value: '956754',
      detail: 'Zip Code'
    }
  ];

  social_media = [
    {
      icon: 'twitter-square',
      background: 'text-twitter',
      style: 'mb-2',
      name: 'Twitter'
    },
    {
      icon: 'facebook',
      background: 'text-facebook',
      style: 'mb-2',
      name: 'Facebook'
    },
    {
      icon: 'linkedin',
      background: 'text-linkedin',
      name: 'Linkedin',
      style: 'mb-2'
    }
  ];
}
