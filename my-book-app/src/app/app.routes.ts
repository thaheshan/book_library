import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'books', pathMatch: 'full' },
  { 
    path: 'books', 
    loadComponent: () => import('./books/book-list/book-list.component').then(m => m.BookListComponent) 
  },
  { 
    path: 'books/new', 
    loadComponent: () => import('./books/book-form/book-form.component').then(m => m.BookFormComponent) 
  },
  { 
    path: 'books/:id', 
    loadComponent: () => import('./books/book-detail/book-detail.component').then(m => m.BookDetailComponent) 
  },
  { 
    path: 'books/:id/edit', 
    loadComponent: () => import('./books/book-form/book-form.component').then(m => m.BookFormComponent) 
  },
  { 
    path: '**', 
    loadComponent: () => import('./core/not-found/not-found.component').then(m => m.NotFoundComponent) 
  }
];