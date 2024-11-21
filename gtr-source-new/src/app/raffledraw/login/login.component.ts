import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { initialize } from './script';
import { AuthService } from 'src/app/_service/auth.service';
import { take } from 'rxjs/operators';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OtpInputComponent } from '../otp-input/otp-input.component';
import { CountrySelectComponent } from '../country-select/country-select.component';
import { WhiteLoaderComponent } from '../loader/loader.component';
import { SnackBarService } from 'src/app/_service/snackbar.service';
var self: any;
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passwordPattern =
  /^(?=.*[A-Z].*[A-Z])(?=.*[a-z].*[a-z].*[a-z])(?=.*[!@#$%^&*])(?=.*[0-9].*[0-9]).{8,}$/;

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    OtpInputComponent,
    WhiteLoaderComponent,
    CountrySelectComponent,
  ],
})
export class LoginComponent implements OnInit {
  activeTab: string = 'signin';
  passwordAgain: string = '';
  accepted = false;
  opacity = 0.5;
  pointerType = 'none';
  showtermsAndConditions = false;
  showSpinner = false;
  showRegSpinner = false;
  isDirtyPassword = false;
  isDirtyEmail = false;
  activeLogin = false;
  activeSendOtp = true;
  credentials: { email: string; password: string } = {
    email: '',
    password: '',
  };
  data: any = '';
  showOtp: boolean = false;
  authenticationMethod: string = 'mobile';
  phone: string = '';
  disable: boolean = true;
  showSubmit: boolean = false;
  timeLeft: any = 30;
  phoneErrorMessage: string | null = null;
  emailErrorMessage: string | null = null;
  otpText: string = 'Resend Code';
  called = false;
  hasRequestedOtpEarlier = false;
  showResendSpinner = false;
  selectedCountry: { name: string; dial_code: string; code: string } = {
    name: 'Ghana',
    dial_code: '+233',
    code: 'GH',
  };
  public isDefaultActive: boolean = true;
  // Declare the output event
  @Output() closeModal: EventEmitter<void> = new EventEmitter<void>();

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBarService: SnackBarService
  ) {
    self = this;
  }

  ngOnInit() {}

  toggleDefault() {
    this.isDefaultActive = !this.isDefaultActive;
  }

  onCloseModal() {
    this.closeModal.emit(); // Emit the event
  }

  toggleAuthMethod() {
    this.showOtp = false;
    this.showSubmit = false;
  }

  onDataChange(newValue: string, type: string = 'phone') {
    this.data = newValue;
    if (newValue.length === 4) {
      this.disable = false;
      if (!this.called) {
        this.callFunction(type);
        this.called = true;
      }
    }
  }

  callFunction(type: string) {
    if (type === 'phone') {
      this.phoneNumberLogin();
    } else {
      this.emailLogin();
    }
  }

  handleCountrySelected($event: any) {
    this.selectedCountry = $event;
    this.isValidPhone();
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
    document.location.hash = `#${tab}`;
  }

  ngAfterViewInit() {
    initialize();
    const pageLoader = document.querySelector(
      '.loader-container'
    ) as HTMLElement;
    setTimeout(() => {
      pageLoader.style.display = 'none';
    }, 100);
    this.isValidPhone();
    this.activeSendOtp = !this.validateEmail(this.credentials.email);
  }

  moveBackground(event: MouseEvent): void {
    const amountMovedX = (event.pageX * -1) / 30;
    const amountMovedY = (event.pageY * -1) / 9;
    const backgroundPosition = `${amountMovedX}px ${amountMovedY}px`;

    // Use Angular Renderer to modify DOM properties
    const bgElement = document.querySelector('.container .bg') as HTMLElement;
    bgElement.style.backgroundPosition = backgroundPosition;
  }

  login() {
    this.showSpinner = true;
    this.authService
      .login(this.credentials)
      .pipe(take(1))
      .subscribe(
        (response: any) => {
          if (response.status) {
            this.showSpinner = false;
            this.authService.storeTokens(response);
            this.authService.storeUser(response.data);
            this.authService.setLoggedIn(true);
            setTimeout(() => {
              const urlParams = new URLSearchParams(window.location.search);
              const returnUrl = urlParams.get('next');
              if (returnUrl) {
                window.location.href = decodeURIComponent(returnUrl);
              } else {
                window.location.href = '/'; // Default to home page
              }
            }, 500);
          } else {
            if (response.code == 1001) {
              const queryParams = { account_id: response.data };
              this.router.navigate(['account-verification'], { queryParams });
            }
            this.showSpinner = false;
            Swal.fire({
              position: 'top-end',
              icon: 'warning',
              title: `Login Failed`,
              text: response.message,
              showConfirmButton: false,
              timer: 1500,
            });
          }
        },
        (error: any) => {
          this.showSpinner = false;
          Swal.fire({
            position: 'top-end',
            icon: 'error',
            title: `Login eror`,
            text: 'Something went wrong',
            showConfirmButton: false,
            timer: 1500,
          });
        }
      );
  }

  phoneNumberSendOtp(resend: boolean = false, otpLinkTextEl: any = null) {
    if (resend) {
      this.showResendSpinner = true;
    }
    const dialCode = this.selectedCountry.dial_code;
    const countryCode = this.selectedCountry.code;
    this.authService
      .phoneNumberSendOtp({
        countryCode: countryCode,
        dialCode: dialCode,
        phone: this.phone,
        messageType: 'LOGIN',
      })
      .pipe(take(1))
      .subscribe(
        (response: any) => {
          this.hasRequestedOtpEarlier = true;
          if (response.status) {
            this.snackBarService.show(response?.message);
            this.showSubmit = true;
            if (response?.testotp) {
              alert(
                `Welcome to GTR Raffle your otp is ${response.testotp}. \nPlease do not share this code with anyone.`
              );
            }
            this.countDownOtp();
          } else {
            this.showSpinner = false;
            this.snackBarService.show(response?.message, true);
            if (resend) {
              if (otpLinkTextEl) {
                otpLinkTextEl.style.color = 'orange';
                otpLinkTextEl.style.pointerEvents = 'auto';
              }
            }
          }

          this.showResendSpinner = false;
        },
        (error: any) => {
          this.countDownOtp();
          this.showResendSpinner = false;
          this.showSpinner = false;
          this.hasRequestedOtpEarlier = true;
          this.snackBarService.show('Something went wrong', true)
      
          if (resend) {
            if (otpLinkTextEl) {
              otpLinkTextEl.style.color = 'orange';
              otpLinkTextEl.style.pointerEvents = 'auto';
            }
          }
        }
      );
  }

  emailSendOtp(resend: boolean = false, otpLinkTextEl: any = null) {
    if (resend) {
      this.showResendSpinner = true;
    }
    this.authService
      .emailSendOtp({ email: this.credentials.email, messageType: 'LOGIN' })
      .pipe(take(1))
      .subscribe(
        (response: any) => {
          this.hasRequestedOtpEarlier = true;
          if (response.status) {
            this.showSubmit = true;
          } else {
            this.showSpinner = false;
            this.snackBarService.show(response.message, true)
            if (resend) {
              if (otpLinkTextEl) {
                otpLinkTextEl.style.color = 'orange';
                otpLinkTextEl.style.pointerEvents = 'auto';
              }
            }
          }
          this.countDownOtp();
          this.showResendSpinner = false;
        },
        (error: any) => {
          this.countDownOtp();
          this.showResendSpinner = false;
          this.showSpinner = false;
          this.hasRequestedOtpEarlier = true;
          this.snackBarService.show('Something went wrong', true)
          if (resend) {
            if (otpLinkTextEl) {
              otpLinkTextEl.style.color = 'orange';
              otpLinkTextEl.style.pointerEvents = 'auto';
            }
          }
        }
      );
  }

  phoneNumberLogin() {
    this.showSpinner = true;
    const dialCode = this.selectedCountry.dial_code;
    const countryCode = this.selectedCountry.code;
    this.authService
      .phoneNumberLogin({
        dialCode: dialCode,
        countryCode: countryCode,
        phone: this.phone,
        otp: this.data,
      })
      .pipe(take(1))
      .subscribe(
        (response: any) => {
          if (response.status) {
            this.showSpinner = false;
            this.authService.storeTokens(response);
            this.authService.storeUser(response.data);
            this.authService.setLoggedIn(true);
            setTimeout(() => {
              const urlParams = new URLSearchParams(window.location.search);
              const returnUrl = urlParams.get('next');
              if (returnUrl) {
                window.location.href = decodeURIComponent(returnUrl);
              } else {
                window.location.href = '/raffledraws/play'; // Default to home page
              }
            }, 500);
          } else {
            this.showSpinner = false;
            this.snackBarService.show(response?.message, true)
            
          }
        },
        (error: any) => {
          this.showSpinner = false;
          this.snackBarService.show('Something went wrong', true);
        }
      );
  }

  emailLogin() {
    this.showSpinner = true;
    this.authService
      .emailLogin({ email: this.credentials.email, otp: this.data })
      .pipe(take(1))
      .subscribe(
        (response: any) => {
          if (response.status) {
            this.showSpinner = false;
            this.authService.storeTokens(response);
            this.authService.storeUser(response.data);
            this.authService.setLoggedIn(true);
            setTimeout(() => {
              const urlParams = new URLSearchParams(window.location.search);
              const returnUrl = urlParams.get('next');
              if (returnUrl) {
                window.location.href = decodeURIComponent(returnUrl);
              } else {
                window.location.href = '/raffledraws/play'; // Default to home page
              }
            }, 500);
          } else {
            this.showSpinner = false;
            this.snackBarService.show('Authentication failed, try again', true)
          }
        },
        (error: any) => {
          this.showSpinner = false;
          this.snackBarService.show('Something went wrong', true);
        }
      );
  }

  isValidPhone($event: any = null) {
    const isValidPhone = this.authService.validatePhoneNumber(
      `${this.selectedCountry.dial_code}${this.phone}`,
      this.selectedCountry.code
    );
    this.disable = !isValidPhone;
    if (this.disable && this.phone.length > 0) {
      this.phoneErrorMessage =
        'Phone number is not valid for selected area code';
    } else {
      this.phoneErrorMessage = null;
    }
  }

  validateEmail(email: string) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  }

  isInvalidEmail(credentials: any) {
    try {
      if (credentials.email.trim().length > 0) {
        if (!emailRegex.test(credentials.email)) {
          return true;
        } else {
          return false;
        }
      }
      this.activeSendOtp = true;
      return true;
    } catch {
      return false;
    }
  }

  isInvalidPassword() {
    try {
      if (this.credentials.password.trim().length > 0) {
        if (!passwordPattern.test(this.credentials.password)) {
          return true;
        } else {
          return false;
        }
      }
      return false;
    } catch {
      return false;
    }
  }

  checkValidmail() {
    this.enableSendOtpButton();
  }

  enableSendOtpButton() {
    this.activeSendOtp = this.isInvalidEmail(this.credentials);
    if (this.activeSendOtp) {
      this.emailErrorMessage = 'This email address is not valid';
    } else {
      this.emailErrorMessage = null;
    }
  }

  isPasswordMatch() {
    if (this.passwordAgain.trim() == '' && this.isDirtyPassword) {
      return true;
    }
    try {
      if (this.passwordAgain != this.credentials.password) {
        this.accepted = false;
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  dirtyPassword() {
    if (!this.isDirtyPassword) this.isDirtyPassword = true;
    if (
      this.accepted &&
      !this.isPasswordMatch() &&
      !this.isInvalidEmail(this.credentials)
    ) {
      this.opacity = 1;
      this.pointerType = 'pointer';
      return;
    }
    this.opacity = 0.5;
    this.pointerType = 'none';
  }

  resendCode(type: string) {
    this.data = '';
    const otpLinkTextEl = document.querySelector(
      '.otp-link-text'
    ) as HTMLElement;
    otpLinkTextEl.style.color = 'gray';
    otpLinkTextEl.style.pointerEvents = 'none';
    otpLinkTextEl.setAttribute('disabled', 'true');
    this.showResendSpinner = true;
    if (type === 'phone') {
      return this.phoneNumberSendOtp(true, otpLinkTextEl);
    }

    return this.emailSendOtp(true, otpLinkTextEl);
  }

  countDownOtp() {
    const intervalId = setInterval(() => {
      const otpLinkTextEl = document.querySelector(
        '.otp-link-text'
      ) as HTMLElement;
      console.log('Tmeleft ', this.timeLeft);
      if (this.timeLeft > 0) {
        this.timeLeft -= 1; // Concise decrement

        otpLinkTextEl.style.color = 'gray';
        otpLinkTextEl.style.pointerEvents = 'none';
        otpLinkTextEl.setAttribute('disabled', 'true');
        this.otpText = `Resend Code in ${this.timeLeft} seconds`;
      } else {
        otpLinkTextEl.style.color = 'orange';
        otpLinkTextEl.style.pointerEvents = 'auto';
        this.otpText = `Resend Code`;
        otpLinkTextEl.setAttribute('disabled', 'false');
        clearInterval(intervalId);
        this.timeLeft = 30;
      }
    }, 1000);
  }
}
