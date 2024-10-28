import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-snackbar',
  templateUrl: './snackbar.component.html',
  styleUrls: ['./snackbar.component.css'],
})
export class SnackBarComponent implements OnInit {
  message: string = '';
  visible: boolean = false;
  errVisible: boolean = false;
  private hideTimeout: any;

  constructor() {}

  ngOnInit(): void {}

  show(
    message: string,
    isError: boolean = false,
    duration: number = 3000
  ): void {
    this.message = message;
    if (!isError) {
      this.visible = true;
    } else {
      this.errVisible = true;
    }

    // Automatically hide the snack bar after the specified duration
    if (duration > 0) {
      this.hideTimeout = setTimeout(() => {
        this.hide();
      }, duration);
    }
  }

  hide(): void {
    this.visible = false;
    this.errVisible = false;

    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
    }
  }
}
