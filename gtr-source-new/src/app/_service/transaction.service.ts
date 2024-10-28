import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable()
export class TransactionService {
  constructor(private http: HttpClient) {}

  saveTransaction(payload: any) {
    return this.http.post(
      `${environment.nodeApi}/api/v1/transactions/save-transaction`,
      payload
    );
  }

  public verifyTransaction(
    reference: string,
    callback: (response: any) => void
  ) {
    this.http
      .get(
        `${environment.nodeApi}/api/v1/transactions/paystack/verify-transaction?ref=${reference}`
      )
      .subscribe(callback);
  }
}
