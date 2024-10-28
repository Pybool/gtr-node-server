import { isPlatformBrowser } from '@angular/common';
import { Component, ElementRef, HostListener, Inject, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { environment } from 'src/environments/environment';
import { WindowRef } from '../_service/windowRef.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  scrHeight:number;
  scrWidth:number;
  showBar:boolean=false;
  mobileTarget:number=environment.mobileTarget;
  @ViewChild('fr') element: ElementRef;
  constructor(elRef:ElementRef,@Inject(PLATFORM_ID) private platformId: any,
  private windowRef: WindowRef) {
   }

  ngOnInit(): void {
    this.getScreenSize();
    this.showBar=isPlatformBrowser(this.platformId)
  }
  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
    if(isPlatformBrowser(this.platformId)) {
      this.scrHeight = this.windowRef.nativeWindow.innerHeight;
      this.scrWidth = this.windowRef.nativeWindow.innerWidth;
    
    }
       
  }
  get getEnableStatus():boolean{
    let bound=this.element?.nativeElement?.getBoundingClientRect()
    if(bound?.y>0){
      return false;
    }else{
      return true
    }
  }
  consoleLog($event){
   
    
  }
}
