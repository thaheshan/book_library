import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <header class="header">
      <div class="container header-content">
        <div class="logo">
          <a routerLink="/" class="logo-link">
            <i class="fas fa-book"></i>
            <span>MJ Paradise</span>
          </a>
        </div>
        <nav class="nav">
          <ul class="nav-list">
            <li class="nav-item">
              <a routerLink="/books" routerLinkActive="active">Books</a>
            </li>
            <li class="nav-item">
              <a routerLink="/books/new" routerLinkActive="active" class="btn btn-primary btn-sm">Add Book</a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  `,
  styles: [`
    .header {
      position: sticky;
      top: 0;
      width: 100%;
      z-index: 1000;
      backdrop-filter: blur(10px);
      background-color: rgba(255, 255, 255, 0.9);
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
      transition: background-color 0.3s ease, box-shadow 0.3s ease;
    }

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      max-width: 1200px;
      margin: 0 auto;
      padding: 1rem 2rem;
    }

    .logo-link {
      display: flex;
      align-items: center;
      font-size: 1.75rem;
      font-weight: bold;
      color: var(--primary-500);
      text-decoration: none;
      transition: transform 0.3s ease;
    }

    .logo-link:hover {
      transform: scale(1.05);
    }

    .logo i {
      margin-right: 0.5rem;
      font-size: 1.5rem;
      color: var(--primary-500);
    }

    .nav-list {
      display: flex;
      gap: 2rem;
      list-style: none;
      margin: 0;
      padding: 0;
      align-items: center;
    }

    .nav-item a {
      position: relative;
      color: var(--neutral-700);
      font-weight: 500;
      text-decoration: none;
      padding: 0.25rem 0;
      transition: color 0.3s ease;
    }

    .nav-item a::after {
      content: '';
      position: absolute;
      bottom: -4px;
      left: 0;
      width: 0;
      height: 2px;
      background-color: var(--primary-500);
      transition: width 0.3s ease;
    }

    .nav-item a:hover::after {
      width: 100%;
    }

    .nav-item a:hover {
      color: var(--primary-500);
    }

    .nav-item a.active:not(.btn) {
      color: var(--primary-500);
      font-weight: 600;
    }

    .btn {
      padding: 0.4rem 1rem;
      border-radius: 6px;
      background-color: var(--primary-500);
      color: white;
      text-decoration: none;
      font-weight: 600;
      transition: background-color 0.3s ease, transform 0.2s ease;
    }

    .btn:hover {
      background-color: var(--primary-600);
      transform: translateY(-2px);
    }

    @media (max-width: 768px) {
      .logo span {
        display: none;
      }

      .nav-list {
        gap: 1rem;
      }

      .header-content {
        padding: 0.75rem 1.25rem;
      }
    }
  `]
})
export class HeaderComponent {}
