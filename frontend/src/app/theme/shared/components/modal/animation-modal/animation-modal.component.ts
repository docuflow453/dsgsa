// Angular import
import { CommonModule } from '@angular/common';
import { Component, input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-animation-modal',
  imports: [CommonModule],
  templateUrl: './animation-modal.component.html',
  styleUrls: ['./animation-modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AnimationModalComponent {
  // public props
  modalClass = input.required<string>();
  contentClass = input<string>();
  modalID = input.required<string>();
  backDrop = input<boolean>(false);

  // public method
  close(event: string) {
    (document.querySelector('#' + event) as HTMLElement).classList.remove('md-show');
  }
}
