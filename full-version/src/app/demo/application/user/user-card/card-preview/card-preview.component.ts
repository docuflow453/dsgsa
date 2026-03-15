// angular import
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ScrollbarComponent } from 'src/app/theme/shared/components/scrollbar/scrollbar.component';

// icons
import { IconService } from '@ant-design/icons-angular';
import { MoreOutline } from '@ant-design/icons-angular/icons';

@Component({
  selector: 'app-card-preview',
  imports: [CommonModule, SharedModule, ScrollbarComponent],
  templateUrl: './card-preview.component.html',
  styleUrls: ['./card-preview.component.scss']
})
export class CardPreviewComponent {
  private iconService = inject(IconService);

  // constructor
  constructor() {
    this.iconService.addIcon(...[MoreOutline]);
  }

  // public props
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
    }
  ];

  userInformation = [
    { label: 'Father Name', value: 'Mr. Cole Holmes' },
    { label: 'Email', value: 'fehgup@gmail.com' },
    { label: 'Contact', value: '+1 (580) 415-3465' },
    { label: 'Location', value: 'Turks & Calicos Islands' },
    { label: 'Website', value: 'https://www.google.com/' }
  ];
}
