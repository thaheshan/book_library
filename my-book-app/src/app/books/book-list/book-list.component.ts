import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Book, BookFilter } from '../../models/book.model';
import { BookService } from '../../services/book.service';
import { BookCardComponent } from '../book-card/book-card.component';
import {
  trigger,
  transition,
  style,
  animate,
  stagger,
  query
} from '@angular/animations';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, BookCardComponent],
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


    <div class="book-list-container">
      <!-- Header -->
      <header class="page-header slide-in-up">
        <h1>📚 Book Collection</h1>
        <p>Explore, filter, and manage your personal library</p>
      </header>

      <!-- Filters -->
      <section class="filters-container slide-in-up">
        <div class="search-container">
          <input 
            type="text" 
            class="form-control search-input"
            placeholder="Search by title, author, or ISBN..." 
            [(ngModel)]="filter.searchTerm"
            (input)="applyFilters()"
            aria-label="Search Books"
          />
          <i class="fas fa-search search-icon"></i>
        </div>

        <div class="filter-options">
          <!-- Genre Filter -->
          <div class="filter-group">
            <label for="genreFilter">Genre:</label>
            <select 
              id="genreFilter"
              class="form-control" 
              [(ngModel)]="filter.genre"
              (change)="applyFilters()"
            >
              <option value="">All Genres</option>
              <option *ngFor="let genre of genres" [value]="genre">{{ genre }}</option>
            </select>
          </div>

          <!-- Sort By Filter -->
          <div class="filter-group">
            <label for="sortBy">Sort By:</label>
            <select 
              id="sortBy"
              class="form-control" 
              [(ngModel)]="filter.sortBy"
              (change)="applyFilters()"
            >
              <option value="title">Title</option>
              <option value="author">Author</option>
              <option value="publicationDate">Publication Date</option>
            </select>
          </div>

          <!-- Sort Direction Filter -->
          <div class="filter-group">
            <label for="sortDirection">Order:</label>
            <select 
              id="sortDirection"
              class="form-control" 
              [(ngModel)]="filter.sortDirection"
              (change)="applyFilters()"
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
        </div>
      </section>

      <!-- Add Book Button -->
      <div class="add-book-container slide-in-up">
        <a routerLink="/books/new" class="btn btn-primary">
          <i class="fas fa-plus"></i> Add New Book
        </a>
      </div>

      <!-- Loading Spinner -->
      <div *ngIf="loading" class="loading-container">
        <div class="spinner"></div>
      </div>

      <!-- No Books Found -->
      <div *ngIf="!loading && books.length === 0" class="no-books-container slide-in-up">
        <div class="empty-state">
          <i class="fas fa-book-dead fa-3x"></i>
          <h2>No Books Found</h2>
          <p>No books match your filters or there are no books in your collection.</p>
          <button class="btn btn-secondary" (click)="resetFilters()">Reset Filters</button>
        </div>
      </div>

      <!-- Book Cards Grid -->
      <div *ngIf="!loading && books.length > 0" [@booksAnimation]="books.length" class="books-grid">
        <app-book-card 
          *ngFor="let book of books" 
          [book]="book"
          (delete)="onDeleteBook($event)"
        ></app-book-card>
      </div>
    </div>
  `,
  styles: [`
    /* Hero Section */
    .hero-section {
      background: linear-gradient(135deg, var(--primary-700), var(--secondary-700));
      color: #fff;
      margin-top: 20px;
      padding: 80px 300px 64px;
      margin-bottom: 48px;
      position: relative;
      overflow: hidden;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }

    .hero-section::before {
      content: '';
      position: absolute;
      inset: 0;
      background-image: url('https://images.pexels.com/photos/590493/pexels-photo-590493.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1');
      background-size: cover;
      width: 100%;
      opacity: 0.18;
      z-index: 0;
      filter: brightness(0.9);
    }

    .hero-content {
      position: relative;
      z-index: 1;
      max-width: 2920px;
      margin: 0 auto;
      text-align: center;
      padding: 0 24px;
    }

    .hero-title {
      font-size: clamp(2rem, 5vw, 3.5rem);
      font-weight: 800;
      margin-bottom: 16px;
      line-height: 1.1;
      text-shadow: 0 2px 6px rgba(0,0,0,0.2);
    }

    .hero-subtitle {
      font-size: clamp(1rem, 2vw, 1.25rem);
      margin-bottom: 32px;
      line-height: 1.6;
      max-width: 520px;
      margin-left: auto;
      margin-right: auto;
      text-shadow: 0 1px 3px rgba(0,0,0,0.4);
      color: #f0f0f0;
    }

    .hero-actions {
      display: inline-flex;
      gap: 18px;
      justify-content: center;
      flex-wrap: wrap;
    }

    .hero-actions a {
      padding: 12px 36px;
      border-radius: 40px;
      font-weight: 600;
      text-decoration: none;
      font-size: 1.05rem;
      transition: background-color 0.3s ease, box-shadow 0.3s ease;
      box-shadow: 0 3px 8px rgba(0,0,0,0.25);
      cursor: pointer;
      border: 2px solid transparent;
      user-select: none;
    }

    .btn-primary {
      background-color: var(--primary-600);
      color: white;
    }

    .btn-primary:hover,
    .btn-primary:focus {
      background-color: var(--primary-700);
      box-shadow: 0 6px 14px var(--primary-500);
      outline: none;
    }

    .btn-secondary {
      background-color: transparent;
      color: white;
      border: 2px solid white;
      font-weight: 600;
    }

    .btn-secondary:hover,
    .btn-secondary:focus {
      background-color: white;
      color: var(--secondary-700);
      box-shadow: 0 6px 14px rgba(255, 255, 255, 0.7);
      outline: none;
    }

    /* Book List Container */
    .book-list-container {
      padding: 32px 24px;
      max-width: 1200px;
      margin: 0 auto;
      animation: fadeIn 0.4s ease-in-out forwards;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }

    /* Header */
    .page-header {
      margin-bottom: 36px;
      text-align: center;
    }

    .page-header h1 {
      color: var(--primary-700);
      font-weight: 700;
      font-size: 2.25rem;
      margin-bottom: 8px;
    }

    .page-header p {
      color: var(--neutral-600);
      font-size: 1.125rem;
      font-weight: 500;
      letter-spacing: 0.02em;
    }

    /* Filters Section */
    .filters-container {
      background-color: #fff;
      padding: 24px 32px;
      margin-bottom: 36px;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      display: flex;
      flex-direction: column;
      gap: 20px;
      user-select: none;
    }

    .search-container {
      position: relative;
      width: 100%;
      max-width: 480px;
      margin: 0 auto 16px;
    }

    .search-input {
      width: 100%;
      padding: 12px 48px 12px 16px;
      border: 1.8px solid var(--neutral-300);
      border-radius: 10px;
      font-size: 1rem;
      font-weight: 400;
      color: var(--neutral-900);
      transition: border-color 0.25s ease;
    }

    .search-input:focus {
      outline: none;
      border-color: var(--primary-600);
      box-shadow: 0 0 6px var(--primary-400);
    }

    .search-icon {
      position: absolute;
      left: 14px;
      top: 50%;
      transform: translateY(-50%);
      color: var(--neutral-400);
      font-size: 1.15rem;
      pointer-events: none;
      user-select: none;
    }

    .filter-options {
      display: flex;
      flex-wrap: wrap;
      gap: 24px;
      justify-content: center;
    }

    .filter-group {
      flex: 1 1 200px;
      min-width: 180px;
      display: flex;
      flex-direction: column;
    }

    .filter-group label {
      margin-bottom: 6px;
      font-weight: 600;
      color: var(--neutral-700);
      font-size: 0.95rem;
      user-select: none;
    }

    .filter-group select {
      padding: 10px 12px;
      border: 1.5px solid var(--neutral-300);
      border-radius: 8px;
      font-size: 1rem;
      color: var(--neutral-900);
      transition: border-color 0.25s ease;
      cursor: pointer;
    }

    .filter-group select:hover,
    .filter-group select:focus {
      border-color: var(--primary-600);
      outline: none;
      box-shadow: 0 0 6px var(--primary-300);
    }

    /* Add Book Container */
    .add-book-container {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 32px;
    }

    .add-book-container .btn {
      background-color: var(--primary-600);
      color: white;
      padding: 14px 30px;
      font-size: 1.1rem;
      border-radius: 40px;
      font-weight: 600;
      display: inline-flex;
      align-items: center;
      gap: 10px;
      transition: background-color 0.3s ease, box-shadow 0.3s ease;
      border: none;
      cursor: pointer;
      user-select: none;
    }

    .add-book-container .btn:hover,
    .add-book-container .btn:focus {
      background-color: var(--primary-700);
      box-shadow: 0 6px 16px var(--primary-500);
      outline: none;
    }

    /* Books Grid */
    .books-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 28px;
    }

    @media (min-width: 992px) {
      .books-grid {
        grid-template-columns: repeat(3, 1fr);
      }
    }

    /* Loading Spinner */
    .loading-container {
      display: flex;
      justify-content: center;
      padding: 80px 0;
    }

    .spinner {
      border: 5px solid rgba(0, 0, 0, 0.1);
      width: 56px;
      height: 56px;
      border-radius: 50%;
      border-left-color: var(--primary-600);
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }

    /* No Books Found - Empty State */
    .no-books-container {
      padding: 80px 16px;
    }

    .empty-state {
      text-align: center;
      color: var(--neutral-600);
      max-width: 520px;
      margin: 0 auto;
      user-select: none;
    }

    .empty-state i {
      color: var(--neutral-400);
      margin-bottom: 16px;
      font-size: 4.5rem;
      display: inline-block;
      user-select: none;
    }

    .empty-state h2 {
      font-weight: 700;
      font-size: 1.75rem;
      margin-bottom: 12px;
    }

    .empty-state p {
      font-size: 1rem;
      line-height: 1.5;
      color: var(--neutral-500);
    }

    /* Animations */
    @keyframes fadeIn {
      0% { opacity: 0; transform: translateY(12px);}
      100% { opacity: 1; transform: translateY(0);}
    }

 
  `],
  animations: [
    trigger('booksAnimation', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(15px)' }),
          stagger(100, [
            animate('0.3s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ])
  ]
})
export class BookListComponent implements OnInit {
  books: Book[] = [];
  loading = true;
  genres: string[] = [];

  filter: BookFilter = {
    searchTerm: '',
    genre: '',
    sortBy: 'title',
    sortDirection: 'asc'
  };

  constructor(private bookService: BookService) {}

  ngOnInit(): void {
    this.loadBooks();
    this.loadGenres();
  }

  loadBooks(): void {
    this.loading = true;
    this.bookService.getBooks(this.filter).subscribe({
      next: (books) => {
        this.books = books;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading books', error);
        this.loading = false;
      }
    });
  }

  loadGenres(): void {
    this.bookService.getGenres().subscribe({
      next: (genres) => {
        this.genres = genres;
      },
      error: (error) => {
        console.error('Error loading genres', error);
      }
    });
  }

  applyFilters(): void {
    this.loadBooks();
  }

  resetFilters(): void {
    this.filter = {
      searchTerm: '',
      genre: '',
      sortBy: 'title',
      sortDirection: 'asc'
    };
    this.loadBooks();
  }

  onDeleteBook(id: number): void {
    if (confirm('Are you sure you want to delete this book?')) {
      this.bookService.deleteBook(id).subscribe({
        next: () => this.loadBooks(),
        error: (error) => console.error('Error deleting book', error)
      });
    }
  }
}
