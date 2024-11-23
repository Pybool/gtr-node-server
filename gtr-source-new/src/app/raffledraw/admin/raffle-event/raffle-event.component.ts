import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { pipe } from 'rxjs';
import { take } from 'rxjs/operators';
import { AuthService } from 'src/app/_service/auth.service';
import { RaffleDrawService } from 'src/app/_service/raffledraw.service';
import { SnackBarService } from 'src/app/_service/snackbar.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-raffle-event',
  templateUrl: './raffle-event.component.html',
  styleUrls: ['./raffle-event.component.scss'],
})
export class RaffleEventComponent implements OnInit {
  selectedFile: File | null = null;
  fileName: string | null = null;
  uploadError: string | null = null;
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
    useCompetitionDetailsAsDefault: false,
    prizes: [],
    bannerUrl : `${environment.frontendUrl}/assets/images/raffle-ad.png`
  };
  public activeRaffleDraw:any;
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
  public raffleDrawBannerId: string = "";
  public user: any = {};
  public serverUrl: string = environment.nodeApi;

  constructor(
    private renderer: Renderer2,
    private el: ElementRef,
    private raffleDrawService: RaffleDrawService,
    private snackBarService: SnackBarService,
    private http: HttpClient,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.getRaffleDraws();
    this.user = this.authService.retrieveUser();
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
        (error: any) => {
          this.snackBarService.show("Failed to fetch raffle events at this time, try again later", true)
        }
      );
  }

  showModal = false; // Controls modal visibility

  // Open the modal
  openModal() {
    this.showModal = true;
  }

  // Close the modal
  closeModal() {
    this.showModal = false;
  }

  private getObjectById(array: any, id: string | undefined) {
    return array.find((item: any) => item.id === id);
  }


  async createRaffleDraw(): Promise<void> {
    if (this.attachments) {
      const formData = new FormData();
      formData.append('data', JSON.stringify(this.raffleDraw));
      for (let i = 0; i < this.attachments.length; i++) {
        formData.append('attachments', this.attachments[i]);
      }

      this.raffleDrawService
        .createRaffleDraw(formData)
        .pipe(take(1))
        .subscribe(
          (response: any) => {
            Swal.fire(response.message);
            if (response.status) {
              this.raffleDraws.unshift(response.data);
            }
          },
          (error: any) => {
            alert('Something went wrong');
          }
        );
    } else {
      alert('Please select some images');
    }
  }

  suspendRaffleDraw(raffleDraw:any){
    const id:string = raffleDraw?._id
    this.raffleDrawService.suspendRaffleDraw(id).pipe(take(1)).subscribe((response:any)=>{
      if(response.status){
        this.snackBarService.show(response.message)
        setTimeout(()=>{
          document.location.reload()
        },1000)
      }else{
        this.snackBarService.show(response.message, true)
      }
    },(error:any)=>{
      this.snackBarService.show("Failed to suspend raffle draw", true)
    })
  }

  addCompetitionDetail() {
    // Create a new div to hold the input and remove button
    const detailDiv = this.renderer.createElement('div');
    detailDiv.classList.add('detail-input');
    detailDiv.classList.add('flex-row-sb');

    // Create a new input element
    const input = this.renderer.createElement('input');
    this.renderer.setAttribute(input, 'type', 'text');
    this.renderer.setAttribute(input, 'placeholder', 'Message');
    this.renderer.setAttribute(input, 'required', 'true');

    // Add input value to the competition details array
    const index = this.raffleDraw.competitionDetails.length;
    input.value = '';
    this.renderer.listen(input, 'input', (event: any) => {
      this.raffleDraw.competitionDetails[index] = {
        message: event.target.value,
      };
    });

    // Create a remove button
    const removeButton = this.renderer.createElement('button');
    const removeButtonText = this.renderer.createText('Remove');
    this.renderer.appendChild(removeButton, removeButtonText);
    this.renderer.addClass(removeButton, 'btn');
    this.renderer.addClass(removeButton, 'btn-danger');
    this.renderer.listen(removeButton, 'click', () => {
      this.removeCompetitionDetail(detailDiv, index);
    });

    // Append input and button to the div
    this.renderer.appendChild(detailDiv, input);
    this.renderer.appendChild(detailDiv, removeButton);

    // Append the div to the container
    const container = this.el.nativeElement.querySelector(
      '#competitionDetailsContainer'
    );
    this.renderer.appendChild(container, detailDiv);

    // Add a new entry to competition details array
    this.raffleDraw.competitionDetails.push({ message: '' });
  }

  removeCompetitionDetail(detailDiv: HTMLElement, index: number) {
    // Remove the element from DOM
    this.renderer.removeChild(
      this.el.nativeElement.querySelector('#competitionDetailsContainer'),
      detailDiv
    );

    // Remove the corresponding item from competition details array
    this.raffleDraw.competitionDetails.splice(index, 1);
  }

  // Submit the form
  createRaffle() {
    console.log('Raffle Details:', this.raffleDraw);
    if(this.raffleDraw.prizes.length !== this.raffleDraw.maxWinners){
      return this.snackBarService.show("The selected prizes do not cater for the number of winners", true)
    }
    this.showSpinner = true;
    this.raffleDrawService
      .createRaffleDraw(this.raffleDraw)
      .pipe(take(1))
      .subscribe(
        (response: any) => {
          this.showSpinner = false;
          this.snackBarService.show(response.message, false)
          if (response.status) {
            this.raffleDraws.unshift(response.data);
            this.closeModal(); // Close the modal after submission
          }
        },
        (error: any) => {
          this.showSpinner = false;
          this.snackBarService.show("Something went wrong at this time, try again later", true)
        }
      );
  }

  formatDate(dateStr:string) {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  }

  selectRaffleDrawWinners(){
    this.raffleDrawService.closeRaffleDraw().pipe(take(1)).subscribe((response:any)=>{
      if(response.status){
        this.activeRaffleDraw  = response.data;
        this.snackBarService.show(response.message, false)
        // document.location.reload()
      }
    },(error:any)=>{

    })
  }

  confirmRaffleDrawWinnersGenerate(raffleDraw:any){
    this.activeRaffleDraw = raffleDraw;
    const confirmAction = confirm("Are you sure you want to select winners now? This action will end the raffle draw immediately");
    if(confirmAction){
      this.selectRaffleDrawWinners()
    }
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
            for(let raffleDraw of response.data){
              raffleDraw.bannerUrl = this.getBannerImage(raffleDraw.bannerUrl);
            }
            
            this.raffleDraws.push(...response.data);
            console.log(this.raffleDraws)
          }
        },
        (error: any) => { 
          this.showSpinner = false;
        }
      );
  }

  alertComingSoon(){
    this.snackBarService.show("This feature is not yet implemented...")
  }

  getBannerImage(banner:string): string {
    return banner ? this.serverUrl + banner.replace('public', '') : '';
  }

  onSelectionChange($event: any) {
    console.log($event);
    if (
      $event.id?.trim() !== '' &&
      !this.getObjectById(this.selectedPrizes, $event.id)
    ) {
      this.selectedPrizes.push($event);
      this.raffleDraw.prizes = this.selectedPrizes;
    }
  }

  removePrize(i: number) {
    this.selectedPrizes.splice(i, 1);
    this.raffleDraw.prizes = this.selectedPrizes;
  }

  onFileChange(event: any) {
    this.selectedFile = event.target.files[0];
    this.fileName = this.selectedFile!.name;
    this.uploadError = null; // Clear any previous errors
    if (event.target.files && this.selectedFile) {
      const file = event.target.files[0];
      const reader = new FileReader();
      
      // Convert file to base64 string
      reader.onload = () => {
        this.activeRaffleDraw.bannerUrl = reader.result as string; // Set the src as the base64 encoded image
        this.uploadRaffleBanner()
      };
      
      reader.readAsDataURL(file);
      // this.selectedImageSrc = URL.createObjectURL(file); // Create a temporary URL for the selected image
    }
  }

  selectFile(activeRaffleDraw:any) {
    this.activeRaffleDraw = activeRaffleDraw;
    const fileChooser: any = document.querySelector('.upload-receipt'); // Target file input specifically
    fileChooser?.click();
  }

  changeFile() {
    this.selectedFile = null;
    this.fileName = null;
    this.uploadError = null; // Clear any previous errors
  }

  uploadRaffleBanner() {
    if (!this.selectedFile) {
      this.uploadError = 'Please select a file and enter your payment ref.';
      return;
    }

    const formData = new FormData();
    formData.append('attachments', this.selectedFile);
    formData.append('raffleDrawId', this.activeRaffleDraw._id);

    try {
      this.http
        .post<any>(
          `${environment.nodeApi}/api/v1/admin/raffle/change-raffle-banner`, // Replace with your actual upload endpoint
          formData,
          { headers: this.raffleDrawService.getHeaders() }
        )
        .pipe(take(1))
        .subscribe((response: any) => {
          // Handle successful upload response (e.g., display success message)
          this.snackBarService.show(response?.message);
          this.selectedFile = null;
          this.fileName = null;
          if(!response.status){
            this.activeRaffleDraw.banner = null;
          }
          setTimeout(()=>{
            this.snackBarService.hide();
          },3000)
        },(error:any)=>{
          this.activeRaffleDraw.banner = null;
          this.uploadError = 'An error occurred during upload. Please try again.';
          console.log('Upload error:', error.status);
          if(error.status===413){
            this.uploadError = 'File too large , try using an images less than 1MB';
          }
          this.snackBarService.show(this.uploadError, true);
        });
    } catch (error) {
      console.error('Upload error:', error);
      this.activeRaffleDraw.banner = null;
      this.uploadError = 'An error occurred during upload. Please try again.';
      this.snackBarService.show(this.uploadError, true);
    }
  }

  logout() {
    this.authService.logout(false);
    document.location.href='/raffledraws/login'
  }
}
