import { IDatePickerConfig } from 'node_modules/ng2-date-picker/lib/date-picker/date-picker-config.model';

export const DEF_CONF: IDatePickerConfig = {
  firstDayOfWeek: 'su',
  monthFormat: 'MMM, YYYY',
  disableKeypress: false,
  closeOnSelectDelay: 100,
  showNearMonthDays: true,
  enableMonthSelector: true,
  yearFormat: 'YYYY',
  showGoToCurrent: true
};
