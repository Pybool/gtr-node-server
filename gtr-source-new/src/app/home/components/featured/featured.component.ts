import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
declare const $: any;
@Component({
  selector: 'app-featured',
  templateUrl: './featured.component.html',
  styleUrls: ['./featured.component.scss']
})
export class FeaturedComponent implements OnInit {
  @Input() public headerData:any=[]
  private unsubscriber$ = new Subject<void>();
 public  loaded:boolean=false;
 public slider:any;
 public latestNews:string[]=[];
  constructor(public GtrWebStore: Store<any>) { }

  ngOnInit(): void {
    this.getOverview();
  }
  public ngOnDestroy(): void {
    this.unsubscriber$.next();
    this.unsubscriber$.complete();
    this.loaded=false;
  }
  public getOverview(): void {
    this.GtrWebStore
      .select('GtrWeb')
      .pipe(takeUntil(this.unsubscriber$))
      .subscribe(res => {
        if (res && res.GtrWebOverview) {
          this.headerData = res.GtrWebOverview.data.news[0]
         this.loaded=true;
         this.headerData.data.forEach(element => {
           this.latestNews.push(element.post_title);
         });
        setTimeout(function(){  this.slider=  $('.bxsliderheader').bxSlider({
          mode: 'fade',
          auto: true
        });}, 3000);
          
        }
      });
  }
  ngOnChanges():void{
    this.owlLoader()
  }
  nextSlider():void{
    this.slider.goToNextSlide();
  }
  preSlider():void{
    this.slider.goToPrevSlide();
  }
  ngAfterViewInit():void{
  }
  public owlLoader(): void {
    

  
}
}
