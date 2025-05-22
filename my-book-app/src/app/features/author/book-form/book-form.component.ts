import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { BookService } from '../../../core copy/services/book.service';
import { Book } from '../../../core copy/models/book.model';

@Component({
  selector: 'app-book-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="container">
      <div class="page-header">
        <h1>{{ isEditMode ? 'Edit Book' : 'Add New Book' }}</h1>
      </div>
      
      <div class="form-container">
        <form [formGroup]="bookForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="title" class="form-label">Book Title</label>
            <input 
              type="text" 
              id="title" 
              formControlName="title" 
              class="form-control"
              [ngClass]="{'invalid': submitted && f.title.errors}"
              placeholder="Enter book title">
            <div *ngIf="submitted && f.title.errors" class="error-message">
              <span *ngIf="f.title.errors.required">Title is required</span>
            </div>
          </div>
          
          <div class="form-group">
            <label for="author" class="form-label">Author</label>
            <input 
              type="text" 
              id="author" 
              formControlName="author" 
              class="form-control"
              [ngClass]="{'invalid': submitted && f.author.errors}"
              placeholder="Enter author name">
            <div *ngIf="submitted && f.author.errors" class="error-message">
              <span *ngIf="f.author.errors.required">Author is required</span>
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="isbn" class="form-label">ISBN</label>
              <input 
                type="text" 
                id="isbn" 
                formControlName="isbn" 
                class="form-control"
                [ngClass]="{'invalid': submitted && f.isbn.errors}"
                placeholder="e.g., 9781234567890">
              <div *ngIf="submitted && f.isbn.errors" class="error-message">
                <span *ngIf="f.isbn.errors.required">ISBN is required</span>
              </div>
            </div>
            
            <div class="form-group">
              <label for="publicationDate" class="form-label">Publication Date</label>
              <input 
                type="date" 
                id="publicationDate" 
                formControlName="publicationDate" 
                class="form-control"
                [ngClass]="{'invalid': submitted && f.publicationDate.errors}">
              <div *ngIf="submitted && f.publicationDate.errors" class="error-message">
                <span *ngIf="f.publicationDate.errors.required">Publication date is required</span>
              </div>
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="genre" class="form-label">Genre</label>
              <select 
                id="genre" 
                formControlName="genre" 
                class="form-control"
                [ngClass]="{'invalid': submitted && f.genre.errors}">
                <option value="">Select Genre</option>
                <option value="Classic">Classic</option>
                <option value="Programming">Programming</option>
                <option value="Science">Science</option>
                <option value="Finance">Finance</option>
                <option value="Self-Help">Self-Help</option>
                <option value="Fiction">Fiction</option>
                <option value="Non-Fiction">Non-Fiction</option>
                <option value="Biography">Biography</option>
                <option value="History">History</option>
              </select>
              <div *ngIf="submitted && f.genre.errors" class="error-message">
                <span *ngIf="f.genre.errors.required">Genre is required</span>
              </div>
            </div>
            
            <div class="form-group">
              <label for="pages" class="form-label">Number of Pages</label>
              <input 
                type="number" 
                id="pages" 
                formControlName="pages" 
                class="form-control"
                placeholder="e.g., 250">
            </div>
          </div>
          
          <div class="form-group">
            <label for="description" class="form-label">Description</label>
            <textarea 
              id="description" 
              formControlName="description" 
              class="form-control text-area"
              [ngClass]="{'invalid': submitted && f.description.errors}"
              placeholder="Enter book description"></textarea>
            <div *ngIf="submitted && f.description.errors" class="error-message">
              <span *ngIf="f.description.errors.required">Description is required</span>
            </div>
          </div>
          
          <div class="form-group">
            <label for="coverImage" class="form-label">Cover Image URL</label>
            <input 
              type="text" 
              id="coverImage" 
              formControlName="coverImage" 
              class="form-control"
              placeholder="https://example.com/image.jpg">
            <div class="help-text">Enter a URL for the book cover image</div>
          </div>
          
          <div class="premium-section">
            <div class="form-group checkbox-group">
              <input type="checkbox" id="isPremium" formControlName="isPremium">
              <label for="isPremium" class="checkbox-label">
                This is a premium book (requires purchase)
              </label>
            </div>
            
            <div class="form-group" *ngIf="f.isPremium.value">
              <label for="price" class="form-label">Price ($)</label>
              <input 
                type="number" 
                id="price" 
                formControlName="price" 
                class="form-control"
                [ngClass]="{'invalid': submitted && f.isPremium.value && f.price.errors}"
                placeholder="e.g., 19.99"
                step="0.01">
              <div *ngIf="submitted && f.isPremium.value && f.price.errors" class="error-message">
                <span *ngIf="f.price.errors.required">Price is required for premium books</span>
                <span *ngIf="f.price.errors.min">Price must be greater than 0</span>
              </div>
            </div>
          </div>
          
          <div *ngIf="error" class="error-alert">
            {{ error }}
          </div>
          
          <div class="form-actions">
            <button type="button" class="btn-secondary" routerLink="/author/dashboard">
              Cancel
            </button>
            <button type="submit" class="btn-primary" [disabled]="loading">
              <span *ngIf="loading" class="loader"></span>
              <span *ngIf="!loading">{{ isEditMode ? 'Update Book' : 'Add Book' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .page-header {
      margin-bottom: var(--space-4);
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
    
    .form-container {
      background-color: var(--bg-secondary);
      border-radius: 0.5rem;
      padding: var(--space-4);
      box-shadow: 0 4px 6px var(--shadow-color);
      max-width: 800px;
      margin: 0 auto;
    }
    
    .form-row {
      display: flex;
      gap: var(--space-3);
    }
    
    .form-row .form-group {
      flex: 1;
    }
    
    .text-area {
      min-height: 150px;
      resize: vertical;
    }
    
    .premium-section {
      background-color: var(--accent-50);
      padding: var(--space-3);
      border-radius: 0.5rem;
      margin: var(--space-4) 0;
      border: 1px solid var(--accent-200);
    }
    
    .checkbox-group {
      display: flex;
      align-items: center;
      gap: var(--space-2);
    }
    
    .checkbox-label {
      color: var(--text-secondary);
      font-weight: var(--font-weight-medium);
    }
    
    .help-text {
      font-size: 0.85rem;
      color: var(--text-muted);
      margin-top: var(--space-1);
    }
    
    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: var(--space-3);
      margin-top: var(--space-4);
    }
    
    .error-alert {
      background-color: var(--error-100);
      color: var(--error-700);
      padding: var(--space-2) var(--space-3);
      border-radius: 0.25rem;
      margin-bottom: var(--space-3);
      font-size: 0.9rem;
    }
    
    .form-control.invalid {
      border-color: var(--error-500);
    }
    
    .error-message {
      color: var(--error-600);
      font-size: 0.8rem;
      margin-top: var(--space-1);
    }
    
    .loader {
      width: 20px;
      height: 20px;
      border: 3px solid rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      border-top-color: white;
      animation: spin 1s ease-in-out infinite;
    }
    
    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
    
    /* Responsive adjustments */
    @media (max-width: 768px) {
      .form-row {
        flex-direction: column;
        gap: 0;
      }
    }
  `]
})
export class BookFormComponent implements OnInit {
  bookForm: FormGroup;
  isEditMode: boolean = false;
  bookId: number | null = null;
  submitted: boolean = false;
  loading: boolean = false;
  error: string = '';
  
  constructor(
    private formBuilder: FormBuilder,
    private bookService: BookService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.bookForm = this.createForm();
  }
  
  ngOnInit(): void {
    this.bookId = Number(this.route.snapshot.paramMap.get('id'));
    this.isEditMode = !!this.bookId;
    
    if (this.isEditMode && this.bookId) {
      this.loading = true;
      this.bookService.getBookById(this.bookId).subscribe({
        next: (book) => {
          this.populateForm(book);
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Book not found or could not be loaded';
          this.loading = false;
        }
      });
    }
    
    // Add dynamic validation for price when isPremium changes
    this.bookForm.get('isPremium')?.valueChanges.subscribe(isPremium => {
      const priceControl = this.bookForm.get('price');
      if (isPremium) {
        priceControl?.setValidators([Validators.required, Validators.min(0.01)]);
      } else {
        priceControl?.clearValidators();
      }
      priceControl?.updateValueAndValidity();
    });
  }
  
  // Convenience getter for form fields
  get f() { return this.bookForm.controls; }
  
  createForm(): FormGroup {
    return this.formBuilder.group({
      title: ['', Validators.required],
      author: ['', Validators.required],
      isbn: ['', Validators.required],
      publicationDate: ['', Validators.required],
      description: ['', Validators.required],
      coverImage: [''],
      genre: ['', Validators.required],
      pages: [''],
      isPremium: [false],
      price: [''],
      rating: [null]
    });
  }
  
  populateForm(book: Book): void {
    this.bookForm.patchValue({
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      publicationDate: new Date(book.publicationDate).toISOString().split('T')[0],
      description: book.description,
      coverImage: book.coverImage,
      genre: book.genre,
      pages: book.pages,
      isPremium: book.isPremium,
      price: book.price,
      rating: book.rating
    });
  }
  
  onSubmit(): void {
    this.submitted = true;
    this.error = '';
    
    // Stop if form is invalid
    if (this.bookForm.invalid) {
      return;
    }
    
    const formValue = this.bookForm.value;
    
    // Convert publicationDate from string to Date
    formValue.publicationDate = new Date(formValue.publicationDate);
    
    this.loading = true;
    
    if (this.isEditMode && this.bookId) {
      // Update existing book
      const updatedBook: Book = {
        ...formValue,
        id: this.bookId
      };
      
      this.bookService.updateBook(updatedBook).subscribe({
        next: () => {
          this.router.navigate(['/books', this.bookId]);
        },
        error: (err) => {
          this.error = err.message || 'Failed to update book';
          this.loading = false;
        }
      });
    } else {
      // Add new book
      this.bookService.addBook(formValue).subscribe({
        next: (newBook) => {
          this.router.navigate(['/books', newBook.id]);
        },
        error: (err) => {
          this.error = err.message || 'Failed to add book';
          this.loading = false;
        }
      });
    }
  }
}