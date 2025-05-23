import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from '../../core copy/models/user.model';
import { AuthService } from '../../core copy/services/auth.service';
import { ThemeService, Theme } from '../../core copy/services/theme.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="navbar">
      <div class="container">
        <div class="navbar-left">
          <a routerLink="/" class="navbar-brand">
            <i class="fas fa-book-open"></i>
            <span class="brand-text">BookSphere</span>
          </a>
        </div>
        
        <div class="navbar-center">
          <div class="navbar-search">
            <div class="search-wrapper">
              <input type="text" placeholder="Search books..." 
                (keyup.enter)="search($event)" class="search-input">
              <i class="fas fa-search search-icon"></i>
            </div>
          </div>
        </div>

        <div class="navbar-right">
          <nav class="navbar-menu">
            <a routerLink="/books" routerLinkActive="active" class="nav-link">Books</a>
            <a routerLink="/categories" routerLinkActive="active" class="nav-link">Categories</a>
            <a routerLink="/books/new" routerLinkActive="active" class="btn-add-book">
              <i class="fas fa-plus"></i>
              <span class="add-book-text">Add Book</span>
            </a>
            
            <ng-container *ngIf="(currentUser$ | async) === null; else userMenu">
              <a routerLink="/auth/login" class="nav-link">Sign In</a>
              <a routerLink="/auth/register" class="btn-primary">Sign Up</a>
            </ng-container>
            
            <ng-template #userMenu>
              <div class="dropdown">
                <button class="dropdown-toggle">
                  <i class="fas fa-user-circle"></i>
                  <span class="username-text">{{ (currentUser$ | async)?.username }}</span>
                  <i class="fas fa-chevron-down"></i>
                </button>
                <div class="dropdown-menu">
                  <a routerLink="/profile" class="dropdown-item">
                    <i class="fas fa-user"></i> Profile
                  </a>
                  <a *ngIf="isAuthor$ | async" routerLink="/author/dashboard" class="dropdown-item">
                    <i class="fas fa-pencil-alt"></i> Author Dashboard
                  </a>
                  <a routerLink="/my-books" class="dropdown-item">
                    <i class="fas fa-book"></i> My Books
                  </a>
                  <a routerLink="/settings" class="dropdown-item">
                    <i class="fas fa-cog"></i> Settings
                  </a>
                  <div class="dropdown-divider"></div>
                  <a (click)="logout()" class="dropdown-item">
                    <i class="fas fa-sign-out-alt"></i> Sign Out
                  </a>
                </div>
              </div>
            </ng-template>
            
            <!-- Theme toggle -->
            <button class="theme-toggle" (click)="toggleTheme()" title="Toggle theme">
              <i *ngIf="(currentTheme$ | async) === 'light'" class="fas fa-moon"></i>
              <i *ngIf="(currentTheme$ | async) === 'dark'" class="fas fa-sun"></i>
            </button>
          </nav>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .navbar {
      position: sticky;
      top: 0;
      z-index: 100;
      padding: 0.75rem 0;
      backdrop-filter: blur(10px);
      background-color: rgba(255, 255, 255, 0.95);
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
      transition: background-color 0.3s ease, box-shadow 0.3s ease;
      border-bottom: 1px solid #e5e7eb;
      min-height: 70px;
    }
    
    [data-theme="dark"] .navbar {
      background-color: rgba(31, 41, 55, 0.95);
      border-bottom: 1px solid #374151;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
    }
    
    .container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
      width: 100%;
      min-height: 50px;
    }
    
    .navbar-left {
      flex: 0 0 auto;
      min-width: 180px;
    }
    
    .navbar-center {
      flex: 1 1 auto;
      display: flex;
      justify-content: center;
      margin: 0 1rem;
      max-width: 500px;
    }
    
    .navbar-right {
      flex: 0 0 auto;
      min-width: auto;
    }
    
    .navbar-brand {
      font-size: 1.5rem;
      font-weight: 700;
      color: #2563eb;
      text-decoration: none;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: transform 0.3s ease;
    }
    
    .navbar-brand:hover {
      text-decoration: none;
      transform: scale(1.05);
      color: #1d4ed8;
    }
    
    [data-theme="dark"] .navbar-brand {
      color: #60a5fa;
    }
    
    [data-theme="dark"] .navbar-brand:hover {
      color: #93c5fd;
    }
    
    .brand-text {
      white-space: nowrap;
    }
    
    .navbar-search {
      width: 100%;
      max-width: 400px;
    }
    
    .search-wrapper {
      position: relative;
      width: 100%;
    }
    
    .search-input {
      width: 100%;
      padding: 10px 16px;
      padding-left: 40px;
      border-radius: 25px;
      border: 2px solid #e5e7eb;
      background-color: #ffffff;
      color: #1f2937;
      font-size: 0.9rem;
      transition: all 0.3s ease;
      box-sizing: border-box;
    }
    
    .search-input:focus {
      outline: none;
      border-color: #2563eb;
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
      transform: scale(1.02);
    }
    
    .search-input::placeholder {
      color: #9ca3af;
    }
    
    [data-theme="dark"] .search-input {
      background-color: #374151;
      border-color: #4b5563;
      color: #ffffff;
    }
    
    [data-theme="dark"] .search-input:focus {
      border-color: #60a5fa;
      box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.1);
    }
    
    [data-theme="dark"] .search-input::placeholder {
      color: #6b7280;
    }
    
    .search-icon {
      position: absolute;
      left: 14px;
      top: 50%;
      transform: translateY(-50%);
      color: #6b7280;
      font-size: 0.9rem;
    }
    
    [data-theme="dark"] .search-icon {
      color: #9ca3af;
    }
    
    .navbar-menu {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      white-space: nowrap;
    }
    
    .nav-link {
      position: relative;
      color: #6b7280;
      text-decoration: none;
      font-weight: 500;
      transition: all 0.2s ease;
      padding: 0.5rem 0.75rem;
      border-radius: 6px;
      font-size: 0.9rem;
    }
    
    .nav-link::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 50%;
      width: 0;
      height: 2px;
      background-color: #2563eb;
      transition: all 0.3s ease;
      transform: translateX(-50%);
    }
    
    .nav-link:hover {
      color: #2563eb;
      text-decoration: none;
      background-color: rgba(37, 99, 235, 0.1);
    }
    
    .nav-link:hover::after {
      width: 100%;
    }
    
    .nav-link.active:not(.btn-primary):not(.btn-add-book) {
      color: #2563eb;
      font-weight: 600;
      background-color: rgba(37, 99, 235, 0.1);
    }
    
    .nav-link.active:not(.btn-primary):not(.btn-add-book)::after {
      width: 100%;
    }
    
    [data-theme="dark"] .nav-link {
      color: #9ca3af;
    }
    
    [data-theme="dark"] .nav-link:hover {
      color: #60a5fa;
      background-color: rgba(96, 165, 250, 0.1);
    }
    
    [data-theme="dark"] .nav-link.active:not(.btn-primary):not(.btn-add-book) {
      color: #60a5fa;
      background-color: rgba(96, 165, 250, 0.1);
    }
    
    [data-theme="dark"] .nav-link::after {
      background-color: #60a5fa;
    }
    
    .btn-primary {
      padding: 0.5rem 1rem;
      background-color: #2563eb;
      color: white;
      border-radius: 6px;
      text-decoration: none;
      font-weight: 500;
      transition: all 0.2s ease;
      border: none;
      cursor: pointer;
      white-space: nowrap;
      font-size: 0.9rem;
    }
    
    .btn-primary:hover {
      background-color: #1d4ed8;
      transform: translateY(-1px);
      text-decoration: none;
      color: white;
      box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
    }
    
    [data-theme="dark"] .btn-primary {
      background-color: #3b82f6;
    }
    
    [data-theme="dark"] .btn-primary:hover {
      background-color: #2563eb;
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
    }
    
    .btn-add-book {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      background-color: #059669;
      color: white;
      border-radius: 6px;
      text-decoration: none;
      font-weight: 600;
      font-size: 0.9rem;
      transition: all 0.2s ease;
      border: none;
      cursor: pointer;
      white-space: nowrap;
    }
    
    .btn-add-book:hover {
      background-color: #047857;
      transform: translateY(-1px);
      text-decoration: none;
      color: white;
      box-shadow: 0 4px 12px rgba(5, 150, 105, 0.3);
    }
    
    .btn-add-book.active {
      background-color: #065f46;
    }
    
    [data-theme="dark"] .btn-add-book {
      background-color: #10b981;
    }
    
    [data-theme="dark"] .btn-add-book:hover {
      background-color: #059669;
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
    }
    
    .dropdown {
      position: relative;
    }
    
    .dropdown-toggle {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: none;
      border: none;
      color: #6b7280;
      font-weight: 500;
      cursor: pointer;
      padding: 0.5rem;
      border-radius: 6px;
      transition: all 0.2s ease;
      white-space: nowrap;
      font-size: 0.9rem;
    }
    
    .dropdown-toggle:hover {
      background-color: rgba(37, 99, 235, 0.1);
      color: #2563eb;
    }
    
    [data-theme="dark"] .dropdown-toggle {
      color: #9ca3af;
    }
    
    [data-theme="dark"] .dropdown-toggle:hover {
      background-color: rgba(96, 165, 250, 0.1);
      color: #60a5fa;
    }
    
    .username-text {
      max-width: 120px;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    
    .dropdown-menu {
      position: absolute;
      top: calc(100% + 8px);
      right: 0;
      min-width: 220px;
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
      padding: 0.5rem 0;
      z-index: 101;
      display: none;
      border: 1px solid #e5e7eb;
      animation: fadeIn 0.2s ease;
    }
    
    [data-theme="dark"] .dropdown-menu {
      background-color: #374151;
      border-color: #4b5563;
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
    }
    
    .dropdown:hover .dropdown-menu {
      display: block;
    }
    
    .dropdown-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 0.75rem;
      color: #6b7280;
      text-decoration: none;
      transition: all 0.2s ease;
      cursor: pointer;
      white-space: nowrap;
      font-size: 0.9rem;
    }
    
    .dropdown-item:hover {
      background-color: rgba(37, 99, 235, 0.1);
      color: #2563eb;
      text-decoration: none;
    }
    
    [data-theme="dark"] .dropdown-item {
      color: #9ca3af;
    }
    
    [data-theme="dark"] .dropdown-item:hover {
      background-color: rgba(96, 165, 250, 0.1);
      color: #60a5fa;
    }
    
    .dropdown-divider {
      height: 1px;
      background-color: #e5e7eb;
      margin: 0.5rem 0;
    }
    
    [data-theme="dark"] .dropdown-divider {
      background-color: #4b5563;
    }
    
    .theme-toggle {
      background: none;
      border: none;
      color: #6b7280;
      cursor: pointer;
      padding: 0.5rem;
      border-radius: 50%;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      font-size: 1rem;
    }
    
    .theme-toggle:hover {
      background-color: rgba(37, 99, 235, 0.1);
      color: #2563eb;
      transform: scale(1.1);
    }
    
    [data-theme="dark"] .theme-toggle {
      color: #9ca3af;
    }
    
    [data-theme="dark"] .theme-toggle:hover {
      background-color: rgba(96, 165, 250, 0.1);
      color: #60a5fa;
    }
    
    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    /* Responsive Design */
    @media (max-width: 1024px) {
      .navbar-center {
        margin: 0 0.75rem;
      }
      
      .navbar-search {
        max-width: 300px;
      }
      
      .navbar-menu {
        gap: 0.5rem;
      }
      
      .navbar-left {
        min-width: 150px;
      }
    }
    
    @media (max-width: 768px) {
      .container {
        padding: 0 0.75rem;
      }
      
      .navbar-left {
        min-width: auto;
      }
      
      .navbar-center {
        display: none;
      }
      
      .navbar-menu {
        gap: 0.25rem;
      }
      
      .nav-link {
        font-size: 0.8rem;
        padding: 0.4rem 0.5rem;
      }
      
      .btn-primary {
        padding: 0.4rem 0.6rem;
        font-size: 0.8rem;
      }
      
      .btn-add-book {
        padding: 0.4rem 0.6rem;
        font-size: 0.8rem;
      }
      
      .add-book-text {
        display: none;
      }
      
      .brand-text {
        display: none;
      }
      
      .username-text {
        display: none;
      }
      
      .dropdown-toggle {
        padding: 0.4rem;
      }
    }
    
    @media (max-width: 480px) {
      .container {
        padding: 0 0.5rem;
      }
      
      .navbar-menu {
        gap: 0.2rem;
      }
      
      .nav-link {
        padding: 0.3rem 0.4rem;
        font-size: 0.75rem;
      }
      
      .btn-primary {
        padding: 0.3rem 0.5rem;
        font-size: 0.75rem;
      }
      
      .btn-add-book {
        padding: 0.3rem 0.5rem;
        font-size: 0.75rem;
      }
      
      .theme-toggle {
        width: 32px;
        height: 32px;
        padding: 0.25rem;
        font-size: 0.9rem;
      }
      
      .dropdown-menu {
        min-width: 180px;
        right: -10px;
      }
      
      .dropdown-toggle {
        padding: 0.3rem;
      }
    }
    
    /* Focus states for accessibility */
    .nav-link:focus-visible,
    .btn-primary:focus-visible,
    .btn-add-book:focus-visible,
    .dropdown-toggle:focus-visible,
    .theme-toggle:focus-visible {
      outline: 2px solid #2563eb;
      outline-offset: 2px;
    }
    
    [data-theme="dark"] .nav-link:focus-visible,
    [data-theme="dark"] .btn-primary:focus-visible,
    [data-theme="dark"] .btn-add-book:focus-visible,
    [data-theme="dark"] .dropdown-toggle:focus-visible,
    [data-theme="dark"] .theme-toggle:focus-visible {
      outline-color: #60a5fa;
    }
    
    .search-input:focus-visible {
      outline: 2px solid #2563eb;
      outline-offset: 0;
    }
    
    [data-theme="dark"] .search-input:focus-visible {
      outline-color: #60a5fa;
    }
  `]
})
export class HeaderComponent implements OnInit {
  currentUser$: Observable<User | null>;
  isAuthor$: Observable<boolean>;
  currentTheme$: Observable<Theme>;

  constructor(
    private authService: AuthService,
    private themeService: ThemeService,
    private router: Router
  ) {
    this.currentUser$ = this.authService.currentUser$;
    this.isAuthor$ = new Observable<boolean>(observer => {
      this.authService.currentUser$.subscribe(user => {
        observer.next(user?.isAuthor || false);
      });
    });
    this.currentTheme$ = this.themeService.currentTheme$;
  }

  ngOnInit(): void {
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  search(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    if (value.trim()) {
      this.router.navigate(['/books/search'], { queryParams: { q: value } });
    }
  }
}