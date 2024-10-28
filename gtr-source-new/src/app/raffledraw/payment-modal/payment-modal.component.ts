import { Component, EventEmitter, Input, Output } from '@angular/core';
import { take } from 'rxjs/operators';
import { PaystackService } from 'src/app/_service/paystack.service';
import { SnackBarService } from 'src/app/_service/snackbar.service';
import { TransactionService } from 'src/app/_service/transaction.service';
declare var PaystackPop: any; // Declare Paystack global variable

@Component({
  selector: 'app-payment-modal',
  templateUrl: './payment-modal.component.html',
  styleUrls: ['./payment-modal.component.scss'],
})
export class PaymentModalComponent {
  @Input() user: any = null;
  @Input() amount: any = 0.0;
  @Input() qty: number = 0;
  @Input() phone: string | null = null;
  channels: string[] = ['mobile_money', 'card']
  @Output() closeModal: EventEmitter<void> = new EventEmitter<void>();

  constructor(
    private paystackService: PaystackService,
    private transactionService: TransactionService,
    private snackBarService: SnackBarService
  ) {}

  // Opay Payment Function
  initiateOpayPayment() {
    console.log('Opay payment initiated');
    // Replace with Opay payment API integration logic
    window.open('https://opayweb.com/some-endpoint', '_blank');
  }

  selectPaymentMethod(method:string){
    this.channels = [method]
  }

  initiatePaystackPayment(amount: number, email: string) {
    if (!this.user && !this.phone) {
      this.snackBarService.show(
        'We cannot identify you at the moment, try to login or enter you phone number',
        true,
        0
      );
    }
    return new Promise((resolve, reject) => {
      this.paystackService.initiatePayment(amount, email, this.channels, (response) => {
        if (response.status === 'success') {
          resolve(this.verifyTransaction(response.reference));
        } else {
          reject(this.verifyTransaction(response.reference));
        }
      });
    });
  }

  verifyTransaction(reference: string) {
    this.transactionService.verifyTransaction(reference, (paymentResponse) => {
      setTimeout(() => {
        if (paymentResponse.data.status == 'success') {
          const payload = {
            transactionData: { reference, paymentResponse },
            raffleData: { userId: this.user?._id, phone: this.user?.phone || this.phone, qty: this.qty },
          };
          this.transactionService
            .saveTransaction(payload)
            .pipe(take(1))
            .subscribe((response: any) => {
              if (response.status) {
                this.snackBarService.show(response.message);
                setTimeout(()=>{
                  document.location.reload()
                },2000)
              } else {
                this.snackBarService.show(response.message,true);
              }
            },(error:any)=>{
              this.snackBarService.show("Something went wrong...");
            });
        }
      }, 1000);
    });
  }

  checkOut() {
    this.initiatePaystackPayment(
      Math.ceil(Number(this.amount)),
      this.user?.email || `customer${this.user?.phone || this.phone}@gtr.com`
    );
  }

  onCloseModal() {
    this.closeModal.emit(); // Emit the event
  }
}
