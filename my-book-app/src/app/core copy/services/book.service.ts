import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { Book } from '../models/book.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private books: Book[] = [
    {
      id: 1,
      title: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald',
      isbn: '9780743273565',
      publicationDate: new Date('1925-04-10'),
      description: 'Set in the Jazz Age on Long Island, the novel depicts narrator Nick Carraway\'s interactions with mysterious millionaire Jay Gatsby and Gatsby\'s obsession to reunite with his former lover, Daisy Buchanan.',
      coverImage: 'https://images.pexels.com/photos/5834/nature-grass-leaf-green.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      isPremium: false,
      genre: 'Classic',
      rating: 4.3,
      pages: 218
    },
    {
      id: 2,
      title: 'To Kill a Mockingbird',
      author: 'Harper Lee',
      isbn: '9780061120084',
      publicationDate: new Date('1960-07-11'),
      description: 'The story takes place during three years of the Great Depression in the fictional town of Maycomb, Alabama. It focuses on six-year-old Scout Finch, who lives with her older brother Jem and their father Atticus, a middle-aged lawyer.',
      coverImage: 'https://images.pexels.com/photos/2228561/pexels-photo-2228561.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      isPremium: false,
      genre: 'Classic',
      rating: 4.5,
      pages: 324
    },
    {
      id: 3,
      title: 'Clean Code',
      author: 'Robert C. Martin',
      isbn: '9780132350884',
      publicationDate: new Date('2008-08-01'),
      description: "Even bad code can function. But if code isn't clean, it can bring a development organization to its knees. Every year, countless hours and significant resources are lost because of poorly written code.",
      coverImage: 'https://images.pexels.com/photos/4974915/pexels-photo-4974915.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      isPremium: true,
      price: 29.99,
      genre: 'Programming',
      rating: 4.7,
      pages: 464
    },
    {
      id: 4,
      title: 'Algorithms to Live By',
      author: 'Brian Christian & Tom Griffiths',
      isbn: '9781627790369',
      publicationDate: new Date('2016-04-19'),
      description: 'A fascinating exploration of how computer algorithms can be applied to our everyday lives, helping to solve common decision-making problems.',
      coverImage: 'https://images.pexels.com/photos/267669/pexels-photo-267669.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      isPremium: true,
      price: 24.99,
      genre: 'Science',
      rating: 4.4,
      pages: 368
    },
    {
      id: 5,
      title: 'The Psychology of Money',
      author: 'Morgan Housel',
      isbn: '9780857197689',
      publicationDate: new Date('2020-09-08'),
      description: "Timeless lessons on wealth, greed, and happiness doing well with money isn't necessarily about what you know. It's about how you behave.",
      coverImage: 'https://images.pexels.com/photos/951408/pexels-photo-951408.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      isPremium: true,
      price: 19.99,
      genre: 'Finance',
      rating: 4.6,
      pages: 256
    },
    {
      id: 6,
      title: 'Atomic Habits',
      author: 'James Clear',
      isbn: '9780735211292',
      publicationDate: new Date('2018-10-16'),
      description: 'An easy and proven way to build good habits and break bad ones.',
      coverImage: 'https://images.pexels.com/photos/3747139/pexels-photo-3747139.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      isPremium: false,
      genre: 'Self-Help',
      rating: 4.8,
      pages: 320
    }
  ];

  private booksSubject = new BehaviorSubject<Book[]>(this.books);
  public books$ = this.booksSubject.asObservable();

  constructor(private authService: AuthService) {}

  getBooks(): Observable<Book[]> {
    return this.books$.pipe(delay(300)); // Simulate network delay
  }

  getBookById(id: number): Observable<Book> {
    const book = this.books.find(b => b.id === id);
    if (book) {
      return of(book).pipe(delay(300));
    }
    return throwError(() => new Error('Book not found'));
  }

  searchBooks(query: string): Observable<Book[]> {
    query = query.toLowerCase().trim();
    return this.books$.pipe(
      map(books => 
        books.filter(book => 
          book.title.toLowerCase().includes(query) || 
          book.author.toLowerCase().includes(query) || 
          book.isbn.includes(query) ||
          (book.genre && book.genre.toLowerCase().includes(query))
        )
      ),
      delay(300) // Simulate network delay
    );
  }

  addBook(book: Omit<Book, 'id'>): Observable<Book> {
    // Check if user is authenticated and is an author
    if (!this.authService.isAuthenticated() || !this.authService.isAuthor()) {
      return throwError(() => new Error('Unauthorized: Only authors can add books'));
    }

    const newBook: Book = {
      ...book,
      id: Math.max(...this.books.map(b => b.id), 0) + 1
    };

    this.books.push(newBook);
    this.booksSubject.next(this.books);
    
    return of(newBook).pipe(delay(500)); // Simulate API delay
  }

  updateBook(updatedBook: Book): Observable<Book> {
    // Check if user is authenticated and is an author
    if (!this.authService.isAuthenticated() || !this.authService.isAuthor()) {
      return throwError(() => new Error('Unauthorized: Only authors can update books'));
    }

    const index = this.books.findIndex(b => b.id === updatedBook.id);
    if (index !== -1) {
      this.books[index] = { ...updatedBook };
      this.booksSubject.next(this.books);
      return of(updatedBook).pipe(delay(500));
    }
    
    return throwError(() => new Error('Book not found'));
  }

  deleteBook(id: number): Observable<boolean> {
    // Check if user is authenticated and is an author
    if (!this.authService.isAuthenticated() || !this.authService.isAuthor()) {
      return throwError(() => new Error('Unauthorized: Only authors can delete books'));
    }

    const index = this.books.findIndex(b => b.id === id);
    if (index !== -1) {
      this.books.splice(index, 1);
      this.booksSubject.next(this.books);
      return of(true).pipe(delay(500));
    }
    
    return throwError(() => new Error('Book not found'));
  }

  // Filter books by category
  getBooksByCategory(category: string): Observable<Book[]> {
    return this.books$.pipe(
      map(books => books.filter(book => book.genre === category)),
      delay(300)
    );
  }
  
  // Get premium books
  getPremiumBooks(): Observable<Book[]> {
    return this.books$.pipe(
      map(books => books.filter(book => book.isPremium)),
      delay(300)
    );
  }
  
  // Get free books
  getFreeBooks(): Observable<Book[]> {
    return this.books$.pipe(
      map(books => books.filter(book => !book.isPremium)),
      delay(300)
    );
  }
  
  // Get books by an author
  getBooksByAuthor(authorName: string): Observable<Book[]> {
    return this.books$.pipe(
      map(books => books.filter(book => 
        book.author.toLowerCase().includes(authorName.toLowerCase())
      )),
      delay(300)
    );
  }
}