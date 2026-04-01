// Angular Imports
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CalenderRoutingModule } from './calender-routing.module';
import { CalenderComponent } from './calender.component';
import { SharedModule } from 'src/app/theme/shared/shared.module';

// third party
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { FlatpickrDirective, provideFlatpickrDefaults } from 'angularx-flatpickr';

// bootstrap import
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    CalenderRoutingModule,
    SharedModule,
    NgbModalModule,
    FlatpickrDirective,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),
    CalenderComponent
  ],
  providers: [provideFlatpickrDefaults()]
})
export class CalenderModule {}
