// Angular import
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { AnimationModalComponent } from 'src/app/theme/shared/components/modal/animation-modal/animation-modal.component';

@Component({
  selector: 'app-adv-modal',
  imports: [CommonModule, SharedModule, AnimationModalComponent],
  templateUrl: './adv-modal.component.html',
  styleUrls: ['./adv-modal.component.scss']
})
export default class AdvModalComponent {
  // private Method
  openMyModal(event: string) {
    document.querySelector('#' + event)?.classList.add('md-show');
  }

  closeMyModal(event: {
    target: { parentElement: { parentElement: { parentElement: { classList: { remove: (arg0: string) => void } } } } };
  }) {
    event.target.parentElement.parentElement.parentElement.classList.remove('md-show');
  }
}
