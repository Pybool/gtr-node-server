import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { TokenService } from './token.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    public tokenService: TokenService,
    public authService: AuthService,
    public router: Router
  ) {}
  canActivate(): boolean {
    if (
      !this.tokenService.retrieveToken('efielounge-admin-accessToken') ||
      !this.authService.retrieveUser()
    ) {
      this.router.navigateByUrl('/login');
      return true; //change back to false
    }
    return true;
  }
}
