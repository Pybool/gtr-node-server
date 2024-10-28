import { Component, HostListener, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
import { appearElems, initilializeAudio } from './main';
import { WindowRef } from '../_service/windowRef.service';
import { isPlatformBrowser } from '@angular/common';
import { environment } from 'src/environments/environment';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-podcast-player',
  templateUrl: './podcast-player.component.html',
  styleUrls: ['./podcast-player.component.scss']
})
export class PodcastPlayerComponent implements OnInit {

  @Input() data: any;
  scrHeight: number;
  scrWidth: number;
  mobileTarget: number = environment.mobileTarget;

  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    private windowRef: WindowRef,
    private route: ActivatedRoute, private router: Router
  ) {}
  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
    if (isPlatformBrowser(this.platformId)) {
      this.scrHeight = this.windowRef.nativeWindow.innerHeight;
      this.scrWidth = this.windowRef.nativeWindow.innerWidth;
    }
  }
  ngOnInit(): void {
    this.getScreenSize();
  }

  ngAfterViewInit(){
    this.route.queryParams.subscribe(params => {
      const autoplay = params['autoplay'];
      const activePlaying = initilializeAudio(this.data?.data?.url);
      this.windowRef.activePlaying = activePlaying
      appearElems();

      // if (currentAudio) {
      //   currentAudio.pause();
      //   currentAudio.currentTime = 0; // Reset the audio to the beginning
      //   currentAudio = null;
      // }
      // if (autoplay === '1') {
      //   console.log('Autoplay is set to 1');
      //   setTimeout(()=>{
      //     const playButton = document.querySelector('.audio-player-button') as any;
      //     if(playButton){
      //       playButton.click()
      //     }
      //   },1000)
      // }
    });

    
    
    
  }

  public ellipsize(para: string): string {
    let a = para?.replace(/(<([^>]+)>)/gi, '');
    if (a?.length > 40) {
      return (
        a?.slice(0, 40) + '...'
      );
    } else {
      return a;
    }
  }


  public convertDateToArray(dateString: string): [number, string] {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
    const date = new Date(dateString);
    const day = date.getDate();
    const month = months[date.getMonth()];
  
    return [day, month];
  }

}
