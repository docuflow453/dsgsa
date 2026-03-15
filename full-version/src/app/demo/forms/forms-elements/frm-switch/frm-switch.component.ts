// angular import
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-frm-switch',
  imports: [CommonModule, SharedModule],
  templateUrl: './frm-switch.component.html',
  styleUrls: ['./frm-switch.component.scss']
})
export class FrmSwitchComponent {
  // public method
  switches = [
    { label: 'primary', class: 'input-primary' },
    { label: 'secondary', class: 'input-secondary' },
    { label: 'success', class: 'input-success' },
    { label: 'danger', class: 'input-danger' },
    { label: 'warning', class: 'input-warning' },
    { label: 'info', class: 'input-info' },
    { label: 'dark', class: 'input-dark' }
  ];
  switches_light = [
    { label: 'primary', class: 'input-light-primary' },
    { label: 'secondary', class: 'input-light-secondary' },
    { label: 'success', class: 'input-light-success' },
    { label: 'danger', class: 'input-light-danger' },
    { label: 'warning', class: 'input-light-warning' },
    { label: 'info', class: 'input-light-info' },
    { label: 'dark', class: 'input-light-dark' }
  ];
}
