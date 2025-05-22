import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { BookService } from '../../../core copy/services/book.service';
import { AuthService } from '../../../core copy/services/auth.service';
import { Book } from '../../../core copy/models/book.model';
import { Observable } from 'rxjs';
import { BookCardComponent } from '../../../shared/components/book-card/book-card.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [CommonModule, RouterModule, BookCardComponent, FormsModule],
  template: `
    <div class="container">
      <div class="page-header">
        <h1>All Books</h1>
        
        <div class="filter-controls">
          <div class="filter-group">
            <label for="filter">Filter:</label>
            <select id="filter" [(ngModel)]="currentFilter" (change)="applyFilter()">
              <option value="all">All Books</option>
              <option value="premium">Premium Only</option>
              <option value="free">Free Only</option>
            </select>
          </div>
          
          <div class="filter-group">
            <label for="sort">Sort By:</label>
            <select id="sort" [(ngModel)]="currentSort" (change)="applySort()">
              <option value="title">Title</option>
              <option value="author">Author</option>
              <option value="rating">Rating</option>
              <option value="date">Publication Date</option>
            </select>
          </div>
        </div>
      </div>
      
      <div *ngIf="loading" class="loading-indicator">
        <div class="spinner"></div>
        <p>Loading books...</p>
      </div>
      
      <div *ngIf="!loading && books.length === 0" class="empty-state">
        <i class="fas fa-book-open empty-icon"></i>
        <h3>No books found</h3>
        <p>Try adjusting your filters or check back later.</p>
      </div>
      
      <div *ngIf="!loading && books.length > 0" class="book-grid">
        <div *ngFor="let book of books" class="book-item fade-in">
          <app-book-card 
            [book]="book" 
            [isAuthor]="isAuthor" 
            [hasAccess]="hasAccessToBook(book)"
            (buy)="purchaseBook($event)"
            (edit)="editBook($event)"
            (delete)="deleteBook($event)">
          </app-book-card>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-4);
      flex-wrap: wrap;
      gap: var(--space-3);
    }
    
    .page-header h1 {
      font-size: 2rem;
      font-weight: var(--font-weight-bold);
      position: relative;
      display: inline-block;
    }
    
    .page-header h1::after {
      content: '';
      position: absolute;
      bottom: -10px;
      left: 0;
      width: 60px;
      height: 4px;
      background-color: var(--primary-600);
      border-radius: 2px;
    }
    
    .filter-controls {
      display: flex;
      gap: var(--space-3);
      align-items: center;
    }
    
    .filter-group {
      display: flex;
      align-items: center;
      gap: var(--space-2);
    }
    
    .filter-group label {
      color: var(--text-secondary);
      font-weight: var(--font-weight-medium);
    }
    
    .filter-group select {
      padding: var(--space-1) var(--space-2);
      border: 1px solid var(--border-color);
      border-radius: 4px;
      background-color: var(--bg-secondary);
      color: var(--text-primary);
    }
    
    .book-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: var(--space-4);
      margin-bottom: var(--space-5);
    }
    
    .loading-indicator {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: var(--space-6);
      color: var(--text-secondary);
    }
    
    .spinner {
      width: 50px;
      height: 50px;
      border: 5px solid var(--bg-primary);
      border-top-color: var(--primary-600);
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: var(--space-3);
    }
    
    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
    
    .empty-state {
      text-align: center;
      padding: var(--space-6);
      color: var(--text-muted);
    }
    
    .empty-icon {
      font-size: 3rem;
      margin-bottom: var(--space-3);
      color: var(--text-muted);
    }
    
    .empty-state h3 {
      font-size: 1.5rem;
      margin-bottom: var(--space-2);
      color: var(--text-secondary);
    }
    
    /* Responsive adjustments */
    @media (max-width: 768px) {
      .page-header {
        flex-direction: column;
        align-items: flex-start;
      }
      
      .filter-controls {
        width: 100%;
        flex-direction: column;
        align-items: flex-start;
      }
      
      .filter-group {
        width: 100%;
      }
      
      .filter-group select {
        flex: 1;
      }
      
      .book-grid {
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      }
    }
  `]
})
export class BookListComponent implements OnInit {
  books: Book[] = [];
  loading: boolean = true;
  isAuthor: boolean = false;
  
  currentFilter: string = 'all';
  currentSort: string = 'title';
  
  constructor(
    private bookService: BookService,
    private authService: AuthService,
    private router: Router
  ) {}
  
  ngOnInit(): void {
    this.isAuthor = this.authService.isAuthor();
    this.loadBooks();
  }
  
  loadBooks(): void {
    this.loading = true;
    this.bookService.getBooks().subscribe({
      next: (books) => {
        this.books = books;
        this.applyFilter();
        this.applySort();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }
  
  applyFilter(): void {
    if (this.currentFilter === 'premium') {
      this.bookService.getPremiumBooks().subscribe(books => {
        this.books = books;
        this.applySort();
      });
    } else if (this.currentFilter === 'free') {
      this.bookService.getFreeBooks().subscribe(books => {
        this.books = books;
        this.applySort();
      });
    } else {
      // 'all' filter - already loaded in ngOnInit
      this.bookService.getBooks().subscribe(books => {
        this.books = books;
        this.applySort();
      });
    }
  }
  
  applySort(): void {
    switch (this.currentSort) {
      case 'title':
        this.books.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'author':
        this.books.sort((a, b) => a.author.localeCompare(b.author));
        break;
      case 'rating':
        this.books.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'date':
        this.books.sort((a, b) => new Date(b.publicationDate).getTime() - new Date(a.publicationDate).getTime());
        break;
    }
  }
  
  purchaseBook(book: Book): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/auth/login'], {
        queryParams: { returnUrl: `/books/${book.id}` }
      });
      return;
    }
    
    this.authService.purchaseBook(book.id).subscribe();
  }
  
  editBook(book: Book): void {
    this.router.navigate(['/author/books/edit', book.id]);
  }
  
  deleteBook(book: Book): void {
    if (confirm(`Are you sure you want to delete "${book.title}"?`)) {
      this.bookService.deleteBook(book.id).subscribe({
        next: () => {
          this.loadBooks();
        },
        error: (err) => {
          console.error('Error deleting book', err);
          alert('Failed to delete book. Please try again.');
        }
      });
    }
  }
  
  hasAccessToBook(book: Book): boolean {
    if (!book.isPremium) {
      return true;
    }
    
    if (!this.authService.isAuthenticated()) {
      return false;
    }
    
    return this.authService.hasAccessToBook(book.id);
  }
}