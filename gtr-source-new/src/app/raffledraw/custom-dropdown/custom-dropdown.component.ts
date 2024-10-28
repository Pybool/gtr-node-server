import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface Iselect {
  id: string;
  value: any;
}
@Component({
  selector: 'app-custom-dropdown',
  templateUrl: './custom-dropdown.component.html',
  styleUrls: ['./custom-dropdown.component.scss'],
})
export class CustomDropdownComponent implements OnInit {
  @Input() items: Iselect[] = [];
  @Output() selectionChanged = new EventEmitter<Iselect>();
  @Input() resetOnSelect: boolean = false;

  searchTerm: string = '';
  filteredItems: Iselect[] = [];
  show: boolean = false;

  ngOnInit(): void {
    this.filteredItems = this.items; // Initialize with all items
    console.log(this.filteredItems);
  }

  filterItems(): void {
    if (this.searchTerm.trim() === '') {
      this.filteredItems = this.items;
    } else {
      this.filteredItems = this.items.filter((item) =>
        item.value.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    if (!this.show) {
      this.showDropdownMenu();
    }
  }

  selectItem(item: Iselect): void {
    this.selectionChanged.emit(item);
    this.searchTerm = item.value;
    this.filteredItems = []; // Optionally, close the dropdown
    if(this.resetOnSelect){
      this.clearInput() //Remove if you dont wish to reset once item is dselected
    }
  }

  showDropdownMenu() {
    this.show = !this.show;
  }

  clearInput() {
    this.searchTerm = '';
    this.selectionChanged.emit({ id: '', value: this.searchTerm });
  }
}
