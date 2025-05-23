import { Injectable } from '@angular/core';
import { 
  ActivatedRouteSnapshot, 
  Router, 
  RouterStateSnapshot,
  UrlTree 
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthorGuard {
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}
  
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.authService.isAuthenticated() && this.authService.isAuthor()) {
      return true;
    }
    
    if (!this.authService.isAuthenticated()) {
      // Redirect to login if not authenticated
      return this.router.createUrlTree(['/auth/login'], { 
        queryParams: { returnUrl: state.url } 
      });
    }
    
    // Redirect to home page if authenticated but not an author
    return this.router.createUrlTree(['/']);
  }
}