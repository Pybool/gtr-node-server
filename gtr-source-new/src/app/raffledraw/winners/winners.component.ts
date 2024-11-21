import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { take } from 'rxjs/operators';
import { AuthService } from 'src/app/_service/auth.service';
import { RaffleDrawService } from 'src/app/_service/raffledraw.service';
import { SnackBarService } from 'src/app/_service/snackbar.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-winners',
  templateUrl: './winners.component.html',
  styleUrls: ['./winners.component.scss'],
})
export class WinnersComponent implements OnInit {
  public raffleDraw: any = {
    raffleEndDate: null,
    raffleName: '',
    maxEntries: 0,
    contestCode: '',
    ticketSold: 0,
    ticketPrice: 0.0,
    maxTicket: 0,
    maxWinners: 7,
    description: '',
    competitionDetails: [],
    prizes: [],
  };
  public activeRaffleDraw: any;
  public raffleDraws: any[] = [];
  public prizes: {
    name?: string;
    description?: string;
    image?: string;
    createdAt?: Date;
    _id?: string | any;
  }[] = [];
  public flatPrizes: { id: string; value: any }[] = [];
  public attachments: FileList | null = null;
  public selectedPrizes: { id: string; value: any }[] = [];
  public showSpinner: boolean = false;
  public serverUrl: string = environment.nodeApi;
  public contestCodeToSearch: string = '';
  public searchResult: string = '';
  public user: any = {};
  endDate: Date;

  constructor(
    private authService: AuthService,
    private raffleDrawService: RaffleDrawService,
    private snackBarService: SnackBarService
  ) {
    this.raffleDrawService
      .getActiveRaffleDraw()
      .pipe(take(1))
      .subscribe(
        (response: any) => {
          if (response.status) {
            this.raffleDraw = response.data;
            this.endDate = new Date(this.raffleDraw?.raffleEndDate);
          }
        },
        (error: any) => {
          this.snackBarService.show("Something went wrong...", true);
        }
      );
  }

  getPrizeImage(prize: any): string {
    return prize?.image
      ? this.serverUrl + prize.image.replace('public', '')
      : '';
  }

  ngAfterViewInit(){
    const aside = document.querySelector(".aside");
    const container = document.querySelector("._container");
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          aside.classList.add("stopped");
        } else {
          aside.classList.remove("stopped");
        }
      },
      {
        root: null, // Observe in the viewport
        threshold: 1.0,
      }
    );
    
    observer.observe(container);
    
  }

  ngOnInit(): void {
    this.getRaffleDraws();
    this.user = this.authService.retrieveUser() || null;
    this.raffleDrawService
      .fetchPrizes()
      .pipe(take(1))
      .subscribe(
        (response: any) => {
          if (response.status) {
            this.prizes = response.data;
            console.log(this.prizes);
            for (let prize of this.prizes) {
              this.flatPrizes.push({ id: prize._id, value: prize.name });
            }
          }
        },
        (error: any) => {}
      );
  }

  formatDate(dateStr: string) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  alertComingSoon() {
    this.snackBarService.show('This feature is not yet implemented...');
  }

  getRaffleDraws() {
    this.showSpinner = true;
    this.raffleDrawService
      .fecthRaffleDraws()
      .pipe(take(1))
      .subscribe(
        (response: any) => {
          this.showSpinner = false;
          if (response.status) {
            this.raffleDraws.push(...response.data);
          }
        },
        (error: any) => {
          this.showSpinner = false;
          this.snackBarService.show('Failed to fetch raffle draws');
        }
      );
  }

  searchTicketsWins() {
    this.showSpinner = true
    const payload = {
      contestCode: this.contestCodeToSearch,
      tickets: [],
      phone: window.localStorage.getItem('rf-tel')
    };
    const ticketNos = document.querySelectorAll('.ticketNo') as any;
    for (let ticket of ticketNos) {
      payload.tickets.push(ticket.value);
    }
    this.raffleDrawService
      .searchTicketsWins(payload)
      .pipe(take(1))
      .subscribe((response: any) => {
        console.log(response)
        this.showSpinner = false
        this.searchResult = response.message;
        this.snackBarService.show(response.message);
      },(error)=>{
        this.showSpinner = false
        this.snackBarService.show("Sorry an error occured , please try again later!", true);
      });
  }

  scrollToId(id:string){
    const rules = document.getElementById(id) as any
    if(rules){
      rules.scrollIntoView({ behavior: "smooth" })
    }
  }

  getBannerImage(banner: string): string {
    return banner ? this.serverUrl + banner.replace('public', '') : '';
  }

  
  logout() {
    this.authService.logout(false);
    document.location.href='/raffledraws/login'
  }

}
