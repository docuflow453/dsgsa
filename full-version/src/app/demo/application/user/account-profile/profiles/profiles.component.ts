// angular import
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';

//icons
import { IconService } from '@ant-design/icons-angular';
import { AimOutline, EnvironmentOutline, MailOutline, PhoneOutline } from '@ant-design/icons-angular/icons';

@Component({
  selector: 'app-profiles',
  imports: [CommonModule, SharedModule],
  templateUrl: './profiles.component.html',
  styleUrl: './profiles.component.scss'
})
export class ProfilesComponent {
  private iconService = inject(IconService);

  // constructor
  constructor() {
    this.iconService.addIcon(...[MailOutline, PhoneOutline, AimOutline, EnvironmentOutline]);
  }
  // public method
  profile = [
    {
      amount: '86',
      text: 'Post'
    },
    {
      amount: '40',
      text: 'Project'
    },
    {
      amount: '4.5K',
      text: 'Members'
    }
  ];

  details = [
    {
      icon: 'mail',
      text: 'anshan@gmail.com'
    },
    {
      icon: 'phone',
      text: '(+1-876) 8654 239 581'
    },
    {
      icon: 'aim',
      text: 'New York'
    }
  ];

  skills = [
    {
      title: 'Junior',
      value: 30
    },
    {
      title: 'UX Researcher',
      value: 80
    },
    {
      title: 'Wordpress',
      value: 90
    },
    {
      title: 'HTML',
      value: 30
    },
    {
      title: 'Graphic Design',
      value: 95
    },
    {
      title: 'Code Style',
      value: 75
    }
  ];

  personal_details = [
    {
      title: 'Full Name',
      name: 'Anshan Handgun',
      sub_title: 'Father Name',
      f_name: 'Mr. Deepen Handgun',
      style: 'pt-0'
    },
    {
      title: 'Phone',
      name: '(+1-876) 8654 239 581',
      sub_title: 'Country',
      f_name: 'New York'
    },
    {
      title: 'Email',
      name: 'anshan.dh81@gmail.com',
      sub_title: 'Zip Code',
      f_name: '956 754'
    },
    {
      title: 'Address',
      name: 'Street 110-B Kalians Bag, Dewan, M.P. New York',
      style: 'pb-0'
    }
  ];

  education = [
    {
      title: 'Master Degree (Year)',
      detail: '2014-2017',
      sub_detail: '-',
      style: 'pt-0'
    },
    {
      title: 'Bachelor (Year)',
      detail: '2011-2013',
      sub_detail: 'Imperial College London'
    },
    {
      title: 'School (Year)',
      detail: '2009-2011',
      sub_detail: 'School of London, England',
      style: 'pb-0'
    }
  ];

  employment = [
    {
      title: 'Senior',
      name: 'Senior UI/UX designer (Year)',
      sub_title: 'Job Responsibility',
      f_name:
        'Perform task related to project manager with the 100+ team under my observation. Team management is key role in this company',
      style: 'pt-0'
    },
    {
      title: 'Trainee cum Project Manager (Year)',
      name: '2017-2019',
      sub_title: 'Job Responsibility',
      f_name: 'Team management is key role in this company.'
    },
    {
      title: 'School (Year)',
      name: '2009-2011',
      sub_title: 'Institute',
      f_name: 'School of London, England',
      style: 'pb-0'
    }
  ];
}
