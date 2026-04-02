// angular import
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DecimalPipe } from '@angular/common';

// rxjs import
import { Observable } from 'rxjs';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { student } from './student-list-type';
import { StudentListService } from './student-list.service';

// icon service
import { DeleteOutline, EditOutline, EyeOutline, PlusOutline } from '@ant-design/icons-angular/icons';
import { IconService } from '@ant-design/icons-angular';

@Component({
  selector: 'app-student-list',
  imports: [SharedModule, RouterModule],
  templateUrl: './student-list.component.html',
  styleUrl: './student-list.component.scss',
  providers: [StudentListService, DecimalPipe]
})
export class StudentListComponent {
  service = inject(StudentListService);
  private iconService = inject(IconService);

  // public props
  students$: Observable<student[]>;
  total$: Observable<number>;

  // constructor
  constructor() {
    const service = this.service;

    this.students$ = service.students$;
    this.total$ = service.total$;
    this.iconService.addIcon(...[PlusOutline, EyeOutline, DeleteOutline, EditOutline]);
  }
}
