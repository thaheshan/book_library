# Mock Backend for Book Management System

This implementation uses a mock backend service that simulates a RESTful API using RxJS observables. The actual backend would be implemented using ASP.NET Core with C#.

## ASP.NET Core Backend Implementation

For a real implementation, the ASP.NET Core backend would include:

1. **Models**:
   - Book model with properties: id, title, author, isbn, publicationDate, and optional fields

2. **Controllers**:
   - BooksController with endpoints for CRUD operations

3. **Services**:
   - BookService that manages the in-memory storage of books

4. **Data Storage**:
   - In-memory list as specified in the requirements
   - Could be upgraded to use Entity Framework Core with an in-memory database provider

## Example ASP.NET Core Controller

```csharp
[ApiController]
[Route("api/[controller]")]
public class BooksController : ControllerBase
{
    private readonly IBookService _bookService;

    public BooksController(IBookService bookService)
    {
        _bookService = bookService;
    }

    [HttpGet]
    public ActionResult<IEnumerable<Book>> GetBooks([FromQuery] string searchTerm = null, [FromQuery] string genre = null)
    {
        var books = _bookService.GetBooks(searchTerm, genre);
        return Ok(books);
    }

    [HttpGet("{id}")]
    public ActionResult<Book> GetBook(int id)
    {
        var book = _bookService.GetBook(id);
        if (book == null)
        {
            return NotFound();
        }
        return Ok(book);
    }

    [HttpPost]
    public ActionResult<Book> CreateBook(Book book)
    {
        var createdBook = _bookService.AddBook(book);
        return CreatedAtAction(nameof(GetBook), new { id = createdBook.Id }, createdBook);
    }

    [HttpPut("{id}")]
    public IActionResult UpdateBook(int id, Book book)
    {
        if (id != book.Id)
        {
            return BadRequest();
        }

        var updatedBook = _bookService.UpdateBook(book);
        if (updatedBook == null)
        {
            return NotFound();
        }

        return NoContent();
    }

    [HttpDelete("{id}")]
    public IActionResult DeleteBook(int id)
    {
        var result = _bookService.DeleteBook(id);
        if (!result)
        {
            return NotFound();
        }

        return NoContent();
    }
}
```

## Connection Between Angular Frontend and ASP.NET Backend

In a real implementation, the Angular service would make HTTP requests to the ASP.NET Core backend:

```typescript
// book.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Book, BookFilter } from '../models/book.model';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private apiUrl = 'api/books';

  constructor(private http: HttpClient) { }

  getBooks(filter?: BookFilter): Observable<Book[]> {
    let params = new HttpParams();
    
    if (filter) {
      if (filter.searchTerm) {
        params = params.set('searchTerm', filter.searchTerm);
      }
      if (filter.genre) {
        params = params.set('genre', filter.genre);
      }
      if (filter.sortBy) {
        params = params.set('sortBy', filter.sortBy);
        params = params.set('sortDirection', filter.sortDirection || 'asc');
      }
    }
    
    return this.http.get<Book[]>(this.apiUrl, { params });
  }

  getBook(id: number): Observable<Book> {
    return this.http.get<Book>(`${this.apiUrl}/${id}`);
  }

  addBook(book: Omit<Book, 'id'>): Observable<Book> {
    return this.http.post<Book>(this.apiUrl, book);
  }

  updateBook(id: number, book: Omit<Book, 'id'>): Observable<Book> {
    return this.http.put<Book>(`${this.apiUrl}/${id}`, { ...book, id });
  }

  deleteBook(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getGenres(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/genres`);
  }
}
```

For deployment, you would need to configure proper CORS settings in the ASP.NET Core backend and ensure the Angular app is correctly configured to point to the backend API URL.