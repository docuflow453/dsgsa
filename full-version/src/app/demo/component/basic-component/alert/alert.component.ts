// angular import
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';

interface Alert {
  type: string;
  message: string;
}

const ALERTS: Alert[] = [
  {
    type: 'success',
    message: 'This is an success alert'
  },
  {
    type: 'info',
    message: 'This is an info alert'
  },
  {
    type: 'warning',
    message: 'This is a warning alert'
  },
  {
    type: 'danger',
    message: 'This is a danger alert'
  },
  {
    type: 'primary',
    message: 'This is a primary alert'
  },
  {
    type: 'secondary',
    message: 'This is a secondary alert'
  },
  {
    type: 'dark',
    message: 'This is a dark alert'
  }
];

@Component({
  selector: 'app-alert',
  imports: [CommonModule, SharedModule, NgbAlertModule],
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent {
  // public props
  closableAlerts!: Alert[];

  // constructor
  constructor() {
    this.reset();
  }

  // public methods
  basicAlerts = [
    {
      type: 'primary',
      message: 'A simple primary alert—check it out!'
    },
    {
      type: 'secondary',
      message: 'A simple secondary alert—check it out!'
    },
    {
      type: 'success',
      message: 'A simple success alert—check it out!'
    },
    {
      type: 'danger',
      message: 'A simple danger alert—check it out!'
    },
    {
      type: 'warning',
      message: 'A simple warning alert—check it out!'
    },
    {
      type: 'info',
      message: 'A simple info alert—check it out!'
    },
    {
      type: 'dark',
      message: 'A simple dark alert—check it out!'
    }
  ];

  linkAlert = [
    {
      type: 'primary'
    },
    {
      type: 'secondary'
    },
    {
      type: 'success'
    },
    {
      type: 'danger'
    },
    {
      type: 'warning'
    },
    {
      type: 'info'
    },
    {
      type: 'dark'
    }
  ];

  close(alert: Alert) {
    this.closableAlerts.splice(this.closableAlerts.indexOf(alert), 1);
  }

  reset() {
    this.closableAlerts = Array.from(ALERTS);
  }
}
