import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError, timer } from 'rxjs';
import { delay, tap, catchError, map } from 'rxjs/operators';
import { User } from '../models/user.model';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  isAuthor?: boolean;
}

export interface AuthResponse {
  user: User;
  token?: string;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  private readonly STORAGE_KEY = 'currentUser';
  private readonly TOKEN_KEY = 'auth_token';
  
  // Mock users for demo - In production, this would come from a backend API
  private users: User[] = [
    {
      id: 1,
      email: 'author@example.com',
      username: 'author',
      password: 'password123', // In real app, this would be hashed
      firstName: 'John',
      lastName: 'Doe',
      isAuthor: true,
      purchasedBooks: [4, 5],
      createdAt: new Date('2023-01-15'),
      avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=6366f1&color=fff'
    },
    {
      id: 2,
      email: 'reader@example.com',
      username: 'reader',
      password: 'password123', // In real app, this would be hashed
      firstName: 'Jane',
      lastName: 'Smith',
      isAuthor: false,
      purchasedBooks: [3],
      createdAt: new Date('2023-02-20'),
      avatar: 'https://ui-avatars.com/api/?name=Jane+Smith&background=10b981&color=fff'
    },
    {
      id: 3,
      email: 'admin@booksphere.com',
      username: 'admin',
      password: 'admin123',
      firstName: 'Admin',
      lastName: 'User',
      isAuthor: true,
      purchasedBooks: [],
      createdAt: new Date('2023-01-01'),
      avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=dc2626&color=fff'
    }
  ];

  constructor() {
    this.initializeAuth();
  }

  private initializeAuth(): void {
    try {
      const storedUser = localStorage.getItem(this.STORAGE_KEY);
      if (storedUser) {
        const user = JSON.parse(storedUser);
        // Validate stored user data
        if (this.isValidUser(user)) {
          this.currentUserSubject.next(user);
        } else {
          this.clearStoredAuth();
        }
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
      this.clearStoredAuth();
    }
  }

  private isValidUser(user: any): boolean {
    return user && 
           typeof user.id === 'number' && 
           typeof user.email === 'string' && 
           typeof user.username === 'string';
  }

  private clearStoredAuth(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    localStorage.removeItem(this.TOKEN_KEY);
    this.currentUserSubject.next(null);
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  login(credentials: LoginCredentials, value: any): Observable<AuthResponse> {
    const { email, password } = credentials;
    
    // Basic validation
    if (!email || !password) {
      return throwError(() => new Error('Email and password are required'));
    }

    if (!this.isValidEmail(email)) {
      return throwError(() => new Error('Please enter a valid email address'));
    }

    // Simulate API call with delay
    const user = this.users.find(u => 
      u.email.toLowerCase() === email.toLowerCase() && 
      u.password === password
    );
    
    if (user) {
      // Remove password from response for security
      const { password: _, ...userWithoutPassword } = user;
      const authResponse: AuthResponse = {
        user: userWithoutPassword as User,
        token: this.generateMockToken(user.id),
        message: 'Login successful'
      };

      return of(authResponse).pipe(
        delay(800), // Simulate network delay
        tap(response => {
          localStorage.setItem(this.STORAGE_KEY, JSON.stringify(response.user));
          localStorage.setItem(this.TOKEN_KEY, response.token || '');
          this.currentUserSubject.next(response.user);
        }),
        catchError(error => {
          console.error('Login error:', error);
          return throwError(() => new Error('Login failed. Please try again.'));
        })
      );
    }
    
    return throwError(() => new Error('Invalid email or password'));
  }

  register(userData: RegisterData): Observable<AuthResponse> {
    // Validation
    const validationError = this.validateRegistrationData(userData);
    if (validationError) {
      return throwError(() => new Error(validationError));
    }

    // Check if user already exists
    if (this.users.some(u => 
      u.email.toLowerCase() === userData.email.toLowerCase() || 
      u.username.toLowerCase() === userData.username.toLowerCase()
    )) {
      return throwError(() => new Error('A user with this email or username already exists'));
    }

    // Create new user
    const newUser: User = {
      ...userData,
      id: this.getNextUserId(),
      createdAt: new Date(),
      purchasedBooks: [],
      isAuthor: userData.isAuthor || false,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.firstName + '+' + userData.lastName)}&background=6366f1&color=fff`
    };

    // Add to users array
    this.users.push(newUser);

    // Remove password from response
    const { password: _, ...userWithoutPassword } = newUser;
    const authResponse: AuthResponse = {
      user: userWithoutPassword as User,
      token: this.generateMockToken(newUser.id),
      message: 'Registration successful'
    };

    // Return observable with delay to simulate API call
    return of(authResponse).pipe(
      delay(800),
      tap(response => {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(response.user));
        localStorage.setItem(this.TOKEN_KEY, response.token || '');
        this.currentUserSubject.next(response.user);
      }),
      catchError(error => {
        console.error('Registration error:', error);
        return throwError(() => new Error('Registration failed. Please try again.'));
      })
    );
  }

  logout(): Observable<boolean> {
    return of(true).pipe(
      delay(300),
      tap(() => {
        this.clearStoredAuth();
      }),
      map(() => true),
      catchError(error => {
        console.error('Logout error:', error);
        // Even if there's an error, clear local auth
        this.clearStoredAuth();
        return of(true);
      })
    );
  }

  isAuthenticated(): boolean {
    return !!this.currentUserValue && !!localStorage.getItem(this.TOKEN_KEY);
  }

  isAuthor(): boolean {
    return this.currentUserValue?.isAuthor || false;
  }

  // Method to purchase a premium book
  purchaseBook(bookId: number): Observable<User> {
    if (!this.currentUserValue) {
      return throwError(() => new Error('Please log in to purchase books'));
    }

    if (!bookId || bookId <= 0) {
      return throwError(() => new Error('Invalid book ID'));
    }

    const user = { ...this.currentUserValue };
    if (!user.purchasedBooks) {
      user.purchasedBooks = [];
    }
    
    if (user.purchasedBooks.includes(bookId)) {
      return throwError(() => new Error('You have already purchased this book'));
    }

    user.purchasedBooks.push(bookId);

    // Update in localStorage and BehaviorSubject
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
    this.currentUserSubject.next(user);

    // Update in users array
    const index = this.users.findIndex(u => u.id === user.id);
    if (index !== -1) {
      this.users[index] = { ...this.users[index], purchasedBooks: user.purchasedBooks };
    }

    return of(user).pipe(
      delay(500), // Simulate API delay
      catchError(error => {
        console.error('Purchase error:', error);
        return throwError(() => new Error('Purchase failed. Please try again.'));
      })
    );
  }

  // Check if user has access to a specific book
  hasAccessToBook(bookId: number): boolean {
    if (!this.currentUserValue) return false;
    return this.currentUserValue.purchasedBooks?.includes(bookId) || false;
  }

  // Update user profile
  updateProfile(profileData: Partial<User>): Observable<User> {
    if (!this.currentUserValue) {
      return throwError(() => new Error('Please log in to update your profile'));
    }

    const updatedUser = { 
      ...this.currentUserValue, 
      ...profileData,
      id: this.currentUserValue.id, // Prevent ID from being changed
      createdAt: this.currentUserValue.createdAt // Prevent creation date from being changed
    };

    // Update in users array
    const index = this.users.findIndex(u => u.id === updatedUser.id);
    if (index !== -1) {
      this.users[index] = updatedUser;
    }

    // Update localStorage and BehaviorSubject
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedUser));
    this.currentUserSubject.next(updatedUser);

    return of(updatedUser).pipe(
      delay(500),
      catchError(error => {
        console.error('Profile update error:', error);
        return throwError(() => new Error('Profile update failed. Please try again.'));
      })
    );
  }

  // Change password
  changePassword(currentPassword: string, newPassword: string): Observable<boolean> {
    if (!this.currentUserValue) {
      return throwError(() => new Error('Please log in to change your password'));
    }

    const user = this.users.find(u => u.id === this.currentUserValue!.id);
    if (!user || user.password !== currentPassword) {
      return throwError(() => new Error('Current password is incorrect'));
    }

    if (newPassword.length < 6) {
      return throwError(() => new Error('New password must be at least 6 characters long'));
    }

    // Update password
    user.password = newPassword;

    return of(true).pipe(
      delay(500),
      catchError(error => {
        console.error('Password change error:', error);
        return throwError(() => new Error('Password change failed. Please try again.'));
      })
    );
  }

  // Get user by ID (useful for profile views)
  getUserById(userId: number): Observable<User | null> {
    const user = this.users.find(u => u.id === userId);
    if (user) {
      const { password: _, ...userWithoutPassword } = user;
      return of(userWithoutPassword as User).pipe(delay(300));
    }
    return of(null);
  }

  // Refresh current user data
  refreshCurrentUser(): Observable<User | null> {
    if (!this.currentUserValue) {
      return of(null);
    }

    return this.getUserById(this.currentUserValue.id).pipe(
      tap(user => {
        if (user) {
          localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
          this.currentUserSubject.next(user);
        }
      })
    );
  }

  // Private helper methods
  private validateRegistrationData(userData: RegisterData): string | null {
    if (!userData.email || !userData.password || !userData.username || 
        !userData.firstName || !userData.lastName) {
      return 'All fields are required';
    }

    if (!this.isValidEmail(userData.email)) {
      return 'Please enter a valid email address';
    }

    if (userData.password.length < 6) {
      return 'Password must be at least 6 characters long';
    }

    if (userData.username.length < 3) {
      return 'Username must be at least 3 characters long';
    }

    if (!/^[a-zA-Z0-9_]+$/.test(userData.username)) {
      return 'Username can only contain letters, numbers, and underscores';
    }

    return null;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private getNextUserId(): number {
    return Math.max(...this.users.map(u => u.id)) + 1;
  }

  private generateMockToken(userId: number): string {
    // In a real app, this would be a JWT token from the server
    const payload = {
      userId,
      exp: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
    };
    return btoa(JSON.stringify(payload));
  }

  // Token validation (for mock implementation)
  isTokenValid(): boolean {
    try {
      const token = localStorage.getItem(this.TOKEN_KEY);
      if (!token) return false;
      
      const payload = JSON.parse(atob(token));
      return payload.exp > Date.now();
    } catch {
      return false;
    }
  }
}