import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../core copy/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  template: `
    <div class="auth-container">
      <div class="auth-card slide-up">
        <div class="auth-header">
          <h2>Create Account</h2>
          <p>Join BookSphere and start your reading journey</p>
        </div>
        
        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="auth-form">
          <div class="form-row">
            <div class="form-group">
              <label for="firstName" class="form-label">First Name</label>
              <input 
                type="text" 
                id="firstName" 
                formControlName="firstName" 
                class="form-control"
                [ngClass]="{'invalid': submitted && f['firstName'].errors}"
                placeholder="John">
              <div *ngIf="submitted && f['firstName'].errors" class="error-message">
                <span *ngIf="f['firstName'].errors['required']">First name is required</span>
              </div>
            </div>
            
            <div class="form-group">
              <label for="lastName" class="form-label">Last Name</label>
              <input 
                type="text" 
                id="lastName" 
                formControlName="lastName" 
                class="form-control"
                [ngClass]="{'invalid': submitted && f['lastName'].errors}"
                placeholder="Doe">
              <div *ngIf="submitted && f['lastName'].errors" class="error-message">
                <span *ngIf="f['lastName'].errors['required']">Last name is required</span>
              </div>
            </div>
          </div>
          
          <div class="form-group">
            <label for="username" class="form-label">Username</label>
            <input 
              type="text" 
              id="username" 
              formControlName="username" 
              class="form-control"
              [ngClass]="{'invalid': submitted && f['username'].errors}"
              placeholder="johndoe">
            <div *ngIf="submitted && f['username'].errors" class="error-message">
              <span *ngIf="f['username'].errors['required']">Username is required</span>
              <span *ngIf="f['username'].errors['minlength']">Username must be at least 3 characters</span>
            </div>
          </div>
          
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
            <label for="password" class="form-label">Password</label>
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
              <span *ngIf="f['password'].errors['minlength']">Password must be at least 6 characters</span>
            </div>
          </div>
          
          <div class="form-group">
            <label for="confirmPassword" class="form-label">Confirm Password</label>
            <input 
              type="password" 
              id="confirmPassword" 
              formControlName="confirmPassword" 
              class="form-control"
              [ngClass]="{'invalid': submitted && f['confirmPassword'].errors}"
              placeholder="••••••••">
            <div *ngIf="submitted && f['confirmPassword'].errors" class="error-message">
              <span *ngIf="f['confirmPassword'].errors['required']">Please confirm your password</span>
              <span *ngIf="f['confirmPassword'].errors['mustMatch']">Passwords must match</span>
            </div>
          </div>
          
          <div class="form-group">
            <div class="checkbox-group">
              <input type="checkbox" id="isAuthor" formControlName="isAuthor">
              <label for="isAuthor" class="checkbox-label">Register as an author</label>
            </div>
          </div>
          
          <div class="form-group">
            <div class="checkbox-group">
              <input type="checkbox" id="terms" formControlName="terms">
              <label for="terms" class="checkbox-label">
                I agree to the <a routerLink="/terms" target="_blank">Terms of Service</a> and <a routerLink="/privacy" target="_blank">Privacy Policy</a>
              </label>
            </div>
            <div *ngIf="submitted && f['terms'].errors" class="error-message">
              <span *ngIf="f['terms'].errors['required']">You must agree to the terms and conditions</span>
            </div>
          </div>
          
          <div *ngIf="error" class="error-alert">
            {{ error }}
          </div>
          
          <button type="submit" class="btn-primary btn-full" [disabled]="loading">
            <span *ngIf="loading" class="loader"></span>
            <span *ngIf="!loading">Create Account</span>
          </button>
        </form>
        
        <div class="auth-footer">
          <p>Already have an account? <a routerLink="/auth/login">Sign In</a></p>
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
      max-width: 600px;
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
    
    .form-row {
      display: flex;
      gap: var(--space-3);
    }
    
    .form-row .form-group {
      flex: 1;
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
    
    /* Responsive adjustments */
    @media (max-width: 576px) {
      .form-row {
        flex-direction: column;
        gap: 0;
      }
    }
  `]
})
export class RegisterComponent {
  registerForm: FormGroup;
  loading: boolean = false;
  submitted: boolean = false;
  error: string = '';
  showPassword: boolean = false;
  
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    // Redirect if already logged in
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/']);
    }
    
    this.registerForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      isAuthor: [false],
      terms: [false, Validators.requiredTrue]
    }, {
      validator: this.passwordMatchValidator
    });
  }
  
  // Convenience getter for form fields
  get f() { return this.registerForm.controls; }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
  
  // Custom validator to check if passwords match
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (password?.value !== confirmPassword?.value) {
      confirmPassword?.setErrors({ mustMatch: true });
    } else {
      confirmPassword?.setErrors(null);
    }
    
    return null;
  }

  onSubmit(): void {
    this.submitted = true;
    this.error = '';

    // Stop if form is invalid
    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;
    
    const user = {
      email: this.f['email'].value,
      username: this.f['username'].value,
      password: this.f['password'].value,
      firstName: this.f['firstName'].value,
      lastName: this.f['lastName'].value,
      isAuthor: this.f['isAuthor'].value
    };
    
    this.authService.register(user)
      .subscribe({
        next: () => {
          this.router.navigate(['/']);
        },
        error: error => {
          this.error = error.message;
          this.loading = false;
        }
      });
  }
}