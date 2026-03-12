import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface NewsArticle {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  image: string;
}

@Component({
  selector: 'app-news',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})
export class NewsComponent {
  articles: NewsArticle[] = [
    {
      id: 1,
      title: 'National Championships Dates Announced',
      excerpt: 'The South African Dressage Federation has announced the dates for the 2026 National Championships, set to take place in June at the Pretoria Show Grounds.',
      date: '2026-03-10',
      category: 'Competitions',
      image: 'placeholder'
    },
    {
      id: 2,
      title: 'New Grading System Implementation',
      excerpt: 'Starting from April 2026, a new grading system will be implemented to better reflect rider and horse combinations across all levels.',
      date: '2026-03-05',
      category: 'Announcements',
      image: 'placeholder'
    },
    {
      id: 3,
      title: 'Western Cape Provincial Results',
      excerpt: 'Congratulations to all participants in the Western Cape Provincial Show. Full results are now available on the platform.',
      date: '2026-02-28',
      category: 'Results',
      image: 'placeholder'
    },
    {
      id: 4,
      title: 'Official Training Workshop Schedule',
      excerpt: 'The SAEF is hosting a series of training workshops for aspiring judges and technical delegates. Registration is now open.',
      date: '2026-02-20',
      category: 'Training',
      image: 'placeholder'
    }
  ];

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-ZA', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }
}

