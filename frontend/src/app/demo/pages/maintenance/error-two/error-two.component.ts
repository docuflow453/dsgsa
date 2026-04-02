// angular import
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// project import
import { DASHBOARD_PATH } from 'src/app/app-config';

@Component({
  selector: 'app-error-two',
  imports: [CommonModule, RouterModule],
  templateUrl: './error-two.component.html',
  styleUrls: ['./error-two.component.scss']
})
export class ErrorTwoComponent {
  // props
  dashboard_link = DASHBOARD_PATH;
}
