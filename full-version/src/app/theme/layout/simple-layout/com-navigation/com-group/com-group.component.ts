// angular import
import { Component, OnInit, input, inject } from '@angular/core';
import { Location, LocationStrategy } from '@angular/common';

// project import
import { MantisConfig } from 'src/app/app-config';
import { NavigationItem } from '../component-navigation';
import { ComItemComponent } from '../com-item/com-item.component';

@Component({
  selector: 'app-com-group',
  imports: [ComItemComponent],
  templateUrl: './com-group.component.html',
  styleUrl: './com-group.component.scss'
})
export class ComGroupComponent implements OnInit {
  private location = inject(Location);
  private locationStrategy = inject(LocationStrategy);

  // public props
  readonly item = input.required<NavigationItem>();

  // life cycle event
  ngOnInit() {
    let current_url = this.location.path();
    const baseHref = this.locationStrategy.getBaseHref();
    if (baseHref) {
      current_url = baseHref + this.location.path();
    }
    const link = "a.nav-link[ href='" + current_url + "' ]";
    const ele = document.querySelector(link);
    if (ele !== null && ele !== undefined) {
      const parent = ele.parentElement;
      const up_parent = parent?.parentElement?.parentElement;
      const last_parent = up_parent?.parentElement;
      if (parent?.classList.contains('pcoded-hasmenu')) {
        if (MantisConfig.layout === 'vertical') {
          parent.classList.add('pcoded-trigger');
        }
        parent.classList.add('active');
      } else if (up_parent?.classList.contains('pcoded-hasmenu')) {
        if (MantisConfig.layout === 'vertical') {
          up_parent.classList.add('pcoded-trigger');
        }
        up_parent.classList.add('active');
      } else if (last_parent?.classList.contains('pcoded-hasmenu')) {
        if (MantisConfig.layout === 'vertical') {
          last_parent.classList.add('pcoded-trigger');
        }
        last_parent.classList.add('active');
      }
    }
  }
}
