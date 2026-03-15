// angular import
import { Component, inject } from '@angular/core';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';

// icons
import { IconService } from '@ant-design/icons-angular';
import {
  CalendarOutline,
  ClockCircleOutline,
  DeleteOutline,
  EditOutline,
  LikeOutline,
  LockOutline,
  MailOutline,
  MessageOutline,
  StarOutline,
  UserOutline
} from '@ant-design/icons-angular/icons';

@Component({
  selector: 'app-ticket-details',
  imports: [SharedModule],
  templateUrl: './ticket-details.component.html',
  styleUrl: './ticket-details.component.scss'
})
export class TicketDetailsComponent {
  private iconService = inject(IconService);

  // constructor
  constructor() {
    this.iconService.addIcon(
      ...[
        StarOutline,
        LockOutline,
        MessageOutline,
        EditOutline,
        UserOutline,
        DeleteOutline,
        LikeOutline,
        MailOutline,
        CalendarOutline,
        ClockCircleOutline
      ]
    );
  }

  // public method
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
