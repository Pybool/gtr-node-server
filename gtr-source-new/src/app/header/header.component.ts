import { isPlatformBrowser } from '@angular/common';
import { Component, HostListener, Inject, Input, OnInit, PLATFORM_ID, ViewEncapsulation } from '@angular/core';
import { UntypedFormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { GTtrHeaderOverviewAction } from '../state/gtr-web.action';
import { GTRGeneralService } from '../_service/gtr_general.service';
import { WindowRef } from '../_service/windowRef.service';
declare const $: any;
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class HeaderComponent implements OnInit {
  @Input() public headerData:any=[];
  scrHeight:number;
  scrWidth:number;
  showBar:boolean=false;
  mobileTarget:number=environment.mobileTarget;
  public formControl:UntypedFormControl=new UntypedFormControl(null,Validators.required)
  private unsubscriber$ = new Subject<void>();
 
  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
 private windowRef: WindowRef,
    public GtrWebStore: Store<any>,private gtrWebService:GTRGeneralService,private route:Router) { }
  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
    if(isPlatformBrowser(this.platformId)) {
      this.scrHeight = this.windowRef.nativeWindow.innerHeight;
      this.scrWidth = this.windowRef.nativeWindow.innerWidth;
    }
        
  }
  ngOnInit(): void {
    this.GtrWebStore.dispatch(new GTtrHeaderOverviewAction());
    this.getOverview();
    this.getScreenSize();
    this.showBar=isPlatformBrowser(this.platformId)
  }
  public ngOnDestroy(): void {
    this.unsubscriber$.next();
    this.unsubscriber$.complete();
  }
  public getOverview(): void {
    this.GtrWebStore
      .select('GtrWeb')
      .pipe(takeUntil(this.unsubscriber$))
      .subscribe(res => {
        if (res && res.GtrWebOverview) {
          this.headerData = res.GtrWebOverview.data.news;
         
          
        }
      });
  }
  ngOnChanges():void{
    this.owlLoader()
  }
  public owlLoader(): void {
    

  
}
public searchItem():void{
if(this.formControl.valid){
  this.route.navigate(["/search","1", encodeURIComponent(this.formControl.value)])
   
  }
}
get currentTime(){
  let date=new Date();
  return date ;  
}
customOptions: OwlOptions = {
  loop: true,
  mouseDrag: false,
  touchDrag: false,
  pullDrag: false,
  dots: false,
  navSpeed: 700,
  navText: ['', ''],
  responsive: {
    0: {
      items: 1
    },
    400: {
      items: 2
    },
    740: {
      items: 3
    },
    940: {
      items: 4
    }
  },
  nav: false
}
}
