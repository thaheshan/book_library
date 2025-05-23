import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="not-found slide-in-up">
      <div class="not-found-content">
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>The page you are looking for does not exist or has been moved.</p>
        <a routerLink="/" class="btn btn-primary">Go Home</a>
      </div>
    </div>
  `,
  styles: [`
    .not-found {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: var(--space-64) 0;
    }
    
    .not-found-content {
      max-width: 500px;
    }
    
    .not-found h1 {
      font-size: 6rem;
      color: var(--primary-500);
      margin-bottom: var(--space-8);
    }
    
    .not-found h2 {
      font-size: 2rem;
      margin-bottom: var(--space-16);
    }
    
    .not-found p {
      margin-bottom: var(--space-24);
      color: var(--neutral-600);
    }
  `]
})
export class NotFoundComponent {}