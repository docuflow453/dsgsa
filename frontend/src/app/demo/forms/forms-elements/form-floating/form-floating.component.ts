// angular import
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-form-floating',
  imports: [CommonModule, SharedModule],
  templateUrl: './form-floating.component.html',
  styleUrls: ['./form-floating.component.scss']
})
export class FormFloatingComponent {}
