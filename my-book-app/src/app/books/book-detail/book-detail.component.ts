import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { BookService } from '../../services/book.service';
import { Book } from '../../models/book.model';
import { trigger, transition, style, animate, state } from '@angular/animations';

@Component({
  selector: 'app-book-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="detail-container">
      <div class="back-link">
        <a routerLink="/books">
          <i class="fas fa-arrow-left"></i> Back to Books
        </a>
      </div>
      
      <div *ngIf="loading" class="loading-container">
        <div class="spinner"></div>
      </div>
      
      <div *ngIf="error" class="error-container slide-in-up">
        <div class="error-content">
          <i class="fas fa-exclamation-circle fa-3x"></i>
          <h2>Error Loading Book</h2>
          <p>{{ error }}</p>
          <a routerLink="/books" class="btn btn-primary">Go Back</a>
        </div>
      </div>
      
      <div *ngIf="!loading && !error && book" class="book-detail slide-in-up" [@detailAnimation]="isVisible">
        <div class="book-cover-container">
          <img [src]="book.coverImage || 'https://images.pexels.com/photos/1907785/pexels-photo-1907785.jpeg?auto=compress&cs=tinysrgb&w=400'" 
               [alt]="book.title + ' cover'" 
               class="book-cover">
        </div>
        
        <div class="book-content">
          <div class="book-header">
            <h1 class="book-title">{{ book.title }}</h1>
            <div class="book-actions">
              <a [routerLink]="['/books', book.id, 'edit']" class="btn btn-secondary">
                <i class="fas fa-edit"></i> Edit
              </a>
              <button class="btn btn-danger" (click)="deleteBook()">
                <i class="fas fa-trash"></i> Delete
              </button>
            </div>
          </div>
          
          <div class="book-author">
            <span class="label">Author:</span>
            <span class="value">{{ book.author }}</span>
          </div>
          
          <div class="book-info-grid">
            <div class="info-item">
              <span class="label">ISBN:</span>
              <span class="value">{{ formatIsbn(book.isbn) }}</span>
            </div>
            
            <div class="info-item">
              <span class="label">Publication Date:</span>
              <span class="value">{{ formatDate(book.publicationDate) }}</span>
            </div>
            
            <div *ngIf="book.publisher" class="info-item">
              <span class="label">Publisher:</span>
              <span class="value">{{ book.publisher }}</span>
            </div>
            
            <div *ngIf="book.genre" class="info-item">
              <span class="label">Genre:</span>
              <span class="value genre-tag">{{ book.genre }}</span>
            </div>
            
            <div *ngIf="book.pageCount" class="info-item">
              <span class="label">Pages:</span>
              <span class="value">{{ book.pageCount }}</span>
            </div>
            
            <div *ngIf="book.rating" class="info-item">
              <span class="label">Rating:</span>
              <span class="value rating">
                <div class="stars">
                  <i *ngFor="let star of getStars(book.rating)" 
                     class="fas fa-star" 
                     [class.full]="star === 1" 
                     [class.half]="star === 0.5" 
                     [class.empty]="star === 0"></i>
                </div>
                <span class="rating-value">{{ book.rating.toFixed(1) }}</span>
              </span>
            </div>
          </div>
          
          <div *ngIf="book.description" class="book-description">
            <h3>Description</h3>
            <p>{{ book.description }}</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
   .detail-container {
  padding: 3rem 1rem;
  max-width: 960px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: var(--neutral-900);
  background-color: var(--neutral-50);
  min-height: 80vh;
  box-sizing: border-box;
}

.back-link {
  margin-bottom: 2.5rem;
}

.back-link a {
  display: inline-flex;
  align-items: center;
  color: var(--primary-600);
  font-weight: 600;
  font-size: 1.1rem;
  text-decoration: none;
  transition: color 0.25s ease, transform 0.25s ease;
  user-select: none;
}

.back-link a:hover,
.back-link a:focus-visible {
  color: var(--primary-800);
  outline: none;
  transform: translateX(-4px);
}

.back-link i {
  margin-right: 0.5rem;
  font-size: 1.2rem;
}

.loading-container {
  display: flex;
  justify-content: center;
  padding: 5rem 0;
}

.spinner {
  width: 3.5rem;
  height: 3.5rem;
  border: 4px solid var(--primary-200);
  border-top-color: var(--primary-600);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  will-change: transform;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.error-container {
  padding: 4rem 1rem;
  background-color: var(--error-100);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  max-width: 500px;
  margin: 0 auto;
  text-align: center;
  color: var(--error-800);
  user-select: none;
}

.error-content i {
  font-size: 3.5rem;
  margin-bottom: 1rem;
}

.error-content h2 {
  font-size: 2rem;
  margin-bottom: 1rem;
  font-weight: 700;
}

.error-content p {
  margin-bottom: 2rem;
  font-size: 1.1rem;
  line-height: 1.4;
}

.error-content .btn {
  font-weight: 600;
  padding: 0.6rem 1.8rem;
  font-size: 1rem;
  border-radius: var(--radius-md);
  background-color: var(--primary-600);
  color: white;
  border: none;
  transition: background-color 0.3s ease;
}

.error-content .btn:hover,
.error-content .btn:focus-visible {
  background-color: var(--primary-800);
  outline: none;
  cursor: pointer;
}

/* Book detail container */
.book-detail {
  display: flex;
  gap: 2.5rem;
  background-color: white;
  border-radius: var(--radius-lg);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
  overflow: hidden;
  padding: 1.5rem;
  will-change: transform, opacity;
  transition: box-shadow 0.3s ease;
}

.book-detail:hover,
.book-detail:focus-within {
  box-shadow: 0 16px 32px rgba(0, 0, 0, 0.18);
  outline: none;
}

/* Book cover */
.book-cover-container {
  flex: 0 0 280px;
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease;
  cursor: default;
}

.book-cover-container:hover {
  transform: scale(1.03);
}

.book-cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  border-radius: var(--radius-md);
  user-select: none;
}

/* Content */
.book-content {
  flex: 1;
  padding: 1.5rem 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.book-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.8rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.book-title {
  font-size: 2.5rem;
  font-weight: 700;
  line-height: 1.1;
  color: var(--neutral-900);
  flex: 1 1 auto;
  min-width: 200px;
  margin: 0;
}

.book-actions {
  display: flex;
  gap: 0.75rem;
  flex-shrink: 0;
}

.book-actions a,
.book-actions button {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 1rem;
  font-weight: 600;
  font-size: 1rem;
  border-radius: var(--radius-md);
  border: none;
  cursor: pointer;
  user-select: none;
  transition: background-color 0.3s ease, color 0.3s ease, box-shadow 0.25s ease;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.book-actions a {
  background-color: var(--primary-600);
  color: white;
  text-decoration: none;
}

.book-actions a:hover,
.book-actions a:focus-visible {
  background-color: var(--primary-800);
  outline: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.book-actions button {
  background-color: var(--error-600);
  color: white;
  border: none;
}

.book-actions button:hover,
.book-actions button:focus-visible {
  background-color: var(--error-800);
  outline: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

/* Author */
.book-author {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 2rem;
  color: var(--neutral-700);
}

.label {
  font-weight: 700;
  color: var(--neutral-600);
  margin-right: 0.5rem;
}

.value {
  color: var(--neutral-900);
  font-weight: 500;
}

/* Grid info */
.book-info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 1rem 2rem;
  margin-bottom: 2.5rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  background-color: var(--neutral-100);
  padding: 1rem 1.25rem;
  border-radius: var(--radius-md);
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.03);
  user-select: none;
  transition: background-color 0.3s ease;
}

.info-item:hover {
  background-color: var(--primary-50);
}

.info-item .label {
  margin-bottom: 0.35rem;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--neutral-500);
}

.genre-tag {
  background-color: var(--primary-100);
  color: var(--primary-700);
  padding: 0.2rem 0.8rem;
  border-radius: var(--radius-full);
  font-size: 0.9rem;
  font-weight: 600;
  align-self: flex-start;
  user-select: none;
}

.rating {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.stars {
  display: flex;
  gap: 4px;
}

.stars i {
  font-size: 1.15rem;
  color: var(--neutral-300);
  transition: color 0.3s ease;
}

.stars i.full {
  color: var(--warning-500);
}

.stars i.half {
  position: relative;
  color: var(--neutral-300);
}

.stars i.half::after {
  content: "\\f089";
  font-family: "Font Awesome 6 Free";
  font-weight: 900;
  position: absolute;
  left: 0;
  top: 0;
  width: 50%;
  overflow: hidden;
  color: var(--warning-500);
}

.rating-value {
  font-weight: 600;
  color: var(--neutral-700);
  font-size: 1.1rem;
  min-width: 30px;
  text-align: left;
}

/* Description */
.book-description h3 {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: var(--neutral-800);
  border-bottom: 2px solid var(--primary-200);
  padding-bottom: 0.25rem;
  user-select: none;
}

.book-description p {
  line-height: 1.7;
  font-size: 1rem;
  color: var(--neutral-700);
  white-space: pre-wrap;
}

/* Responsive */
@media (max-width: 992px) {
  .book-detail {
    flex-direction: column;
  }
  
  .book-cover-container {
    flex: 0 0 auto;
    height: 320px;
    margin-bottom: 1.5rem;
  }
}

@media (max-width: 576px) {
  .book-header {
    flex-direction: column;
    gap: 1rem;
  }
  
  .book-actions {
    justify-content: flex-start;
  }
}

  `],
  animations: [
    trigger('detailAnimation', [
      state('false', style({ opacity: 0, transform: 'translateY(20px)' })),
      state('true', style({ opacity: 1, transform: 'translateY(0)' })),
      transition('false => true', animate('0.4s ease-out'))
    ])
  ]
})
export class BookDetailComponent implements OnInit {
  book: Book | null = null;
  loading = true;
  error: string | null = null;
  isVisible = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookService: BookService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (!idParam) {
        this.error = 'Book ID is missing';
        this.loading = false;
        return;
      }
      
      const id = parseInt(idParam, 10);
      if (isNaN(id)) {
        this.error = 'Invalid Book ID';
        this.loading = false;
        return;
      }
      
      this.loadBook(id);
    });
  }

  loadBook(id: number): void {
    this.loading = true;
    this.error = null;
    
    this.bookService.getBook(id).subscribe({
      next: (book) => {
        this.book = book;
        this.loading = false;
        setTimeout(() => {
          this.isVisible = true;
        }, 100);
      },
      error: (error) => {
        this.error = error.message || 'Failed to load book details';
        this.loading = false;
      }
    });
  }

  formatIsbn(isbn: string): string {
    return isbn.replace(/(\d{3})(\d{1})(\d{5})(\d{3})(\d{1})/, '$1-$2-$3-$4-$5');
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  }

  getStars(rating: number): number[] {
    const stars: number[] = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating - fullStars >= 0.5;
    
    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(1);
    }
    
    // Add half star if needed
    if (hasHalfStar) {
      stars.push(0.5);
    }
    
    // Fill with empty stars
    while (stars.length < 5) {
      stars.push(0);
    }
    
    return stars;
  }

  deleteBook(): void {
    if (!this.book) return;
    
    if (confirm(`Are you sure you want to delete "${this.book.title}"?`)) {
      this.bookService.deleteBook(this.book.id).subscribe({
        next: () => {
          this.router.navigate(['/books']);
        },
        error: (error) => {
          console.error('Error deleting book', error);
          alert('Failed to delete book. Please try again.');
        }
      });
    }
  }
}