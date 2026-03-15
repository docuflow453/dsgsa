// angular import
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-code-verify',
  imports: [CommonModule, SharedModule],
  templateUrl: './code-verify.component.html',
  styleUrls: ['./code-verify.component.scss']
})
export class CodeVerifyComponent {
  // public props
  tasks = [
    {
      mas: 'Please enter verification code. Character 1'
    },
    {
      mas: 'Please enter verification code. Character 2'
    },
    {
      mas: 'Please enter verification code. Character 3'
    },
    {
      mas: 'Please enter verification code. Character 4'
    }
  ];
}
