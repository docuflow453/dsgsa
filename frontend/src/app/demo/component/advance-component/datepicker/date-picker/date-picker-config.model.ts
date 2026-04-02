import { TDrops, TOpens } from '../common/type/poistions.type';
import { ElementRef } from '@angular/core';
import { IDayCalendarConfig } from 'ng2-date-picker';
import { IDayCalendarConfigInternal } from 'node_modules/ng2-date-picker/lib/day-calendar/day-calendar-config.model';
import { ITimeSelectConfig, ITimeSelectConfigInternal } from 'node_modules/ng2-date-picker/lib/time-select/time-select-config.model';

export interface IConfig {
  closeOnSelectDelay?: number;
  openOnFocus?: boolean;
  openOnClick?: boolean;
  disableKeypress?: boolean;
  inputElementContainer?: HTMLElement | string | ElementRef;
  drops?: TDrops;
  opens?: TOpens;
  hideInputContainer?: boolean;
  hideOnOutsideClick?: boolean;
}

export interface IDatePickerConfig extends IConfig, IDayCalendarConfig, ITimeSelectConfig {}

export interface IDatePickerConfigInternal extends IConfig, IDayCalendarConfigInternal, ITimeSelectConfigInternal {}
