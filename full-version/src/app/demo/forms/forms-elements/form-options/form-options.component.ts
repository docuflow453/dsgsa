// angular import
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-form-options',
  imports: [CommonModule, SharedModule],
  templateUrl: './form-options.component.html',
  styleUrls: ['./form-options.component.scss']
})
export class FormOptionsComponent {}
