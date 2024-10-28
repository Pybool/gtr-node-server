import { Component, OnInit } from '@angular/core';
import { ghanaAirports } from '../ghanaAirports';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-flight-tracker',
  templateUrl: './flight-tracker.component.html',
  styleUrls: ['./flight-tracker.component.scss'],
})
export class FlightTrackerComponent implements OnInit {
  blockFilter = '';
  isDropdownOpen: boolean = false;
  ghanaAirports = ghanaAirports;
  selectedAirport: any = { airportName: 'Choose an Airport', airport: {} };
  airportName: string;
  type: string = 'arrival';

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.airportName = this.activatedRoute.snapshot.paramMap.get('airport');
    this.type = this.activatedRoute.snapshot.paramMap.get('type');
    window.localStorage.setItem('gtr-active', 'flights');
    if (this.airportName) {
      this.getSelectedAirport();
    } else {
      this.router.navigate(['flights-tracker/kotoka/arrival']);
    }
  }

  ngAfterViewInit() {
    let airportName = this.selectedAirport.airport?.airport_name;

    if (!airportName.toLowerCase().includes('airport')) {
      airportName = airportName + ' Airport ';
    }

    this.chooseAirport(
      airportName + ' ' + this.selectedAirport.airport.country_name,
      this.selectedAirport.airport,
      true
    );
    this.setDefaultBlockFilter(this.type);

    const path = `flights-tracker/${this.selectedAirport.airport.airport_name.toLowerCase()}/${
      this.blockFilter
    }`;
    this.changeToPath(path, {});
    const tabs = document.querySelectorAll(`.tab-item`) as any;
    tabs.array?.forEach((element) => {
      element.classList.remove('active');
    });
    document.querySelector(`.${this.type}`).classList.add('active');
  }

  toggleBlockFilter($event: any, tab: string) {
    if (this.selectedAirport.airport) {
      this.blockFilter = 'null';
      const activeTab = document.querySelector('.active') as HTMLElement;
      activeTab?.classList?.remove('active');
      this.blockFilter = tab;
      $event.target.closest('li')?.classList?.add('active');
    } else {
      alert('Please select an airport');
    }
    const path = `flights-tracker/${this.selectedAirport.airport.airport_name.toLowerCase()}/${
      this.blockFilter
    }`;
    this.changeToPath(path, {});
  }

  setDefaultBlockFilter(tab: string) {
    if (this.selectedAirport.airport) {
      const activeTab = document.querySelector(`.${this.type}`) as HTMLElement;
      this.blockFilter = tab;
      activeTab.classList?.add('active');
    }
  }

  getSelectedAirport() {
    const airport = ghanaAirports.find(
      (airport) =>
        airport.airport_name.toLowerCase() === this.airportName.toLowerCase()
    );
    this.selectedAirport = { airportName: airport.airport_name, airport };
  }

  chooseAirport(airportName: string, airport: any, auto = false) {
    this.selectedAirport.airport = airport;
    this.selectedAirport.airportName = airportName;
    this.blockFilter = this.activatedRoute.snapshot.paramMap.get('type');

    const activeTab = document.querySelector('.active') as HTMLElement;
    activeTab?.classList?.remove('active');

    setTimeout(() => {
      this.setDefaultBlockFilter(
        this.activatedRoute.snapshot.paramMap.get('type')
      );
      const selTab: any = Array.from(activeTab.parentElement.children).slice(
        1,
        3
      );
      if (this.activatedRoute.snapshot.paramMap.get('type') == 'arrival') {
        selTab[1]?.click();
      } else {
        selTab[0]?.click();
      }
      this.toggleDropdown(auto);
    }, 100);

    const path = `flights-tracker/${this.selectedAirport.airport.airport_name.toLowerCase()}/${
      this.blockFilter
    }`;
    this.changeToPath(path, {});
  }

  toggleDropdown(auto) {
    this.isDropdownOpen = !this.isDropdownOpen;
    const result = this.checkHoverDisplay();

    const tabs = document.querySelectorAll(`.tab-item`) as any;
    tabs.array?.forEach((element) => {
      element.classList.remove('active');
    });

    const dropdown = document.querySelector(`.dropdown-menu`) as any;
    if(!auto){
      if (result.status == false) {
        dropdown.style.display = 'block';
      }
    }
    

    if (this.isDropdownOpen) {
      if (result.status == true) {
        dropdown.style.display = 'none';
      }
    }
  }

  private checkHoverDisplay() {

    const dropdownElement = document.querySelector(`.dropdown-menu`) as any;
    if (dropdownElement) {
      const computedStyle = window.getComputedStyle(dropdownElement);
      const displayValue = computedStyle.getPropertyValue('display');

      console.log('Computed dropdown display: ', displayValue);
      return { status: displayValue === 'block', computedStyle };
    }
    return { status: null, computedStyle: null }; // Default to false if element or menu not found
  }

  changeToPath(action: string, params: any = false, history = false) {
    this.router.navigate([`/${action}`], {
      queryParams: {},
      replaceUrl: history,
    });
  }
}
