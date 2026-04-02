// angular import
import { Component, TemplateRef, inject } from '@angular/core';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ScrollbarComponent } from 'src/app/theme/shared/components/scrollbar/scrollbar.component';

// bootstrap import
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';

// third party
import { QuillModule } from 'ngx-quill';

// icons
import { IconService } from '@ant-design/icons-angular';
import {
  AppstoreOutline,
  BarsOutline,
  CalendarOutline,
  CheckOutline,
  DeleteOutline,
  EditOutline,
  EyeOutline,
  HeartFill,
  LinkOutline,
  LockFill,
  MenuOutline,
  MessageOutline
} from '@ant-design/icons-angular/icons';
@Component({
  selector: 'app-ticket-list',
  imports: [SharedModule, QuillModule, ScrollbarComponent],
  templateUrl: './ticket-list.component.html',
  styleUrl: './ticket-list.component.scss'
})
export class TicketListComponent {
  private iconService = inject(IconService);

  // public props
  selectedView = 'large-view';
  offcanvasService = inject(NgbOffcanvas);

  // constructor
  constructor() {
    this.iconService.addIcon(
      ...[
        AppstoreOutline,
        BarsOutline,
        MenuOutline,
        HeartFill,
        CalendarOutline,
        MessageOutline,
        DeleteOutline,
        EditOutline,
        CheckOutline,
        LinkOutline,
        EyeOutline,
        LockFill
      ]
    );
  }

  // public methods
  addContact(content: TemplateRef<string>) {
    this.offcanvasService.open(content, { position: 'end', panelClass: 'active-width' });
  }

  ticketCards = [
    {
      name: 'John lui'
    },
    {
      type: 'open-ticket',
      name: 'John pal'
    },
    {
      type: 'close-ticket',
      name: 'John doe'
    }
  ];

  tickets = [
    {
      src: 'assets/images/admin/p1.jpg',
      name: 'Piaf able',
      background: 'bg-light-danger',
      number: '1',
      type: 'border-bottom pb-3'
    },
    {
      src: 'assets/images/admin/p2.jpg',
      name: 'Pro able',
      type: 'border-bottom pb-3 pt-3'
    },
    {
      src: 'assets/images/admin/p3.jpg',
      name: 'CRM admin',
      background: 'bg-light-danger',
      number: '1',
      type: 'border-bottom pb-3 pt-3'
    },
    {
      src: 'assets/images/admin/p4.jpg',
      name: 'Alpha Pro',
      type: 'border-bottom pb-3 pt-3'
    },
    {
      src: 'assets/images/admin/p5.jpg',
      name: 'Carbon able',
      type: 'pb-3'
    }
  ];

  agents = [
    {
      src: 'assets/images/user/avatar-5.jpg',
      name: 'Tom Cook',
      background: 'bg-light-danger',
      number: '1'
    },
    {
      src: 'assets/images/user/avatar-4.jpg',
      name: 'Brad Larry',
      background: 'bg-light-danger',
      number: '1'
    },
    {
      src: 'assets/images/user/avatar-3.jpg',
      name: 'John White'
    },
    {
      src: 'assets/images/user/avatar-2.jpg',
      name: 'Mark Jobs'
    },
    {
      src: 'assets/images/user/avatar-1.jpg',
      name: 'Able Pro'
    }
  ];

  profiles = [
    {
      src: 'assets/images/user/avatar-5.jpg',
      uploadImage: false
    },
    {
      src: 'assets/images/user/avatar-4.jpg',
      uploadImage: true
    },
    {
      src: 'assets/images/user/avatar-3.jpg',
      uploadImage: false
    }
  ];

  img = [
    {
      image: 'assets/images/light-box/sl2.jpg'
    },
    {
      image: 'assets/images/light-box/sl5.jpg'
    },
    {
      image: 'assets/images/light-box/sl6.jpg'
    },
    {
      image: 'assets/images/light-box/sl1.jpg'
    }
  ];
}
