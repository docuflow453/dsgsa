import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface Feature {
  icon: string;
  title: string;
  description: string;
}

interface Stat {
  value: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  features: Feature[] = [
    {
      icon: 'bi-calendar-event',
      title: 'Competition Management',
      description: 'Browse and enter competitions across South Africa with ease. View schedules, classes, and riding orders in real-time.'
    },
    {
      icon: 'bi-trophy',
      title: 'Results & Rankings',
      description: 'Access comprehensive competition results and national rankings. Track your progress and achievements throughout the season.'
    },
    {
      icon: 'bi-people',
      title: 'Rider & Horse Registration',
      description: 'Manage your rider profile and register your horses. Keep all your documentation and memberships up to date.'
    },
    {
      icon: 'bi-credit-card',
      title: 'Online Payments',
      description: 'Secure online payment processing for competition entries, memberships, and levies. Quick and convenient checkout.'
    },
    {
      icon: 'bi-geo-alt',
      title: 'Provincial Network',
      description: 'Connect with clubs and show holding bodies across all provinces. Find competitions near you.'
    },
    {
      icon: 'bi-file-earmark-text',
      title: 'Document Management',
      description: 'Store and manage all your equestrian documents in one place. Never miss an expiry date with automated reminders.'
    }
  ];

  stats: Stat[] = [
    { value: '500+', label: 'Active Riders', icon: 'bi-people' },
    { value: '200+', label: 'Registered Horses', icon: 'bi-award' },
    { value: '50+', label: 'Annual Competitions', icon: 'bi-calendar-check' },
    { value: '9', label: 'Provinces', icon: 'bi-geo' }
  ];
}

