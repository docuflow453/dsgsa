// angular import
import { Component, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';

// rxjs import
import { Observable } from 'rxjs';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { studentApply } from './student-apply-type';
import { StudentApplyService } from './student-apply.service';

// icon service
import { CheckOutline, CloseOutline, MoreOutline, PlusOutline } from '@ant-design/icons-angular/icons';
import { IconService } from '@ant-design/icons-angular';

@Component({
  selector: 'app-student-apply',
  imports: [SharedModule],
  templateUrl: './student-apply.component.html',
  styleUrl: './student-apply.component.scss',
  providers: [StudentApplyService, DecimalPipe]
})
export class StudentApplyComponent {
  service = inject(StudentApplyService);
  private iconService = inject(IconService);

  // public props
  studentApply$: Observable<studentApply[]>;
  total$: Observable<number>;

  // constructor
  constructor() {
    const service = this.service;

    this.studentApply$ = service.students$;
    this.total$ = service.total$;
    this.iconService.addIcon(...[PlusOutline, CheckOutline, CloseOutline, MoreOutline]);
  }
}
