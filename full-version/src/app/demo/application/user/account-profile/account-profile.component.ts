// angular import
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

// project import
import { AccountPasswordComponent } from './account-password/account-password.component';
import { AccountSettingComponent } from './account-setting/account-setting.component';
import { MyAccountComponent } from './my-account/my-account.component';
import { PersonalsComponent } from './personals/personals.component';
import { ProfilesComponent } from './profiles/profiles.component';
import { RoleComponent } from './role/role.component';
import { SharedModule } from 'src/app/theme/shared/shared.module';

// icons
import { IconService } from '@ant-design/icons-angular';
import { ContainerOutline, FileTextOutline, LockOutline, SettingOutline, TeamOutline, UserOutline } from '@ant-design/icons-angular/icons';

@Component({
  selector: 'app-account-profile',
  imports: [
    CommonModule,
    ProfilesComponent,
    PersonalsComponent,
    MyAccountComponent,
    AccountPasswordComponent,
    RoleComponent,
    AccountSettingComponent,
    SharedModule
  ],
  templateUrl: './account-profile.component.html',
  styleUrl: './account-profile.component.scss'
})
export class AccountProfileComponent {
  private iconService = inject(IconService);

  // constructor
  constructor() {
    this.iconService.addIcon(...[UserOutline, FileTextOutline, ContainerOutline, LockOutline, TeamOutline, SettingOutline]);
  }
}
