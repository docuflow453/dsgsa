// angular import
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-theme-vertical',
  imports: [CommonModule, SharedModule],
  templateUrl: './theme-vertical.component.html',
  styleUrls: ['./theme-vertical.component.scss']
})
export class ThemeVerticalComponent {}
