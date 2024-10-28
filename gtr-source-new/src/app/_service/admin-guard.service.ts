import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { TokenService } from './token.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(
    public authService: AuthService,
    public router: Router
  ) {}
  canActivate(): boolean {
    const admin = this.authService.retrieveUser();
    if(admin?.role !== "ADMIN"){
      this.router.navigateByUrl('/raffledraws/play');
      return false;
    }
    if (
      !this.authService.retrieveToken('gtr-accessToken') ||
      !admin
    ) {
      this.router.navigateByUrl('/raffledraws/play');
      return false; 
    }
    return true;
  }
}


