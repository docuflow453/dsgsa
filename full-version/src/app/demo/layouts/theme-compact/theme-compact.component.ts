// angular import
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-theme-compact',
  imports: [CommonModule, SharedModule],
  templateUrl: './theme-compact.component.html',
  styleUrls: ['./theme-compact.component.scss']
})
export class ThemeCompactComponent {}
