import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
  CategoryViewInterface,
  LandingResponseInterface,
  LatestViewInterface,
  MoreTodayInterface,
  SearchResultInterface,
  SingleViewInterface,
} from '../_model/all.interface';
import { catchError, map } from 'rxjs/operators';
import { withCache } from '@ngneat/cashew';

@Injectable()
export class GTRGeneralService {
  constructor(private http: HttpClient) {}

  public getHeaderNews(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}header`);
  }
  public podcast(id: string, para: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}podcast/${id}/${para}`);
  }
  public podcastSingle(title: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}podcast_single/${title}`);
  }
  public landingNews(): Observable<LandingResponseInterface> {
    return this.http.get<LandingResponseInterface>(
      `${environment.apiUrl}landing`
    );
  }
  public view(para: string): Observable<SingleViewInterface> {
    return this.http.get<SingleViewInterface>(
      `${environment.apiUrl}view/${para}`
    );
  }
  public category(para: string, id: string): Observable<CategoryViewInterface> {
    return this.http.get<CategoryViewInterface>(
      `${environment.apiUrl}category/${para}/${id}`
    );
  }
  public latestNews(para: string): Observable<LatestViewInterface> {
    return this.http.get<LatestViewInterface>(
      `${environment.apiUrl}latest_news/${para}`
    );
  }

  public moreToday(para: string): Observable<MoreTodayInterface> {
    return this.http.get<MoreTodayInterface>(
      `${environment.apiUrl}more_today/${para}`
    );
  }
  public moreLifestyle(para: string): Observable<MoreTodayInterface> {
    return this.http.get<MoreTodayInterface>(
      `${environment.apiUrl}more_lifestyle/${para}`
    );
  }
  public newsCheck(search: string, page): Observable<SearchResultInterface> {
    return this.http.get<SearchResultInterface>(
      `${environment.apiUrl}newscheck/${search}/${page}`
    );
  }
  public getWeather(lat, lon): Observable<SearchResultInterface> {
    return this.http.get<SearchResultInterface>(
      `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=30b26511d54e71f3a52be759d4ac39c2`
    );
  }


  public getFlightArrivals(
    airport,
    flightStatus: string,
    flightDate: string | null,
    page = 1
  ): Observable<any> {
    let url;

    if (flightStatus == '') {
      url = `https://api.aviationstack.com/v1/flights?access_key=${environment.flightTracker.aviationStackApikey}&arr_icao=${airport.icao_code}&flight_date=${flightDate}&offset=${page}`; // Replace with your actual API URL
    } else {
      url = `https://api.aviationstack.com/v1/flights?access_key=${environment.flightTracker.aviationStackApikey}&flight_status=${flightStatus}&flight_date=${flightDate}&offset=${page}`;
    }
    return this.http.get<any>(url);
  }

  public getFlightDepartures(
    airport,
    flightStatus: string,
    flightDate: string | null,
    page = 1
  ): Observable<any> {
    let url;
    if (flightStatus == '') {
      url = `https://api.aviationstack.com/v1/flights?access_key=${environment.flightTracker.aviationStackApikey}&dep_icao=${airport.icao_code}&flight_date=${flightDate}&offset=${page}`; // Replace with your actual API URL
    } else {
      url = `https://api.aviationstack.com/v1/flights?access_key=${environment.flightTracker.aviationStackApikey}&dep_icao=${airport.icao_code}&flight_date=${flightDate}&offset=${page}`;
    }
    return this.http.get<any>(url);
  }

  public searchFlightByFlightNo(flightNo: string) {
    let url = `https://api.aviationstack.com/v1/flights?access_key=${environment.flightTracker.aviationStackApikey}&flight_number=${flightNo}&limit=10000`;
    return this.http.get<any>(url);
  }

  public searchAirports(searchTerm: string, page = 1): Observable<any> {
    return this.http.get<any>(
      `https://api.aviationstack.com/v1/airports?access_key=${environment.flightTracker.aviationStackApikey}&offset=${page}&search=${searchTerm}`,
      {
        context: withCache({
          cache: false,
          ttl: 30 * 60 * 1000,
          version: 'v1',
          key: 'airportFilter',
        }),
      }
    );
  }

  public makeAirportRequest(airport: any, flight_status) {
    let url;
    if (flight_status == '') {
      url = `https://api.aviationstack.com/v1/flights?access_key=${environment.flightTracker.aviationStackApikey}&arr_icao=${airport.icao_code}`; // Replace with your actual API URL
    } else {
      url = `https://api.aviationstack.com/v1/flights?access_key=${environment.flightTracker.aviationStackApikey}&flight_status=${flight_status}`;
    }

    console.log('Url ', url);

    return this.http
      .get(url, {
        context: withCache({
          cache: false,
          ttl: 30 * 60 * 1000,
          version: 'v1',
          key: 'flightsFilter',
        }),
      })
      .pipe(
        map((response) => ({
          // Map the response to a consistent format
          ...airport,
          // Add any additional properties you need from the response
          details: response, // Or specific data you want from the response
        }))
      );
  }
}
