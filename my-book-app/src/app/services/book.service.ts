import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay, map, tap } from 'rxjs/operators';
import { Book, BookFilter } from '../models/book.model';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private books: Book[] = [
    {
      id: 1,
      title: 'To Kill a Mockingbird',
      author: 'Harper Lee',
      isbn: '9780061120084',
      publicationDate: '1960-07-11',
      coverImage: 'https://images.pexels.com/photos/1907785/pexels-photo-1907785.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'A novel about a young girl whose father defends a black man accused of rape in the Depression-era South.',
      genre: 'Classic',
      pageCount: 336,
      publisher: 'HarperCollins',
      rating: 4.8,
      price: 12.99,
      isFeatured: true
    },
    {
      id: 2,
      title: '1984',
      author: 'George Orwell',
      isbn: '9780451524935',
      publicationDate: '1949-06-08',
      coverImage: 'https://images.pexels.com/photos/1765033/pexels-photo-1765033.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'A dystopian novel set in a totalitarian society where the government controls everything, including thought.',
      genre: 'Science Fiction',
      pageCount: 328,
      publisher: 'Penguin Books',
      rating: 4.7,
      price: 13.99,
      isFeatured: true
    },
    {
      id: 3,
      title: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald',
      isbn: '9780743273565',
      publicationDate: '1925-04-10',
      coverImage: 'https://images.pexels.com/photos/1907785/pexels-photo-1907785.jpeg?auto=compress&cs=tinysrgb&w=400&h=400',
      description: 'A novel depicting the Roaring Twenties and one man\'s pursuit of the American Dream.',
      genre: 'Classic',
      pageCount: 180,
      publisher: 'Scribner',
      rating: 4.5,
      price: 11.99,
      isFeatured: false
    },
    {
      id: 4,
      title: 'Pride and Prejudice',
      author: 'Jane Austen',
      isbn: '9780141439518',
      publicationDate: '1813-01-28',
      coverImage: 'https://images.pexels.com/photos/1765033/pexels-photo-1765033.jpeg?auto=compress&cs=tinysrgb&w=400&h=400',
      description: 'A romantic novel about the relationship between Elizabeth Bennet and Mr. Darcy.',
      genre: 'Classic',
      pageCount: 432,
      publisher: 'Penguin Classics',
      rating: 4.6,
      price: 10.99,
      isFeatured: true
    },
    {
      id: 5,
      title: 'The Catcher in the Rye',
      author: 'J.D. Salinger',
      isbn: '9780316769488',
      publicationDate: '1951-07-16',
      coverImage: 'https://images.pexels.com/photos/1907785/pexels-photo-1907785.jpeg?auto=compress&cs=tinysrgb&w=400&h=400',
      description: 'A novel about a teenager\'s experiences in New York City after being expelled from prep school.',
      genre: 'Classic',
      pageCount: 277,
      publisher: 'Little, Brown and Company',
      rating: 4.3,
      price: 9.99,
      isFeatured: false
    },
    {
      id: 6,
      title: 'Clean Code',
      author: 'Robert C. Martin',
      isbn: '9780132350884',
      publicationDate: '2008-08-01',
      coverImage: 'https://images.pexels.com/photos/270348/pexels-photo-270348.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'A handbook of agile software craftsmanship with practical advice for writing clean, maintainable code.',
      genre: 'Programming',
      pageCount: 464,
      publisher: 'Prentice Hall',
      rating: 4.4,
      price: 42.99,
      isFeatured: true
    },
    {
      id: 7,
      title: 'The Intelligent Investor',
      author: 'Benjamin Graham',
      isbn: '9780060555665',
      publicationDate: '1949-01-01',
      coverImage: 'https://images.pexels.com/photos/590020/pexels-photo-590020.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'The definitive book on value investing and a roadmap to financial success.',
      genre: 'Finance',
      pageCount: 640,
      publisher: 'Harper Business',
      rating: 4.6,
      price: 18.99,
      isFeatured: true
    },
    {
      id: 8,
      title: 'Atomic Habits',
      author: 'James Clear',
      isbn: '9780735211292',
      publicationDate: '2018-10-16',
      coverImage: 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'An easy and proven way to build good habits and break bad ones.',
      genre: 'Self-Help',
      pageCount: 320,
      publisher: 'Avery',
      rating: 4.7,
      price: 16.99,
      isFeatured: true
    }
  ];

  private nextId = 9;

  constructor() { }

  getBooks(filter?: BookFilter): Observable<Book[]> {
    let filteredBooks = [...this.books];
    
    if (filter) {
      // Apply search filter
      if (filter.searchTerm) {
        const searchTermLower = filter.searchTerm.toLowerCase();
        filteredBooks = filteredBooks.filter(book => 
          book.title.toLowerCase().includes(searchTermLower) ||
          book.author.toLowerCase().includes(searchTermLower) ||
          book.isbn.toLowerCase().includes(searchTermLower)
        );
      }
      
      // Apply genre filter
      if (filter.genre) {
        filteredBooks = filteredBooks.filter(book => book.genre === filter.genre);
      }
      
      // Apply sorting
      if (filter.sortBy) {
        filteredBooks.sort((a, b) => {
          const aValue = a[filter.sortBy!];
          const bValue = b[filter.sortBy!];
          
          if (typeof aValue === 'string' && typeof bValue === 'string') {
            return filter.sortDirection === 'desc' 
              ? bValue.localeCompare(aValue) 
              : aValue.localeCompare(bValue);
          }
          
          return filter.sortDirection === 'desc' 
            ? Number(bValue) - Number(aValue) 
            : Number(aValue) - Number(bValue);
        });
      }
    }
    
    // Simulate network delay
    return of(filteredBooks).pipe(delay(300));
  }

  getBook(id: number): Observable<Book> {
    const book = this.books.find(b => b.id === id);
    
    if (!book) {
      return throwError(() => new Error(`Book with id ${id} not found`));
    }
    
    return of(book).pipe(delay(300));
  }

  getFeaturedBooks(limit: number = 6): Observable<Book[]> {
    const featuredBooks = this.books
      .filter(book => book.isFeatured)
      .slice(0, limit);
    
    return of(featuredBooks).pipe(delay(300));
  }

  addBook(book: Omit<Book, 'id'>): Observable<Book> {
    const newBook: Book = {
      ...book,
      id: this.nextId++
    };
    
    this.books.push(newBook);
    
    return of(newBook).pipe(delay(300));
  }

  createBook(bookData: Omit<Book, 'id'>): Observable<Book> {
    return this.addBook(bookData);
  }

  updateBook(id: number, book: Omit<Book, 'id'>): Observable<Book> {
    const index = this.books.findIndex(b => b.id === id);
    
    if (index === -1) {
      return throwError(() => new Error(`Book with id ${id} not found`));
    }
    
    const updatedBook: Book = {
      ...book,
      id
    };
    
    this.books[index] = updatedBook;
    
    return of(updatedBook).pipe(delay(300));
  }

  deleteBook(id: number): Observable<void> {
    const index = this.books.findIndex(b => b.id === id);
    
    if (index === -1) {
      return throwError(() => new Error(`Book with id ${id} not found`));
    }
    
    this.books.splice(index, 1);
    
    return of(undefined).pipe(delay(300));
  }

  purchaseBook(bookId: number): Observable<{ success: boolean; message: string }> {
    const book = this.books.find(b => b.id === bookId);
    
    if (!book) {
      return throwError(() => new Error(`Book with id ${bookId} not found`));
    }
    
    // Simulate purchase process with random success/failure
    const isSuccess = Math.random() > 0.1; // 90% success rate
    
    if (isSuccess) {
      return of({ 
        success: true, 
        message: `Successfully purchased "${book.title}" for $${book.price}` 
      }).pipe(delay(1000));
    } else {
      return throwError(() => new Error('Payment processing failed. Please try again.'));
    }
  }

  getGenres(): Observable<string[]> {
    const genres = [...new Set(this.books.map(book => book.genre).filter(genre => !!genre))];
    return of(genres as string[]).pipe(delay(300));
  }

  getBooksByGenre(genre: string): Observable<Book[]> {
    const filteredBooks = this.books.filter(book => 
      book.genre?.toLowerCase() === genre.toLowerCase()
    );
    
    return of(filteredBooks).pipe(delay(300));
  }

  searchBooks(searchTerm: string): Observable<Book[]> {
    const searchTermLower = searchTerm.toLowerCase();
    const filteredBooks = this.books.filter(book => 
      book.title.toLowerCase().includes(searchTermLower) ||
      book.author.toLowerCase().includes(searchTermLower) ||
      book.description?.toLowerCase().includes(searchTermLower) ||
      book.genre?.toLowerCase().includes(searchTermLower)
    );
    
    return of(filteredBooks).pipe(delay(300));
  }
}