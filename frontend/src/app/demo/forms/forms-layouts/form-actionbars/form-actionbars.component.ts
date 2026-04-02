// angular import
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-form-actionbars',
  imports: [CommonModule, SharedModule],
  templateUrl: './form-actionbars.component.html',
  styleUrls: ['./form-actionbars.component.scss']
})
export class FormActionbarsComponent {}
