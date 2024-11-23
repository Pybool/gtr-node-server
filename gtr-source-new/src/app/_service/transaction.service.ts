import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { TokenService } from './token.service'; // Assuming you have a TokenService

@Injectable()
export class TransactionService {
  private authToken: string | null;
  constructor(private http: HttpClient, private tokenService: TokenService) {
    this.authToken = this.tokenService.retrieveToken('gtr-accessToken');
  }

  private getHeaders(): HttpHeaders {
    let headers = new HttpHeaders();
    if (this.authToken) {
      headers = headers.set('Authorization', `Bearer ${this.authToken}`);
    }
    return headers;
  }

  saveTransaction(payload: any) {
    return this.http.post(
      `${environment.nodeApi}/api/v1/transactions/save-transaction`,
      payload,
      { headers: this.getHeaders() }
    );
  }

  public verifyTransaction(
    reference: string,
    callback: (response: any) => void
  ) {
    this.http
      .get(
        `${environment.nodeApi}/api/v1/transactions/paystack/verify-transaction?ref=${reference}`,
        { headers: this.getHeaders() }
      )
      .subscribe(callback);
  }
}
