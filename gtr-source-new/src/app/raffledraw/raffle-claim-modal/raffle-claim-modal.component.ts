import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-raffle-claim-modal',
  templateUrl: './raffle-claim-modal.component.html',
  styleUrls: ['./raffle-claim-modal.component.scss'],
})
export class RaffleClaimModalComponent {
  isOpen = false;

  @Output() modalClose = new EventEmitter<void>();

  openModal(): void {
    this.isOpen = true;
  }

  closeModal(): void {
    this.isOpen = false;
    this.modalClose.emit(); // Notify parent component if necessary
  }
}
