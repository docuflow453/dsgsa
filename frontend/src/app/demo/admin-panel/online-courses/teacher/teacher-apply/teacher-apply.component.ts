// angular import
import { Component, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';

// rxjs import
import { Observable } from 'rxjs';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { teacherApply } from './teacher-apply-type';
import { TeacherApplyService } from './teacher-apply.service';

// icon service
import { CheckOutline, CloseOutline, MoreOutline, PlusOutline } from '@ant-design/icons-angular/icons';
import { IconService } from '@ant-design/icons-angular';

@Component({
  selector: 'app-teacher-apply',
  imports: [SharedModule],
  templateUrl: './teacher-apply.component.html',
  styleUrl: './teacher-apply.component.scss',
  providers: [TeacherApplyService, DecimalPipe]
})
export class TeacherApplyComponent {
  service = inject(TeacherApplyService);
  private iconService = inject(IconService);

  // public props
  teacherApply$: Observable<teacherApply[]>;
  total$: Observable<number>;

  // constructor
  constructor() {
    const service = this.service;

    this.teacherApply$ = service.teachers$;
    this.total$ = service.total$;
    this.iconService.addIcon(...[PlusOutline, CheckOutline, CloseOutline, MoreOutline]);
  }
}
