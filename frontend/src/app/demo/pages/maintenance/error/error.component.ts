// angular import
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// project import
import { DASHBOARD_PATH } from 'src/app/app-config';

@Component({
  selector: 'app-error',
  imports: [CommonModule, RouterModule],
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent {
  // props
  dashboard_link = DASHBOARD_PATH;
}
