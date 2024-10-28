import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

interface DataWithTTL {
  data: any;
  createdAt: number;
  ttl: number;
}

@Injectable()
export class CacheService {
  private FlightSegments: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor() {}

 

  setFlightSegments(data:any){
    this.FlightSegments.next(data)
  }

  getFlightSegments(): Observable<any> {
    return this.FlightSegments.asObservable();
  }

  public setData(key: string, data: any, ttl: number = 30) {//30 for 30mins
    const payload: DataWithTTL = {
      data: data,
      ttl: ttl * 60 * 1000,
      createdAt: Date.now(),
    };
    window.localStorage.setItem(key, JSON.stringify(payload));
  }

  public getData(key) {
    let val: any = window.localStorage.getItem(key);
    if (val) {
      val = JSON.parse(val);
      const isExpired: boolean = this.isDataExpired(val);
      if (isExpired) {
        return null;
      }
      console.log("Cahce ", val)
      return val;
    }
    return null;
  }

  private isDataExpired(data: DataWithTTL): boolean {
    const now = Date.now();
    const expiryTime = data.createdAt + data.ttl;
  
    // Calculate remaining time in seconds
    const remainingTime = Math.max(expiryTime - now, 0) / 1000; 
  
    console.log(`Data expiry status: ${(now > expiryTime) ? 'Expired' : 'Not Expired'}`);
    console.log(`Remaining time: ${remainingTime.toFixed(2)} seconds`);
  
    return now > expiryTime;
  }
}
