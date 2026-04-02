// Angular import
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';

// third party
import { NarikCustomValidatorsModule } from '@narik/custom-validators';

export class FormInput {
  email!: string;
  password!: string;
  confirmPassword!: string;
  requiredInput!: string;
  url!: string;
  phone!: string;
  cmbGear!: string;
  address!: string;
  file!: string;
  switcher!: string;
}

@Component({
  selector: 'app-forms-validator',
  imports: [CommonModule, SharedModule, NarikCustomValidatorsModule],
  templateUrl: './forms-validator.component.html',
  styleUrls: ['./forms-validator.component.scss']
})
export default class FormsValidatorComponent implements OnInit {
  // private props
  formInput!: FormInput;
  form!: string;
  isSubmit: boolean;

  // Constructor
  constructor() {
    this.isSubmit = false;
  }

  // Life cycle events
  ngOnInit() {
    this.formInput = {
      email: '',
      password: '',
      confirmPassword: '',
      requiredInput: '',
      url: '',
      phone: '',
      cmbGear: '',
      address: '',
      file: '',
      switcher: ''
    };
  }

  // private method
  save(form: { valid: undefined }) {
    if (!form.valid) {
      this.isSubmit = true;
      return;
    }
  }
}
