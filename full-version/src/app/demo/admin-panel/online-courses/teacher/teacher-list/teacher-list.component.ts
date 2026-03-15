// angular import
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DecimalPipe } from '@angular/common';

// rxjs import
import { Observable } from 'rxjs';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { teacher } from './teacher-list-type';
import { TeacherListService } from './teacher-list.service';

// icon service
import { DeleteOutline, EditOutline, EyeOutline, PlusOutline } from '@ant-design/icons-angular/icons';
import { IconService } from '@ant-design/icons-angular';

@Component({
  selector: 'app-teacher-list',
  imports: [SharedModule, RouterModule],
  templateUrl: './teacher-list.component.html',
  styleUrl: './teacher-list.component.scss',
  providers: [TeacherListService, DecimalPipe]
})
export class TeacherListComponent {
  service = inject(TeacherListService);
  private iconService = inject(IconService);

  // public props
  teachers$: Observable<teacher[]>;
  total$: Observable<number>;

  // constructor
  constructor() {
    const service = this.service;

    this.teachers$ = service.teachers$;
    this.total$ = service.total$;
    this.iconService.addIcon(...[PlusOutline, EyeOutline, DeleteOutline, EditOutline]);
  }
}
