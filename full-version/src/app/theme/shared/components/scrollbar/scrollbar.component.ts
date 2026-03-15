// angular import
import { Component, effect, inject, input } from '@angular/core';

// third party
import { NgScrollbarModule } from 'ngx-scrollbar';

// project import
import { ThemeService } from '../../service/customs-theme.service';

@Component({
  selector: 'app-scrollbar',
  imports: [NgScrollbarModule],
  templateUrl: './scrollbar.component.html',
  styleUrl: './scrollbar.component.scss'
})
export class ScrollbarComponent {
  private themeService = inject(ThemeService);

  customStyle = input<string>();

  direction: string = 'ltr';

  // constructor
  constructor() {
    effect(() => {
      this.isRtlTheme(this.themeService.isRTLMode());
    });
  }

  // private method
  private isRtlTheme(isRtl: boolean) {
    this.direction = isRtl === true ? 'rtl' : 'ltr';
  }
}
