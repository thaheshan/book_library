import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Book } from '../../../core copy/models/book.model';
import { AuthService } from '../../../core copy/services/auth.service';

@Component({
  selector: 'app-book-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: "./bookcard.html",
  styles: [`
    .book-card {
      border-radius: 0.5rem;
      overflow: hidden;
      background-color: var(--bg-secondary);
      box-shadow: 0 4px 6px var(--shadow-color);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      height: 100%;
      display: flex;
      flex-direction: column;
    }
    
    .book-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 12px 20px var(--shadow-color);
    }
    
    .book-card.premium {
      border: 1px solid var(--accent-200);
    }
    
    .book-cover {
      position: relative;
      overflow: hidden;
      aspect-ratio: 3/4;
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
      padding: var(--space-3);
      display: flex;
      flex-direction: column;
      flex-grow: 1;
    }
    
    .book-title {
      font-size: 1.2rem;
      font-weight: var(--font-weight-bold);
      margin: 0 0 var(--space-1);
      color: var(--text-primary);
      line-height: 1.3;
    }
    
    .book-author {
      color: var(--text-secondary);
      margin: 0 0 var(--space-2);
      font-size: 0.9rem;
    }
    
    .book-meta {
      display: flex;
      gap: var(--space-2);
      margin-bottom: var(--space-3);
      color: var(--text-muted);
      font-size: 0.85rem;
    }
    
    .meta-item {
      display: flex;
      align-items: center;
      gap: 4px;
    }
    
    .book-actions {
      margin-top: auto;
      display: flex;
      gap: var(--space-2);
      flex-wrap: wrap;
    }
    
    .btn-action {
      padding: var(--space-1) var(--space-2);
      border-radius: 4px;
      font-size: 0.85rem;
      font-weight: var(--font-weight-medium);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 4px;
      cursor: pointer;
      transition: all 0.2s ease;
      text-decoration: none;
    }
    
    .details-btn {
      background-color: var(--bg-primary);
      color: var(--text-secondary);
      border: 1px solid var(--border-color);
    }
    
    .details-btn:hover {
      background-color: var(--neutral-200);
      color: var(--text-primary);
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
  `]
})
export class BookCardComponent {
  @Input() book!: Book;
  @Input() isAuthor: boolean = false;
  @Input() hasAccess: boolean = false;
  
  @Output() buy = new EventEmitter<Book>();
  @Output() edit = new EventEmitter<Book>();
  @Output() delete = new EventEmitter<Book>();
  
  constructor(private authService: AuthService) {}

  onBuy(): void {
    this.buy.emit(this.book);
  }
  
  onEdit(): void {
    this.edit.emit(this.book);
  }
  
  onDelete(): void {
    this.delete.emit(this.book);
  }
}