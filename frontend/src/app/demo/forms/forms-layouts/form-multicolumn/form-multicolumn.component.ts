// angular import
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-form-multicolumn',
  imports: [CommonModule, SharedModule],
  templateUrl: './form-multicolumn.component.html',
  styleUrls: ['./form-multicolumn.component.scss']
})
export class FormMulticolumnComponent {}
