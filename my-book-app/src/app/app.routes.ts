import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { AuthGuard } from './core copy/guards/auth.guard';
import { AuthorGuard } from './core copy/guards/author.guard';

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
     path: 'auth',
     children: [
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent }
    ]
  },
  {
     path: 'books/search',
     loadComponent: () => import('./books/book-list/book-list.component').then(m => m.BookListComponent)
  },
  {
    path: 'author',
    canActivate: [AuthorGuard],
    children: [
      { 
        path: 'books/add', 
        loadComponent: () => import('./books/book-form/book-form.component').then(m => m.BookFormComponent)
      },
      { 
        path: 'books/edit/:id', 
        loadComponent: () => import('./books/book-form/book-form.component').then(m => m.BookFormComponent)
      },
      { 
        path: 'dashboard', 
        loadComponent: () => import('./books/book-list/book-list.component').then(m => m.BookListComponent)
      }
    ]
  },
  {
    path: 'my-books',
    canActivate: [AuthGuard],
    loadComponent: () => import('./books/book-list/book-list.component').then(m => m.BookListComponent)
  },
  
  {
     path: '**',
     loadComponent: () => import('./core/not-found/not-found.component').then(m => m.NotFoundComponent)
   }
];