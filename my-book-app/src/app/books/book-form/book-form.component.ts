import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Book } from '../../models/book.model';
import { BookService } from '../../services/book.service';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';

@Component({
  selector: 'app-book-form',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  template: `
    <div class="form-container">
      <div class="back-link">
        <a routerLink="/books">
          <i class="fas fa-arrow-left"></i> Back to Books
        </a>
      </div>
      
      <div class="page-header slide-in-up">
        <h1>{{ isEditMode ? 'Edit Book' : 'Add New Book' }}</h1>
        <p>{{ isEditMode ? 'Update the details of your book' : 'Add a new book to your collection' }}</p>
      </div>
      
      <div *ngIf="loading" class="loading-container">
        <div class="spinner"></div>
      </div>
      
      <div *ngIf="error" class="error-container slide-in-up">
        <div class="error-content">
          <i class="fas fa-exclamation-circle fa-3x"></i>
          <h2>Error</h2>
          <p>{{ error }}</p>
          <a routerLink="/books" class="btn btn-primary">Go Back</a>
        </div>
      </div>
      
      <form *ngIf="!loading && !error" [formGroup]="bookForm" (ngSubmit)="onSubmit()" [@formAnimation]="formFields.length">
        <div class="form-card">
          <h2>Basic Information</h2>
          
          <div class="form-group" *ngFor="let field of formFields.slice(0, 5)">
            <label [for]="field.name" class="form-label">{{ field.label }}</label>
            <input 
              *ngIf="field.type !== 'textarea'" 
              [type]="field.type" 
              [id]="field.name" 
              class="form-control" 
              [class.is-invalid]="isFieldInvalid(field.name)"
              [formControlName]="field.name"
              [placeholder]="field.placeholder"
            >
            <textarea 
              *ngIf="field.type === 'textarea'" 
              [id]="field.name" 
              class="form-control" 
              [class.is-invalid]="isFieldInvalid(field.name)"
              [formControlName]="field.name"
              [placeholder]="field.placeholder"
              rows="4"
            ></textarea>
            <div *ngIf="isFieldInvalid(field.name)" class="invalid-feedback">
              {{ getErrorMessage(field.name) }}
            </div>
          </div>
        </div>
        
        <div class="form-card">
          <h2>Additional Details</h2>
          
          <div class="form-group" *ngFor="let field of formFields.slice(5)">
            <label [for]="field.name" class="form-label">{{ field.label }}</label>
            <input 
              *ngIf="field.type !== 'select'" 
              [type]="field.type" 
              [id]="field.name" 
              class="form-control" 
              [class.is-invalid]="isFieldInvalid(field.name)"
              [formControlName]="field.name"
              [placeholder]="field.placeholder"
            >
            <select 
              *ngIf="field.type === 'select'" 
              [id]="field.name" 
              class="form-control" 
              [class.is-invalid]="isFieldInvalid(field.name)"
              [formControlName]="field.name"
            >
              <option value="">Select a genre</option>
              <option *ngFor="let option of field.options" [value]="option">{{ option }}</option>
            </select>
            <div *ngIf="isFieldInvalid(field.name)" class="invalid-feedback">
              {{ getErrorMessage(field.name) }}
            </div>
          </div>
        </div>
        
        <div class="form-actions">
          <button type="button" class="btn btn-secondary" (click)="cancel()">Cancel</button>
          <button type="submit" class="btn btn-primary" [disabled]="bookForm.invalid || isSubmitting">
            <span *ngIf="isSubmitting">
              <div class="spinner-sm"></div> Saving...
            </span>
            <span *ngIf="!isSubmitting">
              {{ isEditMode ? 'Update Book' : 'Add Book' }}
            </span>
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    :root {
      --primary-300: #93c5fd;
      --primary-400: #60a5fa;
      --primary-500: #3b82f6;
      --primary-600: #2563eb;
      --error-500: #ef4444;
      --neutral-200: #e5e7eb;
      --neutral-300: #d1d5db;
      --neutral-400: #9ca3af;
      --neutral-600: #4b5563;
      --neutral-700: #374151;
      --neutral-800: #1f2937;
      --neutral-900: #111827;
      --space-4: 0.25rem;
      --space-8: 0.5rem;
      --space-12: 0.75rem;
      --space-16: 1rem;
      --space-20: 1.25rem;
      --space-24: 1.5rem;
      --space-32: 2rem;
      --space-40: 2.5rem;
      --space-64: 4rem;
      --radius-md: 0.375rem;
      --radius-lg: 0.5rem;
      --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }

    :host {
      display: block;
      padding: var(--space-32);
      max-width: 900px;
      margin: 0 auto;
    }

    .form-container {
      padding: var(--space-32);
      max-width: 100%;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #f9f9f9;
      border-radius: var(--radius-lg);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .back-link {
      margin-bottom: var(--space-24);
    }

    .back-link a {
      display: inline-flex;
      align-items: center;
      color: var(--primary-500);
      font-weight: 600;
      text-decoration: none;
      font-size: 1rem;
      transition: color 0.2s ease;
    }

    .back-link a:hover {
      color: var(--primary-600);
    }

    .back-link i {
      margin-right: var(--space-8);
      font-size: 1.2rem;
    }

    .page-header {
      margin-bottom: var(--space-32);
      text-align: center;
    }

    .page-header h1 {
      color: var(--primary-600);
      margin-bottom: var(--space-8);
      font-weight: 700;
      font-size: 2rem;
    }

    .page-header p {
      color: var(--neutral-600);
      font-size: 1.15rem;
      font-weight: 400;
    }

    .loading-container {
      display: flex;
      justify-content: center;
      padding: var(--space-64) 0;
    }

    .spinner {
      border: 4px solid rgba(0, 0, 0, 0.1);
      border-top: 4px solid var(--primary-500);
      border-radius: 50%;
      width: 36px;
      height: 36px;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }

    .error-container {
      padding: var(--space-64) 0;
    }

    .error-content {
      text-align: center;
      max-width: 450px;
      margin: 0 auto;
      color: var(--neutral-700);
      background-color: #fff0f0;
      padding: var(--space-24);
      border-radius: var(--radius-md);
      box-shadow: 0 0 10px rgba(255, 0, 0, 0.1);
    }

    .error-content i {
      color: var(--error-500);
      margin-bottom: var(--space-16);
      font-size: 3.5rem;
    }

    .error-content h2 {
      color: var(--neutral-900);
      margin-bottom: var(--space-16);
      font-weight: 700;
    }

    .error-content p {
      margin-bottom: var(--space-24);
      font-size: 1.1rem;
    }

    form {
      display: flex;
      flex-direction: column;
      gap: var(--space-32);
    }

    .form-card {
      background-color: white;
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-md);
      padding: var(--space-24);
      border: 1px solid var(--neutral-200);
      transition: box-shadow 0.3s ease;
    }

    .form-card:hover {
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    }

    .form-card h2 {
      font-size: 1.4rem;
      color: var(--neutral-800);
      margin-bottom: var(--space-24);
      padding-bottom: var(--space-8);
      border-bottom: 1px solid var(--neutral-200);
      font-weight: 600;
    }

    .form-group {
      margin-bottom: var(--space-20);
      display: flex;
      flex-direction: column;
    }

    .form-label {
      display: block;
      margin-bottom: var(--space-8);
      font-weight: 600;
      color: var(--neutral-700);
      font-size: 1rem;
    }

    .form-control {
      display: block;
      width: 100%;
      padding: var(--space-12);
      font-size: 1rem;
      line-height: 1.5;
      color: var(--neutral-900);
      background-color: white;
      border: 1.5px solid var(--neutral-300);
      border-radius: var(--radius-md);
      transition: border-color 0.3s ease, box-shadow 0.3s ease;
      font-family: inherit;
      box-sizing: border-box;
    }

    .form-control:focus {
      border-color: var(--primary-400);
      outline: none;
      box-shadow: 0 0 8px rgba(51, 102, 204, 0.35);
    }

    .form-control.is-invalid {
      border-color: var(--error-500);
      background-color: #ffe6e6;
    }

    .invalid-feedback {
      display: block;
      width: 100%;
      margin-top: var(--space-4);
      font-size: 0.875rem;
      color: var(--error-500);
      font-weight: 600;
    }

    textarea.form-control {
      resize: vertical;
      min-height: 120px;
      font-family: inherit;
    }

    select.form-control {
      padding-right: var(--space-32);
      background-image: url("data:image/svg+xml;charset=US-ASCII,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 4 5'><path fill='%23666' d='m0 0 2 2 2-2z'/></svg>");
      background-repeat: no-repeat;
      background-position: right 12px center;
      background-size: 12px;
      appearance: none;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: var(--space-16);
      margin-top: var(--space-32);
      flex-wrap: wrap;
    }

    .btn {
      padding: 0.75rem 1.5rem;
      border-radius: var(--radius-md);
      font-weight: 600;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.3s ease;
      border: none;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 120px;
    }

    .btn-primary {
      background-color: var(--primary-500);
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background-color: var(--primary-600);
      transform: translateY(-1px);
    }

    .btn-primary:disabled {
      background-color: var(--primary-300);
      cursor: not-allowed;
      transform: none;
    }

    .btn-secondary {
      background-color: var(--neutral-300);
      color: var(--neutral-800);
    }

    .btn-secondary:hover {
      background-color: var(--neutral-400);
      transform: translateY(-1px);
    }

    .spinner-sm {
      display: inline-block;
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top: 2px solid white;
      border-radius: 50%;
      animation: spin 0.75s linear infinite;
      margin-right: var(--space-8);
    }

    .slide-in-up {
      animation: slideInUp 0.6s ease-out;
    }

    @keyframes slideInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      :host {
        padding: var(--space-16);
      }
      
      .form-container {
        padding: var(--space-20);
      }
      
      .page-header h1 {
        font-size: 1.75rem;
      }
      
      .form-actions {
        flex-direction: column;
      }
      
      .btn {
        width: 100%;
      }
    }

    @media (min-width: 769px) {
      .form-card {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: var(--space-24);
        align-items: start;
      }
      
      .form-card h2 {
        grid-column: 1 / -1;
      }
      
      .form-group:nth-child(2) {
        grid-column: 1 / -1;
      }
    }
  `],
  animations: [
    trigger('formAnimation', [
      transition(':enter', [
        query('.form-group', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          stagger(100, [
            animate('0.6s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ])
  ]
})
export class BookFormComponent implements OnInit {
  bookForm!: FormGroup;
  isEditMode = false;
  bookId?: number;
  loading = true;
  error: string | null = null;
  isSubmitting = false;
  
  formFields = [
    { name: 'title', label: 'Title', type: 'text', placeholder: 'Enter book title' },
    { name: 'author', label: 'Author', type: 'text', placeholder: 'Enter author name' },
    { name: 'isbn', label: 'ISBN', type: 'text', placeholder: 'Enter ISBN (e.g., 9780123456789)' },
    { name: 'publicationDate', label: 'Publication Date', type: 'date', placeholder: '' },
    { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Enter book description' },
    { name: 'coverImage', label: 'Cover Image URL', type: 'url', placeholder: 'Enter cover image URL' },
    { name: 'genre', label: 'Genre', type: 'select', placeholder: '', options: [
      'Fiction', 'Non-Fiction', 'Science Fiction', 'Fantasy', 'Mystery', 'Romance', 
      'Thriller', 'Horror', 'Biography', 'History', 'Self-Help', 'Business', 'Science'
    ] },
    { name: 'pageCount', label: 'Page Count', type: 'number', placeholder: 'Enter number of pages' },
    { name: 'publisher', label: 'Publisher', type: 'text', placeholder: 'Enter publisher name' },
    { name: 'rating', label: 'Rating (0-5)', type: 'number', placeholder: 'Enter rating from 0 to 5' }
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private bookService: BookService
  ) {}

  ngOnInit(): void {
    this.initForm();
    
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      
      if (idParam) {
        this.isEditMode = true;
        this.bookId = parseInt(idParam, 10);
        this.loadBook(this.bookId);
      } else {
        this.loading = false;
      }
    });
  }

  initForm(): void {
    this.bookForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      author: ['', [Validators.required, Validators.maxLength(100)]],
      isbn: ['', [Validators.required, Validators.pattern(/^\d{13}$/)]],
      publicationDate: ['', [Validators.required]],
      description: [''],
      coverImage: ['', Validators.pattern(/^(https?:\/\/).*$/)],
      genre: [''],
      pageCount: ['', [Validators.min(1), Validators.max(10000)]],
      publisher: [''],
      rating: ['', [Validators.min(0), Validators.max(5)]]
    });
  }

  loadBook(id: number): void {
    this.loading = true;
    this.error = null;
    
    this.bookService.getBook(id).subscribe({
      next: (book) => {
        this.bookForm.patchValue({
          ...book,
          publicationDate: this.formatDateForInput(book.publicationDate)
        });
        this.loading = false;
      },
      error: (error) => {
        this.error = error.message || 'Failed to load book details';
        this.loading = false;
      }
    });
  }

  formatDateForInput(dateString: string): string {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  }

  isFieldInvalid(fieldName: string): boolean {
    const control = this.bookForm.get(fieldName);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  getErrorMessage(fieldName: string): string {
    const control = this.bookForm.get(fieldName);
    
    if (!control || !control.errors) {
      return '';
    }
    
    if (control.errors['required']) {
      return 'This field is required';
    }
    
    if (control.errors['maxLength']) {
      return `Maximum length exceeded`;
    }
    
    if (control.errors['pattern']) {
      if (fieldName === 'isbn') {
        return 'ISBN must be a 13-digit number';
      }
      if (fieldName === 'coverImage') {
        return 'Must be a valid URL starting with http:// or https://';
      }
      return 'Invalid format';
    }
    
    if (control.errors['min']) {
      return `Minimum value is ${control.errors['min'].min}`;
    }
    
    if (control.errors['max']) {
      return `Maximum value is ${control.errors['max'].max}`;
    }
    
    return 'Invalid value';
  }

  onSubmit(): void {
    if (this.bookForm.invalid) {
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.bookForm.controls).forEach(key => {
        this.bookForm.get(key)?.markAsTouched();
      });
      return;
    }
    
    this.isSubmitting = true;
    
    const bookData = {
      ...this.bookForm.value,
      // Convert empty strings to undefined for optional fields
      coverImage: this.bookForm.value.coverImage || undefined,
      genre: this.bookForm.value.genre || undefined,
      description: this.bookForm.value.description || undefined,
      pageCount: this.bookForm.value.pageCount || undefined,
      publisher: this.bookForm.value.publisher || undefined,
      rating: this.bookForm.value.rating || undefined
    };
    
    if (this.isEditMode && this.bookId) {
      this.bookService.updateBook(this.bookId, bookData).subscribe({
        next: (book) => {
          this.isSubmitting = false;
          this.router.navigate(['/books', book.id]);
        },
        error: (error) => {
          this.isSubmitting = false;
          console.error('Error updating book', error);
          alert('Failed to update book. Please try again.');
        }
      });
    } else {
      this.bookService.addBook(bookData).subscribe({
        next: (book) => {
          this.isSubmitting = false;
          this.router.navigate(['/books', book.id]);
        },
        error: (error) => {
          this.isSubmitting = false;
          console.error('Error adding book', error);
          alert('Failed to add book. Please try again.');
        }
      });
    }
  }

  cancel(): void {
    if (this.isEditMode && this.bookId) {
      this.router.navigate(['/books', this.bookId]);
    } else {
      this.router.navigate(['/books']);
    }
  }
}