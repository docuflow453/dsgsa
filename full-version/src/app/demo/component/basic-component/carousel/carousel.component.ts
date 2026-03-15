// angular import
import { Component, input, viewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';

// bootstrap import
import { NgbCarouselConfig, NgbCarousel, NgbSlideEvent, NgbSlideEventSource } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-carousel',
  imports: [CommonModule, SharedModule],
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent {
  // private props
  readonly showNavigationIndicators = input.required<boolean>();
  readonly carousel = viewChild.required<NgbCarousel>('carousel');
  paused = false;
  unpauseOnArrow = false;
  pauseOnIndicator = false;
  pauseOnHover = true;
  pauseOnFocus = true;

  // Constructor
  constructor() {
    const config = inject(NgbCarouselConfig);

    config.showNavigationArrows = true;
    config.showNavigationIndicators = true;
  }

  // private method
  togglePaused() {
    if (this.paused) {
      this.carousel().cycle();
    } else {
      this.carousel().pause();
    }
    this.paused = !this.paused;
  }

  onSlide(slideEvent: NgbSlideEvent) {
    if (
      this.unpauseOnArrow &&
      slideEvent.paused &&
      (slideEvent.source === NgbSlideEventSource.ARROW_LEFT || slideEvent.source === NgbSlideEventSource.ARROW_RIGHT)
    ) {
      this.togglePaused();
    }
    if (this.pauseOnIndicator && !slideEvent.paused && slideEvent.source === NgbSlideEventSource.INDICATOR) {
      this.togglePaused();
    }
  }
}
