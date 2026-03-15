// angular import
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-mega-option',
  imports: [CommonModule, SharedModule],
  templateUrl: './mega-option.component.html',
  styleUrls: ['./mega-option.component.scss']
})
export class MegaOptionComponent {}
