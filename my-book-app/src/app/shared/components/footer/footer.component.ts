import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <footer class="footer">
      <div class="container">
        <div class="footer-grid">
          <div class="footer-section">
            <h3 class="footer-title">BookSphere</h3>
            <p class="footer-description">
              Your ultimate book management platform for readers and authors.
            </p>
            <div class="social-links">
              <a href="#" class="social-link"><i class="fab fa-facebook-f"></i></a>
              <a href="#" class="social-link"><i class="fab fa-twitter"></i></a>
              <a href="#" class="social-link"><i class="fab fa-instagram"></i></a>
              <a href="#" class="social-link"><i class="fab fa-linkedin-in"></i></a>
            </div>
          </div>
          
          <div class="footer-section">
            <h4 class="footer-subtitle">Quick Links</h4>
            <ul class="footer-links">
              <li><a routerLink="/">Home</a></li>
              <li><a routerLink="/books">Books</a></li>
              <li><a routerLink="/categories">Categories</a></li>
              <li><a routerLink="/authors">Authors</a></li>
            </ul>
          </div>
          
          <div class="footer-section">
            <h4 class="footer-subtitle">Resources</h4>
            <ul class="footer-links">
              <li><a routerLink="/help">Help Center</a></li>
              <li><a routerLink="/faq">FAQ</a></li>
              <li><a routerLink="/community">Community</a></li>
              <li><a routerLink="/blog">Blog</a></li>
            </ul>
          </div>
          
          <div class="footer-section">
            <h4 class="footer-subtitle">Legal</h4>
            <ul class="footer-links">
              <li><a routerLink="/terms">Terms of Service</a></li>
              <li><a routerLink="/privacy">Privacy Policy</a></li>
              <li><a routerLink="/copyright">Copyright</a></li>
              <li><a routerLink="/cookies">Cookie Policy</a></li>
            </ul>
          </div>
        </div>
        
        <div class="footer-bottom">
          <p>&copy; 2025 BookSphere. All rights reserved.</p>
          <p>Made with <i class="fas fa-heart"></i> for knowledge lovers</p>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background-color: var(--bg-secondary);
      border-top: 1px solid var(--border-color);
      padding: var(--space-5) 0 var(--space-3);
      margin-top: var(--space-6);
    }
    
    .footer-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: var(--space-4);
    }
    
    .footer-title {
      font-size: 1.5rem;
      font-weight: var(--font-weight-bold);
      color: var(--primary-600);
      margin-bottom: var(--space-2);
    }
    
    .footer-description {
      color: var(--text-secondary);
      margin-bottom: var(--space-3);
      line-height: 1.5;
    }
    
    .footer-subtitle {
      font-size: 1.1rem;
      font-weight: var(--font-weight-medium);
      color: var(--text-primary);
      margin-bottom: var(--space-3);
    }
    
    .footer-links {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    
    .footer-links li {
      margin-bottom: var(--space-2);
    }
    
    .footer-links a {
      color: var(--text-secondary);
      text-decoration: none;
      transition: color 0.2s ease;
    }
    
    .footer-links a:hover {
      color: var(--primary-600);
      text-decoration: none;
    }
    
    .social-links {
      display: flex;
      gap: var(--space-2);
      margin-top: var(--space-3);
    }
    
    .social-link {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background-color: var(--bg-primary);
      color: var(--text-secondary);
      transition: all 0.2s ease;
    }
    
    .social-link:hover {
      background-color: var(--primary-600);
      color: white;
      text-decoration: none;
    }
    
    .footer-bottom {
      margin-top: var(--space-5);
      padding-top: var(--space-3);
      border-top: 1px solid var(--border-color);
      display: flex;
      justify-content: space-between;
      color: var(--text-muted);
      font-size: 0.9rem;
    }
    
    .footer-bottom i {
      color: var(--error-500);
    }
    
    /* Responsive adjustments */
    @media (max-width: 992px) {
      .footer-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
    
    @media (max-width: 576px) {
      .footer-grid {
        grid-template-columns: 1fr;
      }
      
      .footer-bottom {
        flex-direction: column;
        align-items: center;
        text-align: center;
        gap: var(--space-2);
      }
    }
  `]
})
export class FooterComponent {
  constructor() {}
}