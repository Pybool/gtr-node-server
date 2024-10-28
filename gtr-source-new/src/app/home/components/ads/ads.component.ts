import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
import { WindowRef } from 'src/app/_service/windowRef.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-ads',
  templateUrl: './ads.component.html',
  styleUrls: ['./ads.component.scss']
})
export class AdsComponent implements OnInit,AfterViewInit {
  showAd = environment.adsense.show;

  @Input() horizontal:boolean=false;
  @Input() height:number=0;
  @Input() width:number=0;
  public banner={
    adClient:environment.adsense.adClient,
    adSlot : "6820952195",//
    adFormat : 'auto',
    fullWidthResponsive : true
  }
  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
 private windowRef: WindowRef
  ) { }

  ngOnInit(): void {
  }
  ngAfterViewInit() {
    
    setTimeout(() => {
      if(isPlatformBrowser(this.platformId)) {
        try {
          (this.windowRef.nativeWindow['adsbygoogle'] = this.windowRef.nativeWindow['adsbygoogle'] || []).push({
              overlays: {bottom: true}
          });
      } catch (e) {
          console.error(e);
      }
      
      }
        
    }, 0);
}
}
