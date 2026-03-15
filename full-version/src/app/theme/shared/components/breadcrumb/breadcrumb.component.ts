// Angular Import
import { Component, input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterModule, Event } from '@angular/router';
import { Title } from '@angular/platform-browser';

// project import
import { SharedModule } from '../../shared.module';
import { NavigationItem, NavigationItems } from 'src/app/theme/layout/admin-layout/navigation/navigation';
import { componentMenus } from 'src/app/theme/layout/simple-layout/com-navigation/component-navigation';

// icons
import { IconDirective, IconService } from '@ant-design/icons-angular';
import { GlobalOutline, NodeExpandOutline } from '@ant-design/icons-angular/icons';

interface titleType {
  url: string | boolean | undefined;
  title: string;
  breadcrumbs: unknown;
  type: string;
  link?: string | undefined;
  description?: string | undefined;
  path?: string | undefined;
}

@Component({
  selector: 'app-breadcrumb',
  imports: [CommonModule, RouterModule, IconDirective, SharedModule],
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent {
  private route = inject(Router);
  private titleService = inject(Title);
  private iconService = inject(IconService);

  // public props
  type = input<string>('theme1');
  readonly dashboard = input(true);
  readonly Component = input(false);

  navigations: NavigationItem[];
  ComponentNavigations: NavigationItem[];
  breadcrumbList: Array<string> = [];
  navigationList!: titleType[];
  componentList!: titleType[];

  // constructor
  constructor() {
    this.navigations = NavigationItems;
    this.ComponentNavigations = componentMenus;
    this.setBreadcrumb();
    this.iconService.addIcon(...[GlobalOutline, NodeExpandOutline]);
  }

  // public method
  setBreadcrumb() {
    this.route.events.subscribe((router: Event) => {
      if (router instanceof NavigationEnd) {
        const activeLink = router.url;
        const activeItem = this.filterNavigation(this.navigations, activeLink);
        const componentItem = this.filterNavigation(this.ComponentNavigations, activeLink);

        if (activeItem) {
          this.navigationList = [activeItem];
          this.titleService.setTitle(activeItem.title + ' | Mantis Angular Admin Template');
        } else if (componentItem) {
          this.componentList = [componentItem];
          this.titleService.setTitle(componentItem.title + ' | Mantis Angular Admin Template');
        } else {
          this.titleService.setTitle('Welcome | Mantis Angular Admin Template');
        }
      }
    });
  }

  filterNavigation(navItems: NavigationItem[], activeLink: string): titleType | null {
    for (const navItem of navItems) {
      if (navItem.type === 'item' && 'url' in navItem && navItem.url === activeLink) {
        return {
          url: navItem.url || false,
          title: navItem.title,
          link: navItem.link,
          description: navItem.description,
          path: navItem.path,
          breadcrumbs: 'breadcrumbs' in navItem ? navItem.breadcrumbs : true,
          type: navItem.type
        };
      }
      if ((navItem.type === 'group' || navItem.type === 'collapse') && 'children' in navItem) {
        const activeItem = this.filterNavigation(navItem.children!, activeLink);
        if (activeItem) {
          return activeItem; // Return the child if found
        }
      }
    }
    return null; // Return null if no active item matches
  }
}
