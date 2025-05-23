import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../core copy/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  template: `
    <div class="auth-container">
      <div class="auth-card slide-up">
        <div class="auth-header">
          <h2>Welcome Back</h2>
          <p>Sign in to your BookSphere account</p>
        </div>
        
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="auth-form">
          <div class="form-group">
            <label for="email" class="form-label">Email</label>
            <input 
              type="email" 
              id="email" 
              formControlName="email" 
              class="form-control"
              [ngClass]="{'invalid': submitted && f['email'].errors}"
              placeholder="your@email.com">
            <div *ngIf="submitted && f['email'].errors" class="error-message">
              <span *ngIf="f['email'].errors['required']">Email is required</span>
              <span *ngIf="f['email'].errors['email']">Please enter a valid email</span>
            </div>
          </div>
          
          <div class="form-group">
            <div class="password-label-group">
              <label for="password" class="form-label">Password</label>
              <a routerLink="/auth/forgot-password" class="forgot-password">Forgot password?</a>
            </div>
            <div class="password-input-group">
              <input 
                [type]="showPassword ? 'text' : 'password'" 
                id="password" 
                formControlName="password" 
                class="form-control"
                [ngClass]="{'invalid': submitted && f['password'].errors}"
                placeholder="••••••••">
              <button 
                type="button" 
                class="password-toggle" 
                (click)="togglePasswordVisibility()">
                <i [class]="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
              </button>
            </div>
            <div *ngIf="submitted && f['password'].errors" class="error-message">
              <span *ngIf="f['password'].errors['required']">Password is required</span>
            </div>
          </div>
          
          <div class="form-group">
            <div class="checkbox-group">
              <input type="checkbox" id="remember" formControlName="remember">
              <label for="remember" class="checkbox-label">Remember me</label>
            </div>
          </div>
          
          <div *ngIf="error" class="error-alert">
            {{ error }}
          </div>
          
          <button type="submit" class="btn-primary btn-full" [disabled]="loading">
            <span *ngIf="loading" class="loader"></span>
            <span *ngIf="!loading">Sign In</span>
          </button>
        </form>
        
        <div class="auth-footer">
          <p>Don't have an account? <a routerLink="/auth/register">Sign Up</a></p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: calc(100vh - 180px);
      padding: var(--space-4);
    }
    
    .auth-card {
      width: 100%;
      max-width: 480px;
      background-color: var(--bg-secondary);
      border-radius: 0.5rem;
      padding: var(--space-5);
      box-shadow: 0 4px 20px var(--shadow-color);
    }
    
    .auth-header {
      text-align: center;
      margin-bottom: var(--space-4);
    }
    
    .auth-header h2 {
      font-size: 1.75rem;
      font-weight: var(--font-weight-bold);
      color: var(--text-primary);
      margin-bottom: var(--space-1);
    }
    
    .auth-header p {
      color: var(--text-secondary);
    }
    
    .auth-form {
      margin-bottom: var(--space-4);
    }
    
    .password-label-group {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-1);
    }
    
    .forgot-password {
      font-size: 0.85rem;
      color: var(--primary-600);
    }
    
    .password-input-group {
      position: relative;
    }
    
    .password-toggle {
      position: absolute;
      right: var(--space-2);
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      color: var(--text-muted);
      cursor: pointer;
      padding: var(--space-1);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .checkbox-group {
      display: flex;
      align-items: center;
      gap: var(--space-2);
    }
    
    .checkbox-label {
      color: var(--text-secondary);
      font-size: 0.9rem;
    }
    
    .btn-full {
      width: 100%;
      padding: var(--space-2) var(--space-3);
      margin-top: var(--space-3);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--space-2);
      height: 44px;
    }
    
    .auth-footer {
      text-align: center;
      color: var(--text-secondary);
      font-size: 0.9rem;
    }
    
    .auth-footer a {
      color: var(--primary-600);
      font-weight: var(--font-weight-medium);
    }
    
    .error-message {
      color: var(--error-600);
      font-size: 0.8rem;
      margin-top: var(--space-1);
    }
    
    .error-alert {
      background-color: var(--error-100);
      color: var(--error-700);
      padding: var(--space-2) var(--space-3);
      border-radius: 0.25rem;
      margin-bottom: var(--space-3);
      font-size: 0.9rem;
    }
    
    .form-control.invalid {
      border-color: var(--error-500);
    }
    
    .loader {
      width: 20px;
      height: 20px;
      border: 3px solid rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      border-top-color: white;
      animation: spin 1s ease-in-out infinite;
    }
    
    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  loading: boolean = false;
  submitted: boolean = false;
  error: string = '';
  showPassword: boolean = false;
  returnUrl: string = '/';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // Redirect if already logged in
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/']);
    }
    
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      remember: [false]
    });
    
    // Get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  // Convenience getter for form fields
  get f() { return this.loginForm.controls; }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    this.submitted = true;
    this.error = '';

    // Stop if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.authService.login(this.f['email'].value, this.f['password'].value)
      .subscribe({
        next: () => {
          this.router.navigate([this.returnUrl]);
        },
        error: error => {
          this.error = error.message;
          this.loading = false;
        }
      });
  }
}