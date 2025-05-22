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
              <a href="#" aria-label="Facebook" class="social-link"><i class="fab fa-facebook-f"></i></a>
              <a href="#" aria-label="Twitter" class="social-link"><i class="fab fa-twitter"></i></a>
              <a href="#" aria-label="Instagram" class="social-link"><i class="fab fa-instagram"></i></a>
              <a href="#" aria-label="LinkedIn" class="social-link"><i class="fab fa-linkedin-in"></i></a>
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
          <p>Made with <i class="fas fa-heart pulse"></i> for knowledge lovers</p>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background-color: var(--bg-secondary);
      border-top: 1px solid var(--border-color);
      padding: 4rem 1rem 2rem;
      margin-top: 4rem;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }

    .footer-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 2rem;
    }

    .footer-title {
      font-size: 1.75rem;
      font-weight: bold;
      color: var(--primary-600);
      margin-bottom: 0.75rem;
    }

    .footer-description {
      color: var(--text-secondary);
      font-size: 0.95rem;
      line-height: 1.6;
      margin-bottom: 1.5rem;
    }

    .footer-subtitle {
      font-size: 1.2rem;
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: 1rem;
    }

    .footer-links {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .footer-links li {
      margin-bottom: 0.5rem;
    }

    .footer-links a {
      color: var(--text-secondary);
      text-decoration: none;
      transition: color 0.3s ease;
      font-size: 0.95rem;
    }

    .footer-links a:hover {
      color: var(--primary-600);
    }

    .social-links {
      display: flex;
      gap: 0.75rem;
    }

    .social-link {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background-color: var(--bg-primary);
      color: var(--text-secondary);
      transition: transform 0.3s ease, background-color 0.3s ease;
      font-size: 1rem;
    }

    .social-link:hover {
      background-color: var(--primary-600);
      color: white;
      transform: scale(1.1);
    }

    .footer-bottom {
      margin-top: 2.5rem;
      padding-top: 1rem;
      border-top: 1px solid var(--border-color);
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: var(--text-muted);
      font-size: 0.875rem;
      flex-wrap: wrap;
      row-gap: 0.5rem;
    }

    .footer-bottom i {
      color: var(--error-500);
      margin-left: 0.25rem;
    }

    .pulse {
      animation: pulse 1.5s infinite ease-in-out;
    }

    @keyframes pulse {
      0%, 100% {
        transform: scale(1);
        opacity: 1;
      }
      50% {
        transform: scale(1.2);
        opacity: 0.6;
      }
    }

    @media (max-width: 576px) {
      .footer-bottom {
        flex-direction: column;
        text-align: center;
      }
    }
  `]
})
export class FooterComponent {}
