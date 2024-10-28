import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { countryCodes } from 'src/app/_service/countrycodes';

@Component({
  selector: 'app-gcountry-select',
  templateUrl: './country-select.component.html',
  styleUrls: ['./country-select.component.scss'],
})
export class GenericCountrySelectComponent {
  countryCodes = countryCodes
  @Output() countrySelected = new EventEmitter<{ name: string; dial_code: string; code: string }>();

  filteredCountryCodes = [...this.countryCodes]; // To hold filtered country codes
  @Input() selectedCountry: { name: string; dial_code: string } = this.countryCodes[0]; // Default to the first country (Ghana)
  isDropdownOpen: boolean = false; // Tracks if the dropdown is open
  searchTerm: string = ''; // The search term

  toggleDropdown(event: Event) {
    event.stopPropagation();
    this.isDropdownOpen = !this.isDropdownOpen;
    if (!this.isDropdownOpen) {
      this.searchTerm = ''; // Clear search when dropdown is closed
      this.filteredCountryCodes = [...this.countryCodes]; // Reset the filter when closed
    }
  }

  onSearchChange() {
    this.filteredCountryCodes = this.countryCodes.filter(country =>
      country.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      country.dial_code.includes(this.searchTerm)
    );
  }

  selectCountry(country: { name: string; dial_code: string; code: string }) {
    this.selectedCountry = country;
    this.isDropdownOpen = false; // Close the dropdown
    this.countrySelected.emit(country); // Emit the selected country
  }

  closeDropdown() {
    this.isDropdownOpen = false;
  }
}
