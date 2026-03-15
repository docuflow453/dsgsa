// Angular import
import { Component, input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

// bootstrap import
import { NgbCalendar, NgbDate, NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-forms-picker',
  imports: [CommonModule, SharedModule],
  templateUrl: './forms-picker.component.html',
  styleUrls: ['./forms-picker.component.scss']
})
export default class FormPickerComponent {
  parserFormatter = inject(NgbDateParserFormatter);
  calendar = inject(NgbCalendar);

  // private props
  equals = (one: NgbDateStruct, two: NgbDateStruct) =>
    one && two && two.year === one.year && two.month === one.month && two.day === one.day;

  before = (one: NgbDateStruct, two: NgbDateStruct) =>
    !one || !two
      ? false
      : one.year === two.year
        ? one.month === two.month
          ? one.day === two.day
            ? false
            : one.day < two.day
          : one.month < two.month
        : one.year < two.year;

  after = (one: NgbDateStruct, two: NgbDateStruct) =>
    !one || !two
      ? false
      : one.year === two.year
        ? one.month === two.month
          ? one.day === two.day
            ? false
            : one.day > two.day
          : one.month > two.month
        : one.year > two.year;

  now = new Date();
  readonly testRangeDate = input.required<Date>();
  model!: NgbDateStruct;
  modelCustomDay!: NgbDateStruct;
  displayMonths = 3;
  navigation = 'select';
  showWeekNumbers = false;
  hoveredDate!: NgbDate;
  fromDate: NgbDate;
  toDate: NgbDate | null;
  disabled = true;
  modelPopup!: NgbDateStruct;
  modelDisabled: NgbDateStruct = {
    year: this.now.getFullYear(),
    month: this.now.getMonth() + 1,
    day: this.now.getDate()
  };
  date!: { year: number; month: number };

  // Constructor
  constructor() {
    const calendar = this.calendar;

    this.fromDate = calendar.getToday();
    this.toDate = calendar.getNext(calendar.getToday(), 'd', 10);
    const windowWidth = window.innerWidth;
    if (windowWidth >= 768 && windowWidth <= 1024) {
      this.displayMonths = 2;
      this.navigation = 'select';
    } else if (windowWidth < 768) {
      this.displayMonths = 1;
      this.navigation = 'select';
    } else {
      this.displayMonths = 3;
      this.navigation = 'none';
    }
  }

  // public method
  isWeekend(date: NgbDateStruct) {
    const d = new Date(date.year, date.month - 1, date.day);
    return d.getDay() === 0 || d.getDay() === 6;
  }

  isDisabled(date: NgbDateStruct, current: { month: number }) {
    return date.month !== current.month;
  }

  selectToday() {
    this.modelPopup = {
      year: this.now.getFullYear(),
      month: this.now.getMonth() + 1,
      day: this.now.getDate()
    };
  }

  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date.after(this.fromDate)) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
  }

  isHovered(date: NgbDate) {
    return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
  }

  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return date.equals(this.fromDate) || (this.toDate && date.equals(this.toDate)) || this.isInside(date) || this.isHovered(date);
  }
}
