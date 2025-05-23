export interface Book {
  id: number;
  title: string;
  author: string;
  isbn: string;
  publicationDate: Date;
  description?: string;
  coverImage?: string;
  isPremium: boolean;
  price?: number;
  genre?: string;
  rating?: number;
  pages?: number;
}