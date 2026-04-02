// Angular import
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';

// third party
import { RecaptchaModule, RecaptchaFormsModule } from 'ng-recaptcha';

export interface FormModel {
  captcha?: string;
}

@Component({
  selector: 'app-re-captcha',
  imports: [CommonModule, SharedModule, RecaptchaModule, RecaptchaFormsModule],
  templateUrl: './re-captcha.component.html',
  styleUrls: ['./re-captcha.component.scss']
})
export class ReCaptchaComponent {
  // public props
  captcha?: string;
  formModel: FormModel = {};
}
