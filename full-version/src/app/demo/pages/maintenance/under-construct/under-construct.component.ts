// angular import
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// project import
import { DASHBOARD_PATH } from 'src/app/app-config';

@Component({
  selector: 'app-under-construct',
  imports: [CommonModule, RouterModule],
  templateUrl: './under-construct.component.html',
  styleUrls: ['./under-construct.component.scss']
})
export class UnderConstructComponent {
  // props
  dashboard_link = DASHBOARD_PATH;
}
