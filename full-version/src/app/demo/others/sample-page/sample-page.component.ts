// angular import
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { Field, form } from '@angular/forms/signals';
interface CreateAccount {
  firstName: string;
}

@Component({
  selector: 'app-sample-page',
  imports: [CommonModule, SharedModule, Field],
  templateUrl: './sample-page.component.html',
  styleUrls: ['./sample-page.component.scss']
})
export class SamplePageComponent {
  private readonly account = signal<CreateAccount>({ firstName: '' });
  protected readonly accountForm = form(this.account);

  saveOne() {
    console.info(this.accountForm().value());
  }
}
