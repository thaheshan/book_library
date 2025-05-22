import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BookService } from '../../core copy/services/book.service';
import { AuthService } from '../../core copy/services/auth.service';
import { Book } from '../../core copy/models/book.model';
import { Observable } from 'rxjs';
import { BookCardComponent } from '../../shared/components/book-card/book-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, BookCardComponent],
  template: `
    <div class="hero-section">
      <div class="container">
        <div class="hero-content">
          <h1 class="hero-title slide-up">Discover, Read & Share Books</h1>
          <p class="hero-subtitle slide-up">
            Your ultimate platform for book lovers and authors.
            Browse through our extensive collection of books, read and buy premium content.
          </p>
          <div class="hero-actions slide-up">
            <a routerLink="/books" class="btn-primary">Browse Books</a>
            <a routerLink="/auth/register" class="btn-secondary">Join Now</a>
          </div>
        </div>
      </div>
    </div>
    
    <div class="container">
      <section class="featured-section">
        <h2>Featured Books</h2>
        <div class="book-grid">
          <div *ngFor="let book of featuredBooks$ | async" class="book-item fade-in">
            <app-book-card 
              [book]="book" 
              [isAuthor]="isAuthor" 
              [hasAccess]="hasAccessToBook(book)"
              (buy)="purchaseBook($event)">
            </app-book-card>
          </div>
        </div>
        <div class="see-all-link">
          <a routerLink="/books">See All Books <i class="fas fa-arrow-right"></i></a>
        </div>
      </section>
      
      <section class="categories-section">
        <h2>Browse by Category</h2>
        <div class="categories-grid">
          <a routerLink="/categories/Classic" class="category-card fade-in">
            <div class="category-icon"><i class="fas fa-book"></i></div>
            <h3>Classic</h3>
            <p>Timeless literary masterpieces</p>
          </a>
          <a routerLink="/categories/Programming" class="category-card fade-in">
            <div class="category-icon"><i class="fas fa-code"></i></div>
            <h3>Programming</h3>
            <p>Software development and coding</p>
          </a>
          <a routerLink="/categories/Science" class="category-card fade-in">
            <div class="category-icon"><i class="fas fa-flask"></i></div>
            <h3>Science</h3>
            <p>Exploring scientific discoveries</p>
          </a>
          <a routerLink="/categories/Finance" class="category-card fade-in">
            <div class="category-icon"><i class="fas fa-chart-line"></i></div>
            <h3>Finance</h3>
            <p>Money management and investing</p>
          </a>
          <a routerLink="/categories/Self-Help" class="category-card fade-in">
            <div class="category-icon"><i class="fas fa-brain"></i></div>
            <h3>Self-Help</h3>
            <p>Personal growth and development</p>
          </a>
        </div>
      </section>
      
      <section class="cta-section">
        <div class="cta-content">
          <h2>Become an Author</h2>
          <p>Share your knowledge and stories with the world. Publish your books on BookSphere and reach thousands of readers.</p>
          <a routerLink="/auth/register" [queryParams]="{author: true}" class="btn-primary">Start Publishing</a>
        </div>
        <div class="cta-image">
          <img src="https://images.pexels.com/photos/3759098/pexels-photo-3759098.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="Author writing" class="author-image" />
        </div>
      </section>
    </div>
  `,
  styles: [`
    :host {
      --space-1: 0.25rem;
      --space-2: 0.5rem;
      --space-3: 1rem;
      --space-4: 1.5rem;
      --space-5: 2rem;
      --space-6: 3rem;

      --primary-600: #3b82f6;
      --primary-700: #2563eb;
      --secondary-700: #9333ea;

      --bg-secondary: #f9fafb;
      --text-primary: #111827;
      --text-secondary: #6b7280;
      --shadow-color: rgba(0, 0, 0, 0.1);

      --font-weight-bold: 700;
      --font-weight-medium: 500;
    }

    /* Hero Section */
    .hero-section {
      position: relative;
      background: linear-gradient(135deg, var(--primary-700), var(--secondary-700));
      color: white;
      padding: var(--space-6) 0;
      margin-bottom: var(--space-6);
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      min-height: 350px;
    }
    .hero-section::before {
      content: '';
      position: absolute;
      inset: 0;
      background-image: url('https://images.pexels.com/photos/590493/pexels-photo-590493.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1');
      background-size: cover;
      background-position: center;
      opacity: 0.25;
      z-index: 0;
      transition: opacity 0.3s ease;
    }
    .hero-content {
      position: relative;
      z-index: 1;
      max-width: 700px;
      padding: 0 var(--space-3);
    }
    .hero-title {
      font-size: 3rem;
      font-weight: var(--font-weight-bold);
      margin-bottom: var(--space-3);
      line-height: 1.2;
    }
    .hero-subtitle {
      font-size: 1.2rem;
      margin-bottom: var(--space-4);
      line-height: 1.5;
    }
    .hero-actions {
      display: flex;
      gap: var(--space-3);
      justify-content: center;
      flex-wrap: wrap;
    }
    .hero-actions a {
      padding: var(--space-2) var(--space-5);
      border-radius: 30px;
      font-weight: var(--font-weight-medium);
      text-decoration: none;
      transition: all 0.3s ease;
      cursor: pointer;
      min-width: 130px;
      display: inline-block;
    }
    .btn-primary {
      background-color: var(--primary-600);
      color: white;
      border: none;
    }
    .btn-primary:hover {
      background-color: var(--primary-700);
    }
    .btn-secondary {
      background-color: transparent;
      border: 2px solid white;
      color: white;
    }
    .btn-secondary:hover {
      background-color: white;
      color: var(--primary-700);
      border-color: var(--primary-700);
    }

    /* Featured & Categories Sections */
    .featured-section, .categories-section {
      margin-bottom: var(--space-6);
    }
    .featured-section h2, .categories-section h2 {
      font-size: 2rem;
      font-weight: var(--font-weight-bold);
      margin-bottom: var(--space-4);
      position: relative;
      display: inline-block;
      color: var(--text-primary);
    }
    .featured-section h2::after, .categories-section h2::after {
      content: '';
      position: absolute;
      bottom: -10px;
      left: 0;
      width: 60px;
      height: 4px;
      background-color: var(--primary-600);
      border-radius: 2px;
    }
    .book-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: var(--space-4);
    }
    .see-all-link {
      margin-top: var(--space-4);
      text-align: right;
    }
    .see-all-link a {
      display: inline-flex;
      align-items: center;
      gap: var(--space-1);
      color: var(--primary-600);
      font-weight: var(--font-weight-medium);
      transition: all 0.2s ease;
      text-decoration: none;
    }
    .see-all-link a:hover {
      color: var(--primary-700);
      gap: var(--space-2);
    }

    .categories-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: var(--space-4);
    }
    .category-card {
      background-color: var(--bg-secondary);
      border-radius: 0.5rem;
      padding: var(--space-4);
      text-align: center;
      box-shadow: 0 4px 6px var(--shadow-color);
      transition: all 0.3s ease;
      text-decoration: none;
      color: var(--text-primary);
      cursor: pointer;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 180px;
    }
    .category-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 12px 20px var(--shadow-color);
      text-decoration: none;
    }
    .category-icon {
      font-size: 2.5rem;
      color: var(--primary-600);
      margin-bottom: var(--space-3);
    }
    .category-card h3 {
      font-size: 1.2rem;
      font-weight: var(--font-weight-bold);
      margin-bottom: var(--space-2);
      color: var(--text-primary);
    }
    .category-card p {
      color: var(--text-secondary);
      font-size: 0.9rem;
      margin: 0;
    }

    /* CTA Section */
    .cta-section {
      background-color: var(--bg-secondary);
      border-radius: 0.5rem;
      overflow: hidden;
      margin-bottom: var(--space-6);
      display: flex;
      flex-wrap: wrap;
      box-shadow: 0 4px 20px var(--shadow-color);
      align-items: center;
    }
    .cta-content {
      flex: 1;
      padding: var(--space-5);
      min-width: 300px;
    }
    .cta-content h2 {
      font-size: 2rem;
      font-weight: var(--font-weight-bold);
      margin-bottom: var(--space-3);
      color: var(--text-primary);
    }
    .cta-content p {
      color: var(--text-secondary);
      font-size: 1rem;
      margin-bottom: var(--space-4);
      line-height: 1.5;
    }
    .cta-content a.btn-primary {
      font-weight: var(--font-weight-bold);
      padding: var(--space-2) var(--space-5);
      border-radius: 30px;
      background-color: var(--primary-600);
      color: white;
      display: inline-block;
      transition: background-color 0.3s ease;
      text-decoration: none;
      cursor: pointer;
    }
    .cta-content a.btn-primary:hover {
      background-color: var(--primary-700);
    }
    .cta-image {
      flex: 1;
      min-width: 280px;
      max-height: 350px;
      overflow: hidden;
      border-top-right-radius: 0.5rem;
      border-bottom-right-radius: 0.5rem;
    }
    .author-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }

    /* Animations */
    .slide-up {
      animation: slide-up 0.6s ease forwards;
      opacity: 0;
    }
    .fade-in {
      animation: fade-in 0.8s ease forwards;
      opacity: 0;
    }
    @keyframes slide-up {
      to {
        transform: translateY(0);
        opacity: 1;
      }
      from {
        transform: translateY(20px);
        opacity: 0;
      }
    }
    @keyframes fade-in {
      to {
        opacity: 1;
      }
      from {
        opacity: 0;
      }
    }

    /* Responsive */
    @media (max-width: 768px) {
      .hero-title {
        font-size: 2.2rem;
      }
      .hero-subtitle {
        font-size: 1rem;
      }
      .hero-actions {
        flex-direction: column;
        gap: var(--space-2);
      }
      .cta-section {
        flex-direction: column;
      }
      .cta-image {
        border-radius: 0;
        max-height: 200px;
        margin-top: var(--space-4);
      }
    }
  `]
})
export class HomeComponent implements OnInit {
  featuredBooks$!: Observable<Book[]>;
  isAuthor = false;

  constructor(
    private bookService: BookService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.featuredBooks$ = this.bookService.getFeaturedBooks();
    this.isAuthor = this.authService.isAuthor();
  }

  hasAccessToBook(book: Book): boolean {
    // Implement your logic here to check if user has access
    return this.authService.hasAccess(book.id);
  }

  purchaseBook(bookId: number): void {
    this.bookService.purchaseBook(bookId).subscribe({
      next: () => alert('Purchase successful!'),
      error: () => alert('Purchase failed. Try again later.')
    });
  }
}
