// angular import
import { Component, OnDestroy, OnInit, Renderer2, inject } from '@angular/core';
import { RouterModule } from '@angular/router';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NavigationItem, componentMenus } from './component-navigation';
import { ComGroupComponent } from './com-group/com-group.component';
import { BreadcrumbComponent } from 'src/app/theme/shared/components/breadcrumb/breadcrumb.component';
import { ScrollbarComponent } from 'src/app/theme/shared/components/scrollbar/scrollbar.component';
import { SearchFilterPipe } from '../../../shared/components/pipe/search-filter.pipe';

// icons
import { IconService } from '@ant-design/icons-angular';
import { DatabaseOutline, SearchOutline } from '@ant-design/icons-angular/icons';

@Component({
  selector: 'app-com-navigation',
  imports: [SharedModule, RouterModule, ComGroupComponent, BreadcrumbComponent, SearchFilterPipe, ScrollbarComponent],
  templateUrl: './com-navigation.component.html',
  styleUrl: './com-navigation.component.scss'
})
export class ComNavigationComponent implements OnInit, OnDestroy {
  private renderer = inject(Renderer2);
  private iconService = inject(IconService);

  // public props
  navigations!: NavigationItem[];
  windowWidth!: number;
  searchFriends!: string;
  searchMenusItems!: string;

  // constructor
  constructor() {
    this.windowWidth = window.innerWidth;
    this.navigations = componentMenus;
    this.iconService.addIcon(...[DatabaseOutline, SearchOutline]);
  }

  // life cycle event
  ngOnInit() {
    if (this.windowWidth < 1025) {
      setTimeout(() => {
        (document.querySelector('.component-menubar') as HTMLDivElement).classList.add('menupos-static');
        (document.querySelector('#nav-ps-mantis') as HTMLElement).style.height = 'calc(100vh - 101px)';
      }, 500);
    }
    this.renderer.addClass(document.body, 'component');
    document.querySelector('.navbar')?.classList.add('component-page');
  }

  ngOnDestroy() {
    this.renderer.removeClass(document.body, 'component');
    document.querySelector('.navbar')?.classList.remove('component-page');
  }

  mobClick() {
    if (this.windowWidth < 1025) {
      document.querySelector('.component-menubar')?.classList.add('menu-open');
    } else {
      document.querySelector('.component-menubar')?.classList.remove('menu-open');
    }
  }

  closeOtherMenu() {
    document.querySelector('.component-menubar')?.classList.remove('menu-open');
  }
}
