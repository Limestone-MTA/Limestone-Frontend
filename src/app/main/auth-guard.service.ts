import { Injectable, inject } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateFn } from '@angular/router';
import { CommonsService } from './commons.service';
import {CookieService} from 'ngx-cookie-service';

@Injectable()
export class AuthGuardService {
  constructor(private cookieService:CookieService, private commons: CommonsService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (!this.cookieService.check('fastapiusersauth')) {
      this.commons.redirectUrl = state.url;
      this.router.navigate(['/signin']);
      return false;
    }
    return true;
  }
}

export const AuthGuard: CanActivateFn = (next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean => {
  return inject(AuthGuardService).canActivate(next, state);
}
