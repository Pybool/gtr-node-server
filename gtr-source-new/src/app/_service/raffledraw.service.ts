import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable()
export class RaffleDrawService {
  constructor(private http: HttpClient) {}

  public createRaffleDraw(payload: any) {
    return this.http.post(
      `${environment.nodeApi}/api/v1/admin/raffle/create-event`,
      payload
    );
  }

  public createPrize(payload: any) {
    return this.http.post(
      `${environment.nodeApi}/api/v1/admin/raffle/create-prize`,
      payload
    );
  }

  public fetchPrizes() {
    return this.http.get(
      `${environment.nodeApi}/api/v1/admin/raffle/fetch-prizes`
    );
  }

  public fecthRaffleDraws(page: number = 1, limit: number = 10) {
    return this.http.get(
      `${environment.nodeApi}/api/v1/admin/raffle/fetch-raffle-draws?page=${page}&limit=${limit}`
    );
  }

  public getActiveRaffleDraw(phone:string = "") {
    return this.http.get(
      `${environment.nodeApi}/api/v1/admin/raffle/get-active-raffledraw?phone=${phone}`
    );
  }

  public checkTicketsAvailability(payload: { qty: number }) {
    return this.http.post(
      `${environment.nodeApi}/api/v1/admin/raffle/check-tickets-availability`,
      payload
    );
  }

  public closeRaffleDraw(){
    return this.http.get(
      `${environment.nodeApi}/api/v1/admin/raffle/close-raffledraw`
    );
  }

  public searchTicketsWins(payload: {contestCode:string; tickets: number[] }) {
    return this.http.post(
      `${environment.nodeApi}/api/v1/admin/raffle/search-ticket-wins`,
      payload
    );
  }
  
}
