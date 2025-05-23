// book.model.ts
export interface Book {
  id: number;
  title: string;
  author: string;
  isbn: string;
  publicationDate: string;
  coverImage?: string;
  description?: string;
  genre?: string;
  pageCount?: number;
  publisher?: string;
  rating?: number;
  price: number;
  isFeatured: boolean;
}

export interface BookFilter {
  searchTerm?: string;
  genre?: string;
  sortBy?: 'title' | 'author' | 'publicationDate' | 'rating' | 'price' | 'pageCount';
  sortDirection?: 'asc' | 'desc';
}