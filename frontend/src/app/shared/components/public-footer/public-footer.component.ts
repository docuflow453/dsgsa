import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-public-footer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './public-footer.component.html',
  styleUrls: ['./public-footer.component.scss']
})
export class PublicFooterComponent {
  currentYear = new Date().getFullYear();

  quickLinks = [
    { label: 'Home', route: '/' },
    { label: 'About Us', route: '/about' },
    { label: 'Provinces', route: '/provinces' },
    { label: 'National Calendar', route: '/calendar' }
  ];

  resources = [
    { label: 'Results', route: '/results' },
    { label: 'Officials', route: '/officials' },
    { label: 'News', route: '/news' },
    { label: 'Contact Us', route: '/contact' }
  ];

  socialLinks = [
    { icon: 'bi-facebook', url: '#', label: 'Facebook' },
    { icon: 'bi-twitter', url: '#', label: 'Twitter' },
    { icon: 'bi-instagram', url: '#', label: 'Instagram' },
    { icon: 'bi-youtube', url: '#', label: 'YouTube' }
  ];
}

