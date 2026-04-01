// angular import
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DecimalPipe } from '@angular/common';

// rxjs import
import { Observable } from 'rxjs';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { membership } from './membership-list-type';
import { MembershipListService } from './membership-list.service';

// icon service
import { DeleteOutline, EditOutline, EyeOutline } from '@ant-design/icons-angular/icons';
import { IconService } from '@ant-design/icons-angular';

@Component({
  selector: 'app-membership-list',
  imports: [SharedModule, RouterModule],
  templateUrl: './membership-list.component.html',
  styleUrl: './membership-list.component.scss',
  providers: [MembershipListService, DecimalPipe]
})
export class MembershipListComponent {
  service = inject(MembershipListService);
  private iconService = inject(IconService);

  // public props
  memberships$: Observable<membership[]>;
  total$: Observable<number>;

  // constructor
  constructor() {
    const service = this.service;

    this.memberships$ = service.memberships$;
    this.total$ = service.total$;
    this.iconService.addIcon(...[EyeOutline, DeleteOutline, EditOutline]);
  }
}
