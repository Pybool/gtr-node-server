import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../environments/environment';
import { from, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  userKey: string = 'user';
  private tokenKey = 'gtr-accessToken';
  private refreshTokenKey = 'gtr-refreshToken';

  constructor(private cookieService: CookieService) {}

  storeTokens(loginResponse: any) {
    this.cookieService.set(this.tokenKey, loginResponse.accessToken);
    this.cookieService.set(this.refreshTokenKey, loginResponse.refreshToken);
    // Backup in localStorage
    localStorage.setItem(this.tokenKey, loginResponse.accessToken);
    localStorage.setItem(this.refreshTokenKey, loginResponse.refreshToken);
  }

  retrieveToken(tokenKey: string = this.tokenKey) {
    const token =
      this.cookieService.get(tokenKey) || localStorage.getItem(tokenKey);
    return token || null;
  }

  retrieveUser() {
    const user = localStorage.getItem(this.userKey);
    return user ? JSON.parse(user) : null;
  }

  removeTokens() {
    this.cookieService.delete(this.tokenKey);
    this.cookieService.delete(this.refreshTokenKey);
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.refreshTokenKey);
  }

  async refresh() {
    const refreshToken = this.retrieveToken('gtr-refreshToken');
    if (refreshToken == undefined || refreshToken == 'undefined') {
      return this.logout();
    }
    try {
      const url = `${environment.nodeApi}/api/v1/auth/refresh-token`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Something went wrong!');
      }
      const data = await response.json();
      return of(data);
    } catch {
      return of({ status: false });
    }
  }

  refreshObservable() {
    return from(this.refresh()).pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }

  removeUser() {
    this.cookieService.delete(this.userKey);
  }

  logout() {
    this.removeUser();
    this.cookieService.delete('gtr-accessToken');
    this.cookieService.delete('gtr-refreshToken');
    window.localStorage.removeItem('gtr-accessToken');
    window.localStorage.removeItem('gtr-refreshToken');
    return (document.location.href = '/raffledraw/login');
  }
}
