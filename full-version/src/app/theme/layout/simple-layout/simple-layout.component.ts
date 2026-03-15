// angular import
import { Component, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ConfigurationComponent } from '../admin-layout/configuration/configuration.component';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from '../../shared/service';
import { BUY_NOW, DASHBOARD_PATH, DOCUMENTATION_PATH } from 'src/app/app-config';

@Component({
  selector: 'app-simple-layouts',
  imports: [SharedModule, RouterModule, ConfigurationComponent],
  templateUrl: './simple-layout.component.html',
  styleUrl: './simple-layout.component.scss'
})
export class SimpleLayouts implements OnInit {
  private authenticationService = inject(AuthenticationService);

  // public props
  isCollapsed = true;
  buy_now_link = BUY_NOW;
  dashboard_link = DASHBOARD_PATH;
  docs_link = DOCUMENTATION_PATH;
  currentApplicationVersion = environment.appVersion;
  userLogin: boolean = false;

  // life cycle method
  ngOnInit() {
    if (this.authenticationService.currentUserValue) {
      this.userLogin = true;
    }
  }
}
