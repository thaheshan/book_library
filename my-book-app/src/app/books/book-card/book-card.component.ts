import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Book } from '../../models/book.model';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-book-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="book-card" [@cardAnimation]>
      <div class="book-cover">
        <img [src]="book.coverImage || 'https://images.pexels.com/photos/1907785/pexels-photo-1907785.jpeg?auto=compress&cs=tinysrgb&w=400'" 
             [alt]="book.title + ' cover'" 
             class="cover-image">
        <div class="book-actions">
          <a [routerLink]="['/books', book.id]" class="action-btn view-btn">
            <i class="fas fa-eye"></i>
          </a>
          <a [routerLink]="['/books', book.id, 'edit']" class="action-btn edit-btn">
            <i class="fas fa-edit"></i>
          </a>
          <button class="action-btn delete-btn" (click)="onDelete()">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
      <div class="book-info">
        <h3 class="book-title">{{ book.title }}</h3>
        <p class="book-author">by {{ book.author }}</p>
        <div class="book-meta">
          <span class="book-isbn">ISBN: {{ formatIsbn(book.isbn) }}</span>
          <span class="book-year">{{ formatDate(book.publicationDate) }}</span>
        </div>
        <div *ngIf="book.genre" class="book-genre">
          <span class="genre-tag">{{ book.genre }}</span>
        </div>
        <div *ngIf="book.rating" class="book-rating">
          <div class="stars">
            <i *ngFor="let star of getStars(book.rating)" 
               class="fas fa-star" 
               [class.full]="star === 1" 
               [class.half]="star === 0.5" 
               [class.empty]="star === 0"></i>
          </div>
          <span class="rating-value">{{ book.rating.toFixed(1) }}</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .book-card {
      background-color: white;
      border-radius: var(--radius-md);
      overflow: hidden;
      box-shadow: var(--shadow-md);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      height: 100%;
      display: flex;
      flex-direction: column;
    }
    
    .book-card:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-lg);
    }
    
    .book-cover {
      position: relative;
      height: 200px;
      overflow: hidden;
    }
    
    .cover-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }
    
    .book-card:hover .cover-image {
      transform: scale(1.05);
    }
    
    .book-actions {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      gap: var(--space-8);
      opacity: 0;
      transition: opacity 0.3s ease;
    }
    
    .book-card:hover .book-actions {
      opacity: 1;
    }
    
    .action-btn {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      color: white;
      cursor: pointer;
      transition: all 0.2s ease;
      border: none;
      outline: none;
    }
    
    .view-btn {
      background-color: var(--primary-500);
    }
    
    .view-btn:hover {
      background-color: var(--primary-600);
    }
    
    .edit-btn {
      background-color: var(--accent-500);
    }
    
    .edit-btn:hover {
      background-color: var(--accent-600);
    }
    
    .delete-btn {
      background-color: var(--error-500);
    }
    
    .delete-btn:hover {
      background-color: var(--error-600);
    }
    
    .book-info {
      padding: var(--space-16);
      flex-grow: 1;
      display: flex;
      flex-direction: column;
    }
    
    .book-title {
      font-size: 1.2rem;
      font-weight: 600;
      margin-bottom: var(--space-4);
      color: var(--neutral-900);
      line-height: 1.3;
    }
    
    .book-author {
      font-size: 0.95rem;
      color: var(--neutral-700);
      margin-bottom: var(--space-8);
    }
    
    .book-meta {
      display: flex;
      justify-content: space-between;
      font-size: 0.85rem;
      color: var(--neutral-600);
      margin-bottom: var(--space-8);
    }
    
    .book-genre {
      margin-bottom: var(--space-8);
    }
    
    .genre-tag {
      display: inline-block;
      background-color: var(--primary-100);
      color: var(--primary-700);
      padding: 2px 8px;
      border-radius: var(--radius-full);
      font-size: 0.85rem;
      font-weight: 500;
    }
    
    .book-rating {
      display: flex;
      align-items: center;
      margin-top: auto;
    }
    
    .stars {
      display: flex;
      margin-right: var(--space-8);
    }
    
    .stars i {
      color: var(--neutral-300);
      margin-right: 2px;
    }
    
    .stars i.full {
      color: var(--warning-500);
    }
    
    .stars i.half {
      position: relative;
      color: var(--neutral-300);
    }
    
    .stars i.half:after {
      content: "\\f089";
      font-family: "Font Awesome 6 Free";
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
    }
  `],
  animations: [
    trigger('cardAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(15px)' }),
        animate('0.3s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('0.2s ease-in', style({ opacity: 0, transform: 'translateY(15px)' }))
      ])
    ])
  ]
})
export class BookCardComponent {
  @Input() book!: Book;
  @Output() delete = new EventEmitter<number>();

  formatIsbn(isbn: string): string {
    return isbn.replace(/(\d{3})(\d{1})(\d{5})(\d{3})(\d{1})/, '$1-$2-$3-$4-$5');
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.getFullYear().toString();
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

  onDelete(): void {
    this.delete.emit(this.book.id);
  }
}