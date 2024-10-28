import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';
import { AuthService } from 'src/app/_service/auth.service';
import { RaffleDrawService } from 'src/app/_service/raffledraw.service';
import { SnackBarService } from 'src/app/_service/snackbar.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-prizes',
  templateUrl: './prizes.component.html',
  styleUrls: ['./prizes.component.scss'],
})
export class PrizesComponent implements OnInit {
  public user: any = {};
  public home: any = {};
  public banner: string = '';
  public attachments: FileList | null = null;
  public prize: any = { name: '', description: '' };
  public serverUrl: string = environment.nodeApi;
  public prizes: any[] = [];
  public showModal = false;

  constructor(
    private raffleDrawService: RaffleDrawService,
    private snackBarService: SnackBarService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.user = this.authService.retrieveUser();
    this.raffleDrawService
      .fetchPrizes()
      .pipe(take(1))
      .subscribe(
        (response: any) => {
          if (response.status) {
            this.prizes = response.data;
          }
        },
        (error:any) => {
          this.snackBarService.show('Failed to retrieve prizes', true);
        }
      );
  }

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  onFileChange(event: any): void {
    this.attachments = event.target.files;
  }

  private getObjectById(array: any, id: string | undefined) {
    return array.find((item: { _id: string }) => item._id === id);
  }

  // private to remove an object by _id
  private removeObjectById(array: any, id: string | undefined) {
    const index = array.findIndex((item: { _id: string }) => item._id === id);
    if (index !== -1) {
      array.splice(index, 1);
    }
    return array;
  }

  chooseBackground() {
    const avatarFile = document.querySelector('.avatar-file') as any;
    avatarFile?.click();
  }

  alertComingSoon(){
    this.snackBarService.show("This feature is not yet implemented...");
  }

  createPrize() {
    const formData = new FormData();
    if (this.attachments) {
      const firstFile = this.attachments![0];
      formData.append('data', JSON.stringify(this.prize));
      formData.append('attachments', firstFile);
    }

    this.raffleDrawService
      .createPrize(formData)
      .pipe(take(1))
      .subscribe(
        (response: any) => {
          this.snackBarService.show(response.message, false);
          if (response.status) {
            this.prizes.unshift(response.data);
          }
        },
        (error: any) => {
          this.snackBarService.show(
            'Something went wrong at this time, try again later',
            true
          );
        }
      );
  }

  logout() {
    this.authService.logout(false);
    document.location.href='/raffledraws/login'
  }
}
