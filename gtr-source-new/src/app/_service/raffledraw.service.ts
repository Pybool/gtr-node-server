import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { TokenService } from './token.service'; // Assuming you have a TokenService

@Injectable()
export class RaffleDrawService {
  private authToken: string | null;

  constructor(private http: HttpClient, private tokenService: TokenService) {
    this.authToken = this.tokenService.retrieveToken('gtr-accessToken');
  }

  public getHeaders(): HttpHeaders {
    let headers = new HttpHeaders();
    if (this.authToken) {
      headers = headers.set('Authorization', `Bearer ${this.authToken}`);
    }
    return headers;
  }

  public createRaffleDraw(payload: any) {
    return this.http.post(
      `${environment.nodeApi}/api/v1/admin/raffle/create-event`,
      payload,
      { headers: this.getHeaders() }
    );
  }

  public createPrize(payload: any) {
    return this.http.post(
      `${environment.nodeApi}/api/v1/admin/raffle/create-prize`,
      payload,
      { headers: this.getHeaders() }
    );
  }

  public fetchPrizes() {
    return this.http.get(
      `${environment.nodeApi}/api/v1/admin/raffle/fetch-prizes`,
      { headers: this.getHeaders() }
    );
  }

  public deletePrize(id: string) {
    return this.http.delete(
      `${environment.nodeApi}/api/v1/admin/raffle/delete-prize?id=${id}`,
      { headers: this.getHeaders() }
    );
  }

  public suspendRaffleDraw(id: string) {
    return this.http.put(
      `${environment.nodeApi}/api/v1/admin/raffle/suspend-raffle-draw?id=${id}`,
      { headers: this.getHeaders() }
    );
  }

  public fecthRaffleDraws(page: number = 1, limit: number = 10) {
    return this.http.get(
      `${environment.nodeApi}/api/v1/admin/raffle/fetch-raffle-draws?page=${page}&limit=${limit}`,
      { headers: this.getHeaders() }
    );
  }

  public getActiveRaffleDraw(phone: string = '') {
    return this.http.get(
      `${environment.nodeApi}/api/v1/admin/raffle/get-active-raffledraw?phone=${phone}`,
      { headers: this.getHeaders() }
    );
  }

  public checkTicketsAvailability(payload: { qty: number }) {
    return this.http.post(
      `${environment.nodeApi}/api/v1/admin/raffle/check-tickets-availability`,
      payload,
      { headers: this.getHeaders() }
    );
  }

  public closeRaffleDraw() {
    return this.http.get(
      `${environment.nodeApi}/api/v1/admin/raffle/close-raffledraw`,
      { headers: this.getHeaders() }
    );
  }

  public searchTicketsWins(payload: {
    contestCode: string;
    tickets: number[];
  }) {
    return this.http.post(
      `${environment.nodeApi}/api/v1/admin/raffle/search-ticket-wins`,
      payload,
      { headers: this.getHeaders() }
    );
  }
}
