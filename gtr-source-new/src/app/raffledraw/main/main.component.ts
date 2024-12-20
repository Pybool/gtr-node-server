import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';
import { AuthService } from 'src/app/_service/auth.service';
import { RaffleDrawService } from 'src/app/_service/raffledraw.service';
import { SnackBarService } from 'src/app/_service/snackbar.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { countryDialCodes, normalizePhoneNumber } from './helper';
import { TokenService } from 'src/app/_service/token.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  public disable: boolean = true;
  public showLogin: boolean = false;
  public raffleDraw: any = null;
  
  public user: any = null;
  public showPhoneInput: boolean = false;
  public rafflePayload: { qty: number; phone: string | null } = {
    qty: 1,
    phone: '',
  };
  public showPaymentOptionsModal: boolean = false;
  public buySpinner: boolean = false;
  endDate = new Date();
  days: any = 0;
  hours: any = '00';
  minutes: any = '00';
  seconds: any = '00';
  private countdownInterval: any;
  public ticketAmount: number = 0.0;
  phoneErrorMessage:string | null = null;
  emailErrorMessage:string | null = null;
  public userActiveRaffleTickets:any[] = []
  selectedCountry: { name: string; dial_code: string; code: string } = {
    name: 'Ghana',
    dial_code: '+233',
    code: 'GH',
  };
  serverUrl: string = environment.nodeApi;

  countryCodeMap = {
    "+233":{
      name: 'Ghana',
      dial_code: '+233',
      code: 'GH',
    },
    "+234":{
      name: 'Nigeria',
      dial_code: '+234',
      code: 'NG',
    },
    "+1":{
      name: 'United States',
      dial_code: '+1',
      code: 'US',
    },
    "+44":{
      name: 'United Kingdom',
      dial_code: '+44',
      code: 'UK',
    }

  }

  constructor(
    private authService: AuthService,
    private raffleDrawService: RaffleDrawService,
    private snackBarService: SnackBarService,
    private tokenService: TokenService
  ) {}

  ngOnInit(): void {
    this.user = this.authService.retrieveUser() || null;
    console.log(this.user)
    this.selectedCountry.dial_code = window.localStorage.getItem('rf-dialcode')
    try{
      console.log(this.selectedCountry.dial_code)
      if(this.countryCodeMap[this.selectedCountry.dial_code]){
        this.selectedCountry = this.countryCodeMap[this.selectedCountry.dial_code]
      }
    }catch{}
    
    this.rafflePayload.phone = window.localStorage.getItem('rf-tel')
    this.raffleDrawService
      .getActiveRaffleDraw(this.rafflePayload.phone)
      .pipe(take(1))
      .subscribe(
        (response: any) => {
          if (response.status) {
            this.raffleDraw = response.data;
            response.userActiveRaffleTickets.forEach((entry:any)=>{
              this.userActiveRaffleTickets.push(...entry.ticketNumbers)
            })

            this.endDate = new Date(this.raffleDraw?.raffleEndDate);
            if(this.raffleDraw){
              this.startCountdown();
            }
          }
        },
        (error: any) => {
          this.snackBarService.show("Something went wrong...", true);
        }
      );
  }

  getBannerImage(banner:string): string {
    return banner ? this.serverUrl + banner.replace('public', '') : '';
  }

  startCountdown(): void {
    this.updateCountdown(); // Immediately calculate the remaining time

    // Update every second
    this.countdownInterval = setInterval(() => {
      this.updateCountdown();
    }, 1000);
  }

  updateCountdown(): void {
    const now = new Date().getTime();
    const distance = this.endDate.getTime() - now;

    if (distance <= 0) {
      clearInterval(this.countdownInterval); // Stop the countdown when the target is reached
      this.days = this.hours = this.minutes = this.seconds = 0;
    } else {
      this.days = Math.floor(distance / (1000 * 60 * 60 * 24));
      this.hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      this.minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      this.seconds = Math.floor((distance % (1000 * 60)) / 1000);
    }

  }

  // userActiveRaffleTickets

  getRemainingTime(){
    const total =  this.days + this.hours + this.minutes + this.seconds
    if(total==0){
      this.raffleDraw = null
    }
    return total
  }

  calculatePercent() {
    const percent = `${
      (this.raffleDraw.ticketSold / this.raffleDraw.maxEntries) * 100
    }%`;
    const bar = document.querySelector('.bar') as any;
    if (bar) {
      bar.style.width = percent;
    }
    return percent;
  }

  toggleLoginModal() {
    this.showLogin = !this.showLogin;
  }

  scrollToId(id:string){
    const rules = document.getElementById(id) as any
    if(rules){
      rules.scrollIntoView({ behavior: "smooth" })
    }
  }

  updateQty(inc: number | null = null) {
    if (inc) {
      if (inc.toString().includes('-') && this.rafflePayload.qty == 1) {
        return null;
      }

      if (
        inc.toString().includes('-') == false &&
        this.rafflePayload.qty >= this.raffleDraw.maxTicket
      ) {
        return null;
      }

      this.rafflePayload.qty += inc;
    }

    if (this.rafflePayload.qty > this.raffleDraw.maxTicket) {
      this.rafflePayload.qty = this.raffleDraw.maxTicket;
    }

    if (this.rafflePayload.qty < 1 && this.rafflePayload.qty !== null) {
      this.rafflePayload.qty = 1;
    }
  }

  handleCountrySelected($event: any) {
    this.selectedCountry = $event;
    this.isValidPhone();
    console.log(this.selectedCountry)
  }

  isValidPhone($event: any = null) {
    const isValidPhone = this.authService.validatePhoneNumber(
      `${this.selectedCountry.dial_code}${this.rafflePayload.phone}`,
      this.selectedCountry.code
    );
    this.disable = !isValidPhone;
    if(this.disable && this.rafflePayload.phone.length> 0){
      this.phoneErrorMessage = "Phone number is not valid for selected area code"
    }else{
      this.phoneErrorMessage = null
    }
  }

  togglePaymentOptionsModal() {
    if (!this.user && this.rafflePayload.phone == '') {
      this.showPhoneInput = true;
      return;
    }
    this.buySpinner = true;
    this.rafflePayload.phone = normalizePhoneNumber(this.selectedCountry.code, this.rafflePayload.phone || this.user?.phone);
    window.localStorage.setItem('rf-dialcode', this.selectedCountry.dial_code)
    window.localStorage.setItem('rf-tel', this.rafflePayload.phone)
    this.raffleDrawService
      .checkTicketsAvailability({ qty: this.rafflePayload.qty })
      .pipe(take(1))
      .subscribe(
        (response: any) => {
          this.buySpinner = false;
          if (response.status) {
            this.ticketAmount =
              this.rafflePayload.qty * this.raffleDraw.ticketPrice;
            this.showPaymentOptionsModal = !this.showPaymentOptionsModal;
            return;
          } else {
            this.buySpinner = false;
            this.snackBarService.show(response.message)
          }
        },
        (error: any) => {
          Swal.fire('Payment modal failed to initialize');
        }
      );
  }

  logout() {
    this.tokenService.logout()
    this.authService.logout(false);
    window.localStorage.removeItem('rf-dialcode')
    window.localStorage.removeItem('rf-tel')
    // document.location.href='/raffledraws/login'
  }
}
