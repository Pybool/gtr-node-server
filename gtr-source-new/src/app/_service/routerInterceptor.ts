import { Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { WindowRef } from './windowRef.service';

@Injectable({
  providedIn: 'root',
})
export class RouterInterceptorService {
  activePlaying: any = null;
  audioContext: HTMLAudioElement | null = null

  constructor(private router: Router, private windowRef: WindowRef) {
    // Subscribe to router events
  }

  // Function to be called when routerLink is clicked
  onRouterLinkClicked() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        // Call the desired function when a routerLink is clicked
        this.activePlaying = WindowRef.prototype.nativeWindow.activePlaying
        this.audioContext = WindowRef.prototype.nativeWindow.audioContext
        if (this.activePlaying == true || this.activePlaying== false) {
          const playerBtn = document.querySelector('#chat-dock-btn') as any;
          if (playerBtn) {
            playerBtn.style.display = 'flex';
          }
          const pauseBtnIcon = document.querySelector('._pause') as any;
          const playBtnIcon = document.querySelector('._play') as any;
          if(this.activePlaying){
            if(pauseBtnIcon){
              pauseBtnIcon.style.display = 'block';
              playBtnIcon.style.display = 'none';
            }
          }else{
            if(playBtnIcon){
              playBtnIcon.style.display = 'block';
              pauseBtnIcon.style.display = 'none';
            }
          }
        }
      }
    });
  }
}
