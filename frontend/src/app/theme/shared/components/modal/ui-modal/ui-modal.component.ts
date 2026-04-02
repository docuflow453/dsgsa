// Angular import
import { CommonModule } from '@angular/common';
import { Component, input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-ui-modal',
  imports: [CommonModule],
  templateUrl: './ui-modal.component.html',
  styleUrls: ['./ui-modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UiModalComponent {
  // public props
  dialogClass = input.required<string>();
  hideHeader = input<boolean>(false);
  hideFooter = input<boolean>(false);
  containerClick = input<boolean>(true);
  visible = false;
  visibleAnimate = false;

  // public method
  show(): void {
    this.visible = true;
    setTimeout(() => (this.visibleAnimate = true), 100);
    (document.querySelector('body') as HTMLBodyElement).classList.add('modal-open');
  }

  hide(): void {
    this.visibleAnimate = false;
    setTimeout(() => (this.visible = false), 300);
    (document.querySelector('body') as HTMLBodyElement).classList.remove('modal-open');
  }

  onContainerClicked(event: MouseEvent): void {
    if ((<HTMLElement>event.target).classList.contains('modal') && this.containerClick()) {
      this.hide();
    }
  }
}
