import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { runInThisContext } from 'vm';
import { catchupPodcastInterface, customPodcastInterface } from '../_model/all.interface';
import { GTRGeneralService } from '../_service/gtr_general.service';
import { PodcastService } from '../_service/podcast.service';

@Component({
  selector: 'app-podcast',
  templateUrl: './podcast.component.html',
  styleUrls: ['./podcast.component.scss']
})
export class PodcastComponent implements OnInit {
  public podcastId:string="";
  public currentId:string="";
  public id:number;
  public playingStatus:boolean=false;
  public data:any[]=[];
  public catchupData:any[]=[];
  public loader:boolean=false;
  private unsubscriber$ = new Subject<void>();
  constructor(
    public podcastService:PodcastService,
    private activatedRoute: ActivatedRoute,
    private route:Router,
    private api:GTRGeneralService,
    public GtrWebStore: Store<any>) { 
    this.route.routeReuseStrategy.shouldReuseRoute = function() {
      return false;
  };
}

  ngOnInit(): void {
    this.id=1;
    this.podcastId = this.activatedRoute.snapshot.paramMap.get('id');
    if(this.podcastId){
      this.getPodcast(this.podcastId);
    }else{
      this.podcastId="";
      this.getPodcast(this.podcastId);
    }
    this.callCatchup()
    window.localStorage.setItem('gtr-active', 'podcast');
  }
  public callCatchup():void{
    this.GtrWebStore
   .select('GtrWeb')
   .pipe(takeUntil(this.unsubscriber$))
   .subscribe(res => {
     if (res && res.GtrWebOverview) {
       this.catchupData=res.GtrWebOverview.data.radio.catchup
       
     }
   });
  }
  
  public ngOnDestroy(): void {
    this.unsubscriber$.next();
    this.unsubscriber$.complete();
  }
  public slugify(string:string):string {
    return string
      .toString()
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "")
      .replace(/\-\-+/g, "-")
      .replace(/^-+/, "")
      .replace(/-+$/, "");
  }
  public getPodcast(str:string):void{
    this.api.podcast(this.id.toString(),str)
    .pipe(take(1))
    .subscribe(res=>{
      this.loader=false;
      this.data.push(...res.data)
    })
  }
  playStatus(idx):boolean{
    return this.playingStatus;
  }
  public playPodcast(parameter:catchupPodcastInterface,idx:number):void{
    this.data.forEach((v,i)=>{
      if(i!=idx){
        v.status=false;
      }
      
    })
    this.data[idx].status=!this.data[idx].status;
    this.podcastService.playOrPause(parameter);  
  }
  public channels(obj):string{
    return Object.keys(obj)[0]
  }
  public external(obj):any[]{
    if(obj!=""){
      let f=JSON.parse(obj)
      if (f instanceof Array) {
        return f;
      }else{
        return []
      }
    }else{
      return []
    }

  }
  public getImage(news:any):string{
    if(news.data.image){
      return news.data.image
    }
    return news.details.image
  }
  public loadMore():void{
    this.loader=true;
    this.id++;
    this.getPodcast(this.podcastId);
  }
}
