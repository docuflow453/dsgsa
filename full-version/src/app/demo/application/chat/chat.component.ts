// angular import
import { Component, OnInit, TemplateRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import chatPerson from 'src/fake-data/chat.json';
import chatHistory from 'src/fake-data/chat-history.json';
import { ScrollbarComponent } from 'src/app/theme/shared/components/scrollbar/scrollbar.component';

// bootstrap import
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';

// icons
import { IconService } from '@ant-design/icons-angular';
import {
  CheckCircleFill,
  ClockCircleFill,
  InfoCircleOutline,
  MenuFoldOutline,
  MenuUnfoldOutline,
  MinusCircleFill,
  MoreOutline,
  PhoneOutline,
  SearchOutline,
  VideoCameraOutline,
  CheckOutline,
  LogoutOutline,
  SettingOutline,
  RightOutline,
  CloseOutline,
  MessageOutline,
  FolderOpenOutline,
  LinkOutline,
  FileDoneOutline,
  PictureOutline,
  FileSyncOutline,
  EditOutline,
  SmileOutline,
  PaperClipOutline,
  SoundOutline,
  SendOutline,
  BackwardOutline,
  ForwardOutline,
  CopyOutline,
  DeleteOutline,
  DownOutline
} from '@ant-design/icons-angular/icons';

interface chatPerson {
  id: number;
  name: string;
  company: string;
  role: string;
  work_email: string;
  personal_email: string;
  work_phone: string;
  personal_phone: string;
  location: string;
  avatar: string;
  status: string;
  lastMessage: string;
  birthdayText: string;
  unReadChatCount: number;
  online_status: string;
}

interface chatHistory {
  id: number;
  from: string;
  to: string;
  text: string;
  time: string;
}

@Component({
  selector: 'app-chat',
  imports: [CommonModule, SharedModule, ScrollbarComponent],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent implements OnInit {
  private offcanvasService = inject(NgbOffcanvas);
  private iconService = inject(IconService);

  // Private props
  isCollapsed = false;
  listIsCollapsed = true;
  infoCollapsed = false;
  status: string = 'active';
  message: string = '';
  errorMessage: string = '';
  getUser!: chatPerson;
  findUserHistory!: chatHistory[];
  chatHistory: chatPerson[] = chatPerson;
  chatData: chatHistory[] = chatHistory;
  selectedPersonId!: number;

  // constructor
  constructor() {
    this.iconService.addIcon(
      ...[
        MenuFoldOutline,
        CheckOutline,
        MenuUnfoldOutline,
        PhoneOutline,
        VideoCameraOutline,
        InfoCircleOutline,
        MoreOutline,
        CheckCircleFill,
        SearchOutline,
        ClockCircleFill,
        MinusCircleFill,
        LogoutOutline,
        SettingOutline,
        RightOutline,
        CloseOutline,
        PhoneOutline,
        MessageOutline,
        FolderOpenOutline,
        LinkOutline,
        FileDoneOutline,
        PictureOutline,
        FileSyncOutline,
        MoreOutline,
        EditOutline,
        SmileOutline,
        PaperClipOutline,
        SoundOutline,
        SendOutline,
        BackwardOutline,
        ForwardOutline,
        CopyOutline,
        DeleteOutline,
        DownOutline
      ]
    );
  }

  // life cycle hook
  ngOnInit() {
    this.getUser = chatPerson[0];
    this.findUserHistory = chatHistory.filter((x) => x.from === 'Alene' || x.to === 'Alene');
    this.selectedPersonId = this.getUser.id;
  }

  // public method
  chatPerson(id: number) {
    this.getUser = this.chatHistory.filter((x) => x.id === id)[0];
    this.findUserHistory = this.chatData.filter((message) => message.from === this.getUser.name || message.to === this.getUser.name);
    this.selectedPersonId = this.getUser.id;
  }

  sendNewMessage(name: string) {
    if (this.message.trim() !== '') {
      const newMessage = {
        id: Math.max(...this.chatHistory.map((message) => message.id), 0) + 1, // You need to implement a function to get the next available ID
        from: 'User1',
        to: name,
        text: this.message,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      this.findUserHistory.push(newMessage);
      this.message = '';
      this.errorMessage = '';
    } else {
      this.errorMessage = 'Please Enter Any Message.';
    }
  }

  userStatus(status: string) {
    this.status = status;
  }

  open(userList: TemplateRef<string>) {
    this.offcanvasService.open(userList, { position: 'start' });
  }
  openInfo(info: TemplateRef<string>) {
    this.offcanvasService.open(info, { position: 'end' });
  }

  icon_list = [
    {
      icon: 'phone'
    },
    {
      icon: 'message'
    },
    {
      icon: 'video-camera'
    }
  ];

  cards = [
    {
      title: 'All File',
      amount: '231',
      background: 'bg-light-primary',
      icon: 'folder-open',
      text_color: 'text-primary'
    },
    {
      title: 'All Link',
      amount: '231',
      background: 'bg-light-secondary',
      icon: 'link',
      text_color: 'text-secondary'
    }
  ];

  file = [
    {
      background: 'btn-light-success text-success',
      icon: 'file-done',
      title: 'Document',
      text: '123 files, 193MB'
    },
    {
      background: 'btn-light-warning text-warning',
      icon: 'picture',
      title: 'Photos',
      text: '53 files, 321MB'
    },
    {
      background: 'btn-light-primary',
      icon: 'file-sync',
      title: 'Other',
      text: '49 files, 193MB'
    }
  ];

  footer_icon = [
    {
      icon: 'smile'
    },
    {
      icon: 'paper-clip'
    },
    {
      icon: 'picture'
    },
    {
      icon: 'sound'
    }
  ];
}
