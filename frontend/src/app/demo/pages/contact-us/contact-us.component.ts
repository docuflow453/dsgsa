// angular import
import { Component, HostListener, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { BUY_NOW, DOCUMENTATION_PATH } from 'src/app/app-config';

// icons
import { IconService } from '@ant-design/icons-angular';
import {
  DiscordOutline,
  FacebookOutline,
  GithubOutline,
  InstagramOutline,
  LinkedinOutline,
  TwitterOutline
} from '@ant-design/icons-angular/icons';

@Component({
  selector: 'app-contact-us',
  imports: [CommonModule, RouterModule, SharedModule],
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss']
})
export class ContactUsComponent implements OnInit, OnDestroy {
  private iconService = inject(IconService);

  // public props
  isCollapsed = true;
  isScrolled: boolean = false;

  constructor() {
    this.iconService.addIcon(
      ...[TwitterOutline, DiscordOutline, InstagramOutline, FacebookOutline, TwitterOutline, LinkedinOutline, GithubOutline]
    );
  }

  // HostListener
  @HostListener('window:scroll', [])
  onWindowScroll() {
    // logic to check scroll position
    if (window.pageYOffset > 0) {
      this.isScrolled = true;
      document.querySelector('.navbar')?.classList.add('contact-nav');
      document.querySelector('.navbar')?.classList.remove('default');
    } else {
      this.isScrolled = false;
      document.querySelector('.navbar')?.classList.add('default');
      document.querySelector('.navbar')?.classList.remove('contact-nav');
    }
  }

  // lid cycle event
  ngOnInit() {
    document.querySelector('.navbar')?.classList.add('default');
    document.querySelector('.navbar')?.classList.add('contact-us');
  }

  ngOnDestroy() {
    document.querySelector('.navbar')?.classList.remove('contact-us');
  }

  // public method
  short_link = [
    {
      title: 'Help',
      support: [
        {
          support_link: 'Blog',
          url: 'https://www.dressagesa.com/'
        },
        {
          support_link: 'Documentation',
          url: DOCUMENTATION_PATH
        },
        {
          support_link: 'Change Log',
          url: `${DOCUMENTATION_PATH + '/changelog'}`
        },
        {
          support_link: 'Support',
          url: 'https://www.dressagesa.com/'
        }
      ]
    },
    {
      title: 'Store Help',
      support: [
        {
          support_link: 'License',
          url: 'https://www.dressagesa.com/license/'
        },
        {
          support_link: 'Refund Policy',
          url: 'https://www.dressagesa.com/terms-and-conditions/'
        },
        {
          support_link: 'Submit a Request',
          url: 'https://www.dressagesa.com/contact/'
        },
        {
          support_link: 'Affiliate',
          url: 'https://www.dressagesa.com/affiliate/'
        }
      ]
    },
    {
      title: 'Mantis Eco-System',
      support: [
        {
          support_link: 'CodeIgniter',
          url: 'https://www.dressagesa.com/item/mantis-codeigniter-admin-template/'
        },
        {
          support_link: 'React MUI',
          url: 'https://mui.com/store/items/mantis-react-admin-dashboard-template/'
        },
        {
          support_link: 'Angular',
          url: BUY_NOW
        },
        {
          support_link: 'Bootstrap 5',
          url: 'https://www.dressagesa.com/item/mantis-bootstrap-admin-dashboard/'
        },
        {
          support_link: '.Net',
          url: 'https://www.dressagesa.com/item/mantis-dotnet-bootstrap-dashboard-template/'
        },
        {
          support_link: 'Vue',
          url: 'https://www.dressagesa.com/item/mantis-vue-admin-template/'
        }
      ]
    },
    {
      title: 'More Products',
      support: [
        {
          support_link: 'Berry Angular',
          url: 'https://www.dressagesa.com/item/berry-angular-admin-dashboard-template/'
        },
        {
          support_link: 'Free Berry Angular',
          url: 'https://www.dressagesa.com/item/berry-angular-free-admin-template/'
        },
        {
          support_link: 'Angular Bundle',
          url: 'https://www.dressagesa.com/item/angular-mega-bundle/'
        },
        {
          support_link: 'Big Bundle',
          url: 'https://www.dressagesa.com/item/big-bundle/'
        },
        {
          support_link: 'Figma UI Kits',
          url: 'https://www.dressagesa.com/item/category/templates/figma/'
        }
      ]
    }
  ];

  socialLinks = [
    {
      link: 'https://www.instagram.com/codedthemes/',
      title: 'instagram',
      icon: 'instagram',
      theme: 'outline'
    },
    {
      link: 'https://x.com/codedthemes',
      title: 'twitter',
      icon: 'twitter',
      theme: 'outline'
    },
    {
      link: 'https://in.linkedin.com/company/codedthemes',
      title: 'linkedin',
      icon: 'linkedin',
      theme: 'outline'
    },
    {
      link: 'https://www.facebook.com/codedthemes/',
      title: 'facebook',
      icon: 'facebook',
      theme: 'outline'
    },
    {
      link: 'https://discord.com/invite/p2E2WhCb6s',
      title: 'Discord',
      icon: 'discord',
      theme: 'outline'
    },
    {
      link: 'https://github.com/codedthemes',
      title: 'Github',
      icon: 'github',
      theme: 'outline'
    }
  ];
}
