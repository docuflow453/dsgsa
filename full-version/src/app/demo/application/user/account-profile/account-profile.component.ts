// angular import
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

// project import
import { MyAccountComponent } from './my-account/my-account.component';
import { PersonalsComponent } from './personals/personals.component';
import { ProfilesComponent } from './profiles/profiles.component';
import { RoleComponent } from './role/role.component';
import { SharedModule } from 'src/app/theme/shared/shared.module';

// icons
import { IconService } from '@ant-design/icons-angular';
import { ContainerOutline, FileTextOutline, TeamOutline, UserOutline } from '@ant-design/icons-angular/icons';

@Component({
  selector: 'app-account-profile',
  imports: [
    CommonModule,
    ProfilesComponent,
    PersonalsComponent,
    MyAccountComponent,
    RoleComponent,
    SharedModule
  ],
  templateUrl: './account-profile.component.html',
  styleUrl: './account-profile.component.scss'
})
export class AccountProfileComponent {
  private iconService = inject(IconService);

  // constructor
  constructor() {
    this.iconService.addIcon(...[UserOutline, FileTextOutline, ContainerOutline, TeamOutline]);
  }
}
