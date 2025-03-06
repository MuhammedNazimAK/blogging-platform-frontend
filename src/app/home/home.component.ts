import { Component, OnInit } from '@angular/core';
import { AuthModalService } from '../core/services/auth-modal.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  
  features = [
    {
      icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
      title: 'Immersive Reading Experience',
      description: 'Clean, distraction-free reading with customizable themes and typography.'
    },
    {
      icon: 'M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z',
      title: 'Community Interaction',
      description: 'Engage with authors and readers through comments, likes, and discussions.'
    },
    {
      icon: 'M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122',
      title: 'Personalized Discovery',
      description: 'AI-powered recommendations based on your reading preferences and history.'
    }
  ];
  
  testimonials = [
    {
      content: "This platform transformed how I share my ideas. The interface is intuitive, and the community feedback has been invaluable.",
      author: "Alex Johnson",
      role: "Tech Writer"
    },
    {
      content: "I've tried many blogging platforms, but this one offers the perfect balance of simplicity and powerful features.",
      author: "Sarah Williams",
      role: "Travel Blogger"
    },
    {
      content: "The analytics insights have helped me understand my audience better. My engagement has increased by 200% since joining.",
      author: "Michael Chen",
      role: "Content Creator"
    }
  ];

  constructor(private authModalService: AuthModalService) {}

  ngOnInit(): void {}

  openAuthModal(type: 'login' | 'signup'): void {
    this.authModalService.openModal(type);
  }
}