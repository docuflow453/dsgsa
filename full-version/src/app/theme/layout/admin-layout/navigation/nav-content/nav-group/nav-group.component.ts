// Angular import
import { Component, OnInit, input, output, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';

// project import
import { NavigationItem } from '../../navigation';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NavCollapseComponent } from '../nav-collapse/nav-collapse.component';
import { NavItemComponent } from '../nav-item/nav-item.component';
import { AuthenticationService } from 'src/app/theme/shared/service';
import { Role } from 'src/app/theme/shared/components/_helpers/role';

@Component({
  selector: 'app-nav-group',
  imports: [CommonModule, SharedModule, NavCollapseComponent, NavItemComponent],
  templateUrl: './nav-group.component.html',
  styleUrls: ['./nav-group.component.scss']
})
export class NavGroupComponent implements OnInit {
  private location = inject(Location);
  private authenticationService = inject(AuthenticationService);

  // public props

  // All Version in Group Name
  readonly item = input.required<NavigationItem>();
  // for Compact Menu
  readonly showCollapseItem = output();

  current_url!: string;
  isVisible: boolean = true;

  // Life cycle events
  ngOnInit() {
    this.current_url = this.location.path();
    //eslint-disable-next-line
    //@ts-ignore
    const baseHref = this.location['_baseHref'] || '';
    this.current_url = baseHref + this.current_url;

    // Check if this group should be visible based on user role
    const currentUserRole = this.authenticationService.currentUserValue?.user.role || Role.Admin;
    const item = this.item();

    // If group has role restrictions, check if user has access
    if (item.role && item.role.length > 0) {
      this.isVisible = item.role.includes(currentUserRole);
    } else {
      // No role restrictions, visible to all
      this.isVisible = true;
    }

    // Use a more reliable way to find and update the active group
    setTimeout(() => {
      const links = document.querySelectorAll('a.nav-link') as NodeListOf<HTMLAnchorElement>;
      links.forEach((link: HTMLAnchorElement) => {
        if (link.getAttribute('href') === this.current_url) {
          let parent = link.parentElement;
          while (parent && parent.classList) {
            if (parent.classList.contains('coded-hasmenu')) {
              parent.classList.add('coded-trigger');
              parent.classList.add('active');
            }
            parent = parent.parentElement;
          }
        }
      });
    }, 0);
  }

  subMenuCollapse(item: void) {
    this.showCollapseItem.emit(item);
  }
}
