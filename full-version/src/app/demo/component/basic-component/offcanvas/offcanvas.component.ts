// angular import
import { Component, ElementRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

// bootstrap import
import { NgbOffcanvas, OffcanvasDismissReasons } from '@ng-bootstrap/ng-bootstrap';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-offcanvas',
  imports: [CommonModule, SharedModule],
  templateUrl: './offcanvas.component.html',
  styleUrls: ['./offcanvas.component.scss']
})
export class OffcanvasComponent {
  private offcanvasService = inject(NgbOffcanvas);

  // private props
  closeResult = 'string';

  // private method
  open(content: ElementRef) {
    this.offcanvasService.open(content, { ariaLabelledBy: 'offcanvas-basic-title' }).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
  }

  private getDismissReason(reason: OffcanvasDismissReasons): string {
    if (reason === OffcanvasDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === OffcanvasDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on the backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  openTop(content1: ElementRef) {
    this.offcanvasService.open(content1, { position: 'top' });
  }

  openEnd(content: ElementRef) {
    this.offcanvasService.open(content, { position: 'end' });
  }

  openBottom(content1: ElementRef) {
    this.offcanvasService.open(content1, { position: 'bottom' });
  }

  openScroll(content: ElementRef) {
    this.offcanvasService.open(content, { scroll: true });
  }

  openBackdrop(content: ElementRef) {
    this.offcanvasService.open(content, { backdrop: true });
  }

  openBothOptions(content: ElementRef) {
    this.offcanvasService.open(content, { backdrop: true, scroll: true });
  }
}
