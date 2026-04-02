// Angular Imports
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// project Import
import { DatepickerRoutingModule } from './datepicker-routing.module';
import { DatepickerComponent } from './datepicker.component';
import { ConfigFormComponent } from './config-form/config-form.component';
import { SharedModule } from 'src/app/theme/shared/shared.module';

// third party
import { DpDatePickerModule } from 'ng2-date-picker';

@NgModule({
  imports: [CommonModule, DatepickerRoutingModule, DpDatePickerModule, SharedModule, DatepickerComponent, ConfigFormComponent]
})
export class DatepickerModule {}
