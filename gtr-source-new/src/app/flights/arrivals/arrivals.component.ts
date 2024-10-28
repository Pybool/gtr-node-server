import {
  AfterViewInit,
  Component,
  Input,
  OnChanges,
  OnInit,
} from '@angular/core';
import { catchError, concatMap, take } from 'rxjs/operators';
import { GTRGeneralService } from 'src/app/_service/gtr_general.service';
import { environment } from 'src/environments/environment';
import { ghanaAirports } from './ghanaAirports';
import { forkJoin, Observable, of } from 'rxjs';
import { CacheService } from 'src/app/_service/cacheService.service';

@Component({
  selector: 'app-arrivals',
  templateUrl: './arrivals.component.html',
  styleUrls: ['./arrivals.component.scss'],
})
export class ArrivalsComponent implements OnInit, AfterViewInit, OnChanges {
  public fullFlightData: any;
  public flightsData: any[] = [];
  public flightSegments: { current: any[]; later: any[]; earlier: any[] } = {
    current: [],
    later: [],
    earlier: [],
  };
  public activeTab = 'arrival';
  public flightStatus: string = '*';
  public page: number = 1;
  public searchBarText = '';
  public isSearching: boolean = false;
  public showSpinner: boolean = false;
  public isDropdownOpen: boolean = false;
  public dropdownText: string = 'Flight No (ARR)';
  public filterSlugAction: string = 'flight-no-(arr)';
  public airportResultsCount = 0;
  public selectedFlight: any = null;
  public flightStatusBlockFilter = null;
  public flightsForDate: string | null = null;
  @Input() blockFilter: string | null = '';
  @Input() selectedAirport: any = ghanaAirports[0];
  resultsText = `Showing flight results for ${this.airportResultsCount} airports..`;
  flightStatuses = [
    'scheduled',
    'active',
    'landed',
    'cancelled',
    'incident',
    'diverted',
  ];
  public scopeLocal: boolean = environment.flightTracker.scopeLocal;

  constructor(
    private api: GTRGeneralService,
    private cacheService: CacheService
  ) {
    this.activeTab = 'arrival';
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {}

  ngOnChanges(changes: import('@angular/core').SimpleChanges) {
    if (changes['blockFilter']) {
      const newFilterValue = changes['blockFilter'].currentValue;
      this.activeTab = newFilterValue;
      if (this.activeTab == 'arrival') {
        this.fetchArrivalFlights(this.selectedAirport.airport);
      } else if (this.activeTab == 'departure') {
        this.fetchDepartureFlights(this.selectedAirport.airport);
      } else if (this.flightStatuses.includes(this.activeTab)) {
        this.flightStatusBlockFilter = 'arrival'; // default to arrival for now
        this.fetchArrivalFlights(this.selectedAirport.airport, this.activeTab);
      }
    }
  }

  onDateChange() {
    this.flightsForDate = this.flightsForDate.toString().slice(0, 10);
    console.log(this.flightsForDate);
    if (this.activeTab == 'arrival') {
      this.fetchArrivalFlights(this.selectedAirport.airport);
    } else if (this.activeTab == 'departure') {
      this.fetchDepartureFlights(this.selectedAirport.airport);
    } else if (this.flightStatuses.includes(this.activeTab)) {
      this.flightStatusBlockFilter = 'arrival'; // default to arrival for now
      this.fetchArrivalFlights(this.selectedAirport.airport, this.activeTab);
    }
  }

  getTodayDate() {
    const today = new Date();
    return today.toISOString().slice(0, 10);
  }

  fetchArrivalFlights(airport, flightStatus = '', page = 1) {
    this.showSpinner = true;
    airport = airport || ghanaAirports[0];
    let cacheKey = `${flightStatus}-arr-${
      airport.icao_code
    }-page-${page}-date-${this.flightsForDate || this.getTodayDate()}`;

    const cachedFlights = this.cacheService.getData(cacheKey);
    this.setFlights();

    if (cachedFlights) {
      this.fullFlightData = cachedFlights;
      this.setFlights(cachedFlights?.data?.data);
      this.showSpinner = false;
    } else {
      this.api
        .getFlightArrivals(
          airport,
          flightStatus,
          this.flightsForDate || this.getTodayDate(),
          page
        )
        .pipe(take(1))
        .subscribe(
          (flights: any) => {
            this.showSpinner = false;
            if (flights.data) {
              this.fullFlightData = flights;
              this.setFlights(flights.data);
              this.cacheService.setData(cacheKey, flights);
            } else {
              this.resultsText = `No results were founf at this time..`;
            }
          },
          (error) => {
            this.showSpinner = false;
            this.resultsText = `Could not fetch flights at this time , please try again shortly`;
          }
        );
    }
  }

  reset(){
    this.isSearching = false;
    document.location.reload()
  }

  setFlights(data: any[] = []) {
    if(this.isSearching){
      this.flightsData = data;
    }
    this.flightsData = this.reorderFlights(data);
  }

  fetchDepartureFlights(airport, flightStatus = '', page = 1) {
    this.setFlights();
    this.showSpinner = true;
    let cacheKey = `${flightStatus}-arr-${
      airport.icao_code
    }-page-${page}-date-${this.flightsForDate || this.getTodayDate()}`;
    const cachedFlights = this.cacheService.getData(cacheKey);

    if (cachedFlights) {
      this.fullFlightData = cachedFlights;
      this.setFlights(cachedFlights?.data?.data);
      this.showSpinner = false;
    } else {
      this.api
        .getFlightDepartures(
          airport,
          flightStatus,
          this.flightsForDate || this.getTodayDate(),
          page
        )
        .pipe(take(1))
        .subscribe(
          (flights: any) => {
            this.showSpinner = false;
            if (flights.data) {
              this.setFlights(flights.data);
              this.fullFlightData = flights;
              this.cacheService.setData(cacheKey, flights);
            } else {
              this.resultsText = `No results were found at this time..`;
            }
          },
          (error) => {
            this.showSpinner = false;
            this.resultsText = `Could not fetch flights at this time , please try again shortly`;
          }
        );
    }
  }

  toggleDropdown(event: Event): void {
    event.stopPropagation(); // Prevent click event propagation to document
    this.isDropdownOpen = !this.isDropdownOpen;
    try{
      const filterDropDownEls = document.querySelectorAll(".dropdown-menu") as any;
      if(filterDropDownEls[1].style.display == "none") {
        filterDropDownEls[1].style.display = "block"
      }else{
        filterDropDownEls[1].style.display = "none"
      }
    }catch(error:any){
      console.log(error)
    }
  }

  chooseAction(action: string) {
    this.dropdownText = action;
    this.filterSlugAction = action.replace(/\s+/g, '-').toLowerCase();
    try{
      const filterDropDownEls = document.querySelectorAll(".dropdown-menu") as any;
      filterDropDownEls[1].style.display = "none"
    }catch(error:any){
      console.log(error)
    }

  }

  searchBarFilter() {
    this.setFlights();
    this.airportResultsCount = 0;
    this.isSearching = true;
    if (this.filterSlugAction === 'find-by-airline') {
    } else if (this.filterSlugAction.includes('flight-no')) {
      this.showSpinner = true;
      if (this.filterSlugAction === 'flight-no-(arr)') {
        this.blockFilter = 'arrival';
      } else if (this.filterSlugAction === 'flight-no-(dep)') {
        this.blockFilter = 'departure';
      }

      this.api
        .searchFlightByFlightNo(this.searchBarText)
        .pipe(take(1))
        .subscribe(
          (flights: any) => {
            this.showSpinner = false;
            if (flights?.data) {
              const filteredFlights = flights.data.filter(
                (flight) =>
                  flight[this.blockFilter].icao ==
                  this.selectedAirport.airport.icao_code
              );
              this.setFlights(filteredFlights);
            } else {
              this.setFlights();
            }
          },
          (error) => {
            this.showSpinner = false;
            this.setFlights();
          }
        );
    }
  }

  showFlightMoreDetails(index: number) {
    for (let i = 0; i <= this.flightsData.length; i++) {
      if (this.flightsData[i]) {
        if (index !== i) {
          this.flightsData[i].moreDetails = false;
        }
        let plus = document.querySelector(`#plus-mob-${i}`) as HTMLElement;
        if (plus) {
          if (index !== i) {
            plus.style.transform = 'rotate(0deg)';
          }
        }
      }
    }
    this.flightsData[index].moreDetails = !this.flightsData[index].moreDetails;
    this.selectedFlight = this.flightsData[index];
    let plus = document.querySelector(`#plus-mob-${index}`) as HTMLElement;
    if (plus) {
      if (plus?.style?.transform == 'rotate(0deg)') {
        plus.style.transform = 'rotate(45deg)';
      } else {
        plus.style.transform = 'rotate(0deg)';
      }
    }
  }

  formatTime(dateString: string) {
    const date = new Date(dateString);

    const hours = date.getUTCHours(); // Use UTC hours for consistent formatting
    const minutes = date.getMinutes().toString().padStart(2, '0'); // Pad minutes with leading zero
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12; // Convert to 12-hour format

    return `${formattedHours}:${minutes}:${ampm}`;
  }

  formatDateTime(dateTimeString: string) {
    const date = new Date(dateTimeString);
    const dateOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    } as any;
    const timeOptions = {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    } as any;

    const formattedDate = date.toLocaleDateString('en-US', dateOptions);
    const formattedTime = date.toLocaleTimeString('en-US', timeOptions);

    return `${formattedDate} ${formattedTime}`;
  }

  onPageChange(hr: number) {
    // Implement logic to fetch or display data for the new page
    const data = [
      ...this.flightSegments.current,
      ...this.flightSegments.later,
      ...this.flightSegments.earlier,
    ];
    this.flightsData = this.reorderFlights(data, hr);
    // page = page - 1;
    // if (this.activeTab == 'arrival') {
    //   this.fetchArrivalFlights(this.selectedAirport.airport, '', page);
    // } else if (this.activeTab == 'departure') {
    //   this.fetchDepartureFlights(this.selectedAirport.airport, '', page);
    // } else if (this.flightStatuses.includes(this.activeTab)) {
    //   this.flightStatusBlockFilter = 'arrival'; // default to arrival for now
    //   this.fetchArrivalFlights(
    //     this.selectedAirport.airport,
    //     this.activeTab,
    //     page
    //   );
    // }
  }

  public reorderFlights(data, hr = null) {
    const now = new Date();
    // Separate flights based on arrival hour (in UTC)
    const currentHourFlights = [];
    const nextHourFlights = [];
    const otherFlights = [];
    for (const flight of data) {
      if (flight[this.blockFilter].scheduled) {
        const arrivalTime = new Date(flight[this.blockFilter].scheduled);
        const arrivalTimeUTC = new Date(
          arrivalTime.getUTCFullYear(),
          arrivalTime.getUTCMonth(),
          arrivalTime.getUTCDate(),
          arrivalTime.getUTCHours(),
          arrivalTime.getUTCMinutes(),
          arrivalTime.getUTCSeconds(),
          arrivalTime.getUTCMilliseconds()
        );
        const arrivalHourUTC = arrivalTimeUTC.getUTCHours();
        let currentHourUTC = now.getUTCHours();
        if (hr) {
          currentHourUTC = hr;
        }
        console.log('currentHourUTC ', currentHourUTC, currentHourUTC + 1);
        const nextHourUTC = (currentHourUTC + 1) % 24; // Handle hour rollover

        if (arrivalHourUTC === currentHourUTC) {
          currentHourFlights.push(flight);
        } else if (arrivalHourUTC === nextHourUTC) {
          nextHourFlights.push(flight);
        } else {
          otherFlights.push(flight);
        }
      } else {
        otherFlights.push(flight);
      }
    }

    // Sort flights within each category (optional)
    currentHourFlights.sort((flightA, flightB) => {
      const arrivalTimeA = new Date(flightA[this.blockFilter].scheduled);
      const arrivalTimeB = new Date(flightB[this.blockFilter].scheduled);
      return arrivalTimeA.getMinutes() - arrivalTimeB.getMinutes();
    });

    nextHourFlights.sort((flightA, flightB) => {
      const arrivalTimeA = new Date(flightA[this.blockFilter].scheduled);
      const arrivalTimeB = new Date(flightB[this.blockFilter].scheduled);
      return arrivalTimeA.getMinutes() - arrivalTimeB.getMinutes();
    });

    // Combine and return the sorted arrays
    this.flightSegments = {
      current: currentHourFlights,
      later: nextHourFlights,
      earlier: otherFlights,
    };
    this.cacheService.setFlightSegments({
      blockFilter: this.blockFilter,
      data: this.flightSegments,
    });

    return [...currentHourFlights];
  }

  // filterAirportsByCache(airports, flightStatus) {
  //   let airportsToDelete = [];
  //   if (flightStatus != '') {
  //     return airports;
  //   } else {
  //     for (let airport of airports) {
  //       const flights = this.cacheService.getData(airport.icao_code);
  //       if (flights) {
  //         console.log('Flights from cache ', flights, typeof flights);
  //         this.showSpinner = false;
  //         this.airportResultsCount += 1;
  //         for (const flight of flights.data) {
  //           this.flightsData.push(flight);
  //         }
  //         this.flightsData[0].moreDetails = true;
  //         if (!this.isSearching) {
  //           this.selectedFlight = this.flightsData[0];
  //           this.isSearching = true;
  //         }
  //         airportsToDelete.push(airport.icao_code);
  //       }
  //     }

  //     for (const airport of airportsToDelete) {
  //       const indexToDelete = airports.findIndex(
  //         (delairport) => delairport.icao_code === airport
  //       );
  //       if (indexToDelete !== -1) {
  //         airports.splice(indexToDelete, 1);
  //         console.log(
  //           `Airport with ICAO code ${airport.icao_code} deleted successfully.`
  //         );
  //       }
  //     }
  //     console.log('Returning filtered airports ', airports);
  //     return airports;
  //   }
  // }

  // searchFlightByIcao(airports: any[], flightStatus) {
  //   let mergedData = [];
  //   const filteredAirports = this.filterAirportsByCache(airports, flightStatus);
  //   console.log('FFF ', filteredAirports);
  //   filteredAirports.map((airport) =>
  //     this.api
  //       .makeAirportRequest(airport, flightStatus)
  //       .pipe(
  //         concatMap((response) => {
  //           mergedData.push(response.details.data); // Append response to mergedData
  //           return of(response.details.data); // Return the response as an observable
  //         })
  //       )
  //       .subscribe(
  //         (flights) => {
  //           this.showSpinner = false;
  //           this.airportResultsCount += 1;

  //           console.log('Received airport data:', flights);
  //           for (let flight of flights) {
  //             this.flightsData.push(flight);
  //             this.flightsData[0].moreDetails = true;
  //           }
  //           if (!this.isSearching) {
  //             this.selectedFlight = this.flightsData[0];
  //             this.isSearching = true;
  //           }

  //           this.cacheService.setData(`${airport.icao_code}`, flights);

  //           // Process individual responses here (optional)
  //         },
  //         (error) => {
  //           this.showSpinner = false;
  //           console.error('Error fetching airport data:', error);
  //         }
  //       )
  //   );
  // }
}
