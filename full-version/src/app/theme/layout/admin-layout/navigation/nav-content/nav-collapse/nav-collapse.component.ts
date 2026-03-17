// Angular import
import { Component, OnInit, input, output, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { RouterModule } from '@angular/router';

// project import
import { NavigationItem } from '../../navigation';
import { MantisConfig } from 'src/app/app-config';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NavItemComponent } from '../nav-item/nav-item.component';
import { AuthenticationService } from 'src/app/theme/shared/service';
import { Role } from 'src/app/theme/shared/components/_helpers/role';

@Component({
  selector: 'app-nav-collapse',
  imports: [CommonModule, SharedModule, RouterModule, NavItemComponent],
  templateUrl: './nav-collapse.component.html',
  styleUrls: ['./nav-collapse.component.scss']
})
export class NavCollapseComponent implements OnInit {
  private location = inject(Location);
  private authenticationService = inject(AuthenticationService);

  // public props
  readonly showCollapseItem = output();
  readonly item = input.required<NavigationItem>();
  readonly parentRole = input.required<string[]>();
  themeLayout!: string;
  windowWidth = window.innerWidth;
  current_url: string = '';
  isEnabled: boolean = false;

  ngOnInit() {
    this.themeLayout = MantisConfig.layout;
    const currentUserRole = this.authenticationService.currentUserValue?.user.role || Role.Admin;
    const parentRoleValue = this.parentRole();
    const item = this.item();

    // Default to enabled
    this.isEnabled = true;

    if (item.role && item.role.length > 0) {
      // Item has specific roles defined
      if (currentUserRole) {
        const parentRole = this.parentRole();
        const allowedFromParent = item.isMainParent || (parentRole && parentRole.length > 0 && parentRole.includes(currentUserRole));
        if (allowedFromParent) {
          // Check if current user role is in the item's allowed roles
          this.isEnabled = item.role.includes(currentUserRole);
        } else {
          // Parent doesn't allow this role
          this.isEnabled = false;
        }
      }
    } else if (parentRoleValue && parentRoleValue.length > 0) {
      // If item.role is empty, inherit from parent role
      if (currentUserRole) {
        this.isEnabled = parentRoleValue.includes(currentUserRole);
      }
    }
    // If no roles defined at all (item.role and parentRole both empty), item is enabled for all users
  }

  // Method to handle the collapse of the navigation menu
  navCollapse(e: MouseEvent) {
    let parent = e.target as HTMLElement;

    if (parent?.tagName === 'SPAN') {
      parent = parent.parentElement!;
    }

    if (this.themeLayout === 'vertical') {
      parent = (parent as HTMLElement).parentElement!;
    }

    const sections = document.querySelectorAll('.coded-hasmenu');
    for (let i = 0; i < sections.length; i++) {
      if (sections[i] !== parent) {
        sections[i].classList.remove('coded-trigger');
      }
    }

    let first_parent = parent.parentElement!;
    let pre_parent = ((parent as HTMLElement).parentElement as HTMLElement).parentElement!;
    if (first_parent.classList.contains('coded-hasmenu')) {
      do {
        first_parent.classList.add('coded-trigger');
        first_parent = (first_parent.parentElement as HTMLElement).parentElement!;
      } while (first_parent.classList.contains('coded-hasmenu'));
    } else if (pre_parent.classList.contains('coded-submenu')) {
      do {
        pre_parent.parentElement?.classList.add('coded-trigger');
        pre_parent = (((pre_parent as HTMLElement).parentElement as HTMLElement).parentElement as HTMLElement).parentElement!;
      } while (pre_parent.classList.contains('coded-submenu'));
    }
    parent.classList.toggle('coded-trigger');
  }

  // for Compact Menu
  subMenuCollapse(item: void) {
    this.showCollapseItem.emit(item);
  }
}
