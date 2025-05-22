import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { BookService } from '../../../core copy/services/book.service';
import { AuthService } from '../../../core copy/services/auth.service';
import { Book } from '../../../core copy/models/book.model';

@Component({
  selector: 'app-book-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: "./bookdetail.html",
  styles: [`
    .loading-indicator, .error-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: var(--space-6);
      text-align: center;
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
    
    .error-icon {
      font-size: 3rem;
      color: var(--error-500);
      margin-bottom: var(--space-3);
    }
    
    .error-state h3 {
      font-size: 1.5rem;
      margin-bottom: var(--space-2);
      color: var(--text-primary);
    }
    
    .error-state p {
      color: var(--text-secondary);
      margin-bottom: var(--space-4);
    }
    
    .breadcrumb {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      margin-bottom: var(--space-4);
      color: var(--text-muted);
      font-size: 0.9rem;
    }
    
    .breadcrumb a {
      color: var(--primary-600);
      text-decoration: none;
    }
    
    .breadcrumb a:hover {
      text-decoration: underline;
    }
    
    .breadcrumb i {
      font-size: 0.8rem;
    }
    
    .book-container {
      display: flex;
      gap: var(--space-5);
      margin-bottom: var(--space-5);
      flex-wrap: wrap;
    }
    
    .book-image-container {
      flex: 0 0 300px;
      position: relative;
    }
    
    .book-cover {
      width: 100%;
      height: auto;
      border-radius: 0.5rem;
      box-shadow: 0 5px 15px var(--shadow-color);
    }
    
    .book-badges {
      position: absolute;
      top: var(--space-2);
      right: var(--space-2);
      display: flex;
      flex-direction: column;
      gap: var(--space-1);
    }
    
    .badge {
      padding: var(--space-1) var(--space-2);
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: var(--font-weight-medium);
      display: flex;
      align-items: center;
      gap: 4px;
    }
    
    .premium-badge {
      background-color: var(--accent-500);
      color: white;
    }
    
    .free-badge {
      background-color: var(--success-500);
      color: white;
    }
    
    .book-info {
      flex: 1;
      min-width: 300px;
    }
    
    .book-title {
      font-size: 2rem;
      font-weight: var(--font-weight-bold);
      color: var(--text-primary);
      margin: 0 0 var(--space-1);
      line-height: 1.2;
    }
    
    .book-author {
      font-size: 1.2rem;
      color: var(--text-secondary);
      margin-bottom: var(--space-3);
    }
    
    .book-meta {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      gap: var(--space-3);
      margin-bottom: var(--space-4);
      padding: var(--space-3);
      background-color: var(--bg-primary);
      border-radius: 0.5rem;
    }
    
    .meta-item {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      color: var(--text-secondary);
    }
    
    .meta-item i {
      color: var(--primary-600);
      width: 20px;
      text-align: center;
    }
    
    .book-description {
      margin-bottom: var(--space-4);
    }
    
    .book-description h3 {
      font-size: 1.2rem;
      font-weight: var(--font-weight-bold);
      margin-bottom: var(--space-2);
      color: var(--text-primary);
    }
    
    .book-description p {
      color: var(--text-secondary);
      line-height: 1.6;
    }
    
    .book-actions {
      display: flex;
      gap: var(--space-3);
      flex-wrap: wrap;
    }
    
    .btn-action {
      padding: var(--space-2) var(--space-3);
      border-radius: 0.25rem;
      font-weight: var(--font-weight-medium);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: var(--space-2);
      cursor: pointer;
      transition: all 0.2s ease;
      text-decoration: none;
      font-size: 1rem;
    }
    
    .buy-btn {
      background-color: var(--accent-500);
      color: white;
      border: none;
    }
    
    .buy-btn:hover {
      background-color: var(--accent-600);
    }
    
    .read-btn {
      background-color: var(--primary-600);
      color: white;
      border: none;
    }
    
    .read-btn:hover {
      background-color: var(--primary-700);
    }
    
    .edit-btn {
      background-color: var(--secondary-600);
      color: white;
      border: none;
    }
    
    .edit-btn:hover {
      background-color: var(--secondary-700);
    }
    
    .delete-btn {
      background-color: var(--error-600);
      color: white;
      border: none;
    }
    
    .delete-btn:hover {
      background-color: var(--error-700);
    }
    
    /* Responsive adjustments */
    @media (max-width: 768px) {
      .book-container {
        flex-direction: column;
      }
      
      .book-image-container {
        max-width: 250px;
        margin: 0 auto;
      }
    }
  `]
})
export class BookDetailComponent implements OnInit {
  book: Book | null = null;
  loading: boolean = true;
  error: string = '';
  isAuthor: boolean = false;
  hasAccess: boolean = false;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookService: BookService,
    private authService: AuthService
  ) {}
  
  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.isAuthor = this.authService.isAuthor();
    
    this.bookService.getBookById(id).subscribe({
      next: (book) => {
        this.book = book;
        this.loading = false;
        
        // Check if user has access to the book
        if (book.isPremium) {
          this.hasAccess = this.authService.hasAccessToBook(book.id);
        } else {
          this.hasAccess = true;
        }
      },
      error: (err) => {
        this.error = 'Book not found or could not be loaded';
        this.loading = false;
      }
    });
  }
  
  purchaseBook(): void {
    if (!this.book) return;
    
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/auth/login'], {
        queryParams: { returnUrl: `/books/${this.book.id}` }
      });
      return;
    }
    
    this.authService.purchaseBook(this.book.id).subscribe({
      next: () => {
        this.hasAccess = true;
        // Show success message or navigate to read page
      },
      error: (err) => {
        console.error('Error purchasing book', err);
        // Show error message
      }
    });
  }
  
  deleteBook(): void {
    if (!this.book) return;
    
    if (confirm(`Are you sure you want to delete "${this.book.title}"?`)) {
      this.bookService.deleteBook(this.book.id).subscribe({
        next: () => {
          this.router.navigate(['/books']);
        },
        error: (err) => {
          console.error('Error deleting book', err);
          alert('Failed to delete book. Please try again.');
        }
      });
    }
  }
}