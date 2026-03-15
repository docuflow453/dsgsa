import { Component, OnDestroy, OnInit } from '@angular/core';
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

interface CountdownUnit {
  label: string;
  value: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
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

  countdown: CountdownUnit[] = [
    { label: 'Days', value: '00' },
    { label: 'Hours', value: '00' },
    { label: 'Minutes', value: '00' },
    { label: 'Seconds', value: '00' }
  ];

  private readonly launchDate = new Date(Date.now() + 120 * 24 * 60 * 60 * 1000);
  private intervalId?: number;

  ngOnInit(): void {
    this.updateCountdown();
    this.intervalId = window.setInterval(() => this.updateCountdown(), 1000);
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      window.clearInterval(this.intervalId);
    }
  }

  private updateCountdown(): void {
    const difference = Math.max(this.launchDate.getTime() - Date.now(), 0);
    const totalSeconds = Math.floor(difference / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    this.countdown = [
      { label: 'Days', value: String(days).padStart(2, '0') },
      { label: 'Hours', value: String(hours).padStart(2, '0') },
      { label: 'Minutes', value: String(minutes).padStart(2, '0') },
      { label: 'Seconds', value: String(seconds).padStart(2, '0') }
    ];
  }
}

