import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse
} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // In a real application, this would add the authentication token
    // For this demo, we'll simulate API responses
    
    // Add auth token if available
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer fake-jwt-token`
        }
      });
    }
    
    // Pass the request to the next handler
    return next.handle(request);
  }
}