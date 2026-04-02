// angular import
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-check-mail',
  imports: [CommonModule, SharedModule],
  templateUrl: './check-mail.component.html',
  styleUrls: ['./check-mail.component.scss']
})
export class CheckMailComponent {}
