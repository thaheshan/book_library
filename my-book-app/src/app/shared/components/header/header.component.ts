import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from '../../../core copy/models/user.model';
import { AuthService } from '../../../core copy/services/auth.service';
import { ThemeService, Theme } from '../../../core copy/services/theme.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="navbar">
      <div class="container">
        <a routerLink="/" class="navbar-brand">
          <i class="fas fa-book-open"></i> BookSphere
        </a>
        
        <div class="navbar-search">
          <div class="search-wrapper">
            <input type="text" placeholder="Search books..." 
              (keyup.enter)="search($event)" class="search-input">
            <i class="fas fa-search search-icon"></i>
          </div>
        </div>

        <nav class="navbar-menu">
          <a routerLink="/books" class="nav-link">Books</a>
          <a routerLink="/categories" class="nav-link">Categories</a>
          
          <ng-container *ngIf="(currentUser$ | async) === null; else userMenu">
            <a routerLink="/auth/login" class="nav-link">Sign In</a>
            <a routerLink="/auth/register" class="btn-primary">Sign Up</a>
          </ng-container>
          
          <ng-template #userMenu>
            <div class="dropdown">
              <button class="dropdown-toggle">
                <i class="fas fa-user-circle"></i>
                {{ (currentUser$ | async)?.username }}
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
          <button class="theme-toggle" (click)="toggleTheme()">
            <i *ngIf="(currentTheme$ | async) === 'light'" class="fas fa-moon"></i>
            <i *ngIf="(currentTheme$ | async) === 'dark'" class="fas fa-sun"></i>
          </button>
        </nav>
      </div>
    </header>
  `,
  styles: [`
    .navbar {
      position: sticky;
      top: 0;
      z-index: 100;
      padding: var(--space-2) 0;
    }
    
    .container {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    
    .navbar-brand {
      font-size: 1.5rem;
      font-weight: var(--font-weight-bold);
      color: var(--primary-600);
      text-decoration: none;
      display: flex;
      align-items: center;
      gap: var(--space-1);
    }
    
    .navbar-brand:hover {
      text-decoration: none;
    }
    
    .navbar-search {
      flex: 1;
      max-width: 600px;
      margin: 0 var(--space-4);
    }
    
    .search-wrapper {
      position: relative;
      width: 100%;
    }
    
    .search-input {
      width: 100%;
      padding: var(--space-2) var(--space-3);
      padding-left: calc(var(--space-3) + 16px);
      border-radius: 20px;
      border: 1px solid var(--border-color);
      background-color: var(--bg-primary);
      color: var(--text-primary);
      font-size: 0.9rem;
    }
    
    .search-icon {
      position: absolute;
      left: var(--space-2);
      top: 50%;
      transform: translateY(-50%);
      color: var(--text-muted);
    }
    
    .navbar-menu {
      display: flex;
      align-items: center;
      gap: var(--space-3);
    }
    
    .nav-link {
      color: var(--text-secondary);
      text-decoration: none;
      font-weight: var(--font-weight-medium);
      transition: color 0.2s ease;
    }
    
    .nav-link:hover {
      color: var(--primary-600);
      text-decoration: none;
    }
    
    .dropdown {
      position: relative;
    }
    
    .dropdown-toggle {
      display: flex;
      align-items: center;
      gap: var(--space-1);
      background: none;
      border: none;
      color: var(--text-secondary);
      font-weight: var(--font-weight-medium);
      cursor: pointer;
      padding: var(--space-1) var(--space-2);
      border-radius: 4px;
    }
    
    .dropdown-toggle:hover {
      background-color: var(--bg-primary);
    }
    
    .dropdown-menu {
      position: absolute;
      top: 100%;
      right: 0;
      min-width: 200px;
      background-color: var(--bg-secondary);
      border-radius: 4px;
      box-shadow: 0 4px 12px var(--shadow-color);
      padding: var(--space-1) 0;
      z-index: 101;
      display: none;
      border: 1px solid var(--border-color);
    }
    
    .dropdown:hover .dropdown-menu {
      display: block;
      animation: fadeIn 0.2s ease;
    }
    
    .dropdown-item {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      padding: var(--space-2) var(--space-3);
      color: var(--text-secondary);
      text-decoration: none;
      transition: all 0.2s ease;
      cursor: pointer;
    }
    
    .dropdown-item:hover {
      background-color: var(--bg-primary);
      color: var(--primary-600);
      text-decoration: none;
    }
    
    .dropdown-divider {
      height: 1px;
      background-color: var(--border-color);
      margin: var(--space-1) 0;
    }
    
    .theme-toggle {
      background: none;
      border: none;
      color: var(--text-secondary);
      cursor: pointer;
      padding: var(--space-1);
      border-radius: 50%;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
    }
    
    .theme-toggle:hover {
      background-color: var(--bg-primary);
      color: var(--primary-600);
    }
    
    /* Responsive adjustments */
    @media (max-width: 768px) {
      .navbar-search {
        display: none;
      }
      
      .container {
        padding: 0 var(--space-2);
      }
      
      .navbar-menu {
        gap: var(--space-2);
      }
      
      .nav-link {
        font-size: 0.9rem;
      }
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