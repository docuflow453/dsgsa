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

interface NewsArticle {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  date: string;
  link: string;
}

interface Event {
  id: number;
  title: string;
  date: string;
  location: string;
  type: string;
  status: 'Open' | 'Closing Soon' | 'Closed';
}

interface QuickLink {
  title: string;
  description: string;
  icon: string;
  route: string;
  color: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  newsArticles: NewsArticle[] = [
    {
      id: 1,
      title: 'National Championships 2026 Dates Announced',
      excerpt: 'The South African Dressage Championships will take place from 15-18 May 2026 at the Kyalami Equestrian Park...',
      image: 'assets/images/news/championships.jpg',
      category: 'Championships',
      date: 'March 10, 2026',
      link: '/news/1'
    },
    {
      id: 2,
      title: 'New Grading System Implementation',
      excerpt: 'DSRiding announces the rollout of an updated grading system aligned with international FEI standards...',
      image: 'assets/images/news/grading.jpg',
      category: 'Updates',
      date: 'March 8, 2026',
      link: '/news/2'
    },
    {
      id: 3,
      title: 'Western Cape Regional Results',
      excerpt: 'Congratulations to all riders who competed in the Western Cape Regional Championships last weekend...',
      image: 'assets/images/news/results.jpg',
      category: 'Results',
      date: 'March 5, 2026',
      link: '/news/3'
    }
  ];

  upcomingEvents: Event[] = [
    {
      id: 1,
      title: 'Spring Classic Dressage Show',
      date: 'March 22-24, 2026',
      location: 'Johannesburg Equestrian Centre',
      type: 'Regional',
      status: 'Open'
    },
    {
      id: 2,
      title: 'KZN Provincial Championships',
      date: 'April 5-7, 2026',
      location: 'Durban Dressage Arena',
      type: 'Provincial',
      status: 'Closing Soon'
    },
    {
      id: 3,
      title: 'Cape Town Dressage Festival',
      date: 'April 12-14, 2026',
      location: 'Cape Town Equestrian Park',
      type: 'Festival',
      status: 'Open'
    },
    {
      id: 4,
      title: 'Gauteng Open Competition',
      date: 'April 19-21, 2026',
      location: 'Pretoria Show Grounds',
      type: 'Open',
      status: 'Open'
    }
  ];

  quickLinks: QuickLink[] = [
    {
      title: 'Find Competitions',
      description: 'Browse upcoming competitions across all provinces',
      icon: 'bi-calendar-event',
      route: '/calendar',
      color: 'primary'
    },
    {
      title: 'View Results',
      description: 'Access competition results and rankings',
      icon: 'bi-trophy',
      route: '/results',
      color: 'success'
    },
    {
      title: 'Register Now',
      description: 'Create your rider account and get started',
      icon: 'bi-person-plus',
      route: '/auth/register',
      color: 'warning'
    },
    {
      title: 'Find Officials',
      description: 'Directory of judges and technical delegates',
      icon: 'bi-people',
      route: '/officials',
      color: 'info'
    }
  ];

  stats: Stat[] = [
    { value: '500+', label: 'Active Riders', icon: 'bi-people' },
    { value: '200+', label: 'Registered Horses', icon: 'bi-award' },
    { value: '50+', label: 'Annual Competitions', icon: 'bi-calendar-check' },
    { value: '9', label: 'Provinces', icon: 'bi-geo' }
  ];
}

