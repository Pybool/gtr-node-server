import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { catchupPodcastInterface } from '../_model/all.interface';
import { GTRGeneralService } from '../_service/gtr_general.service';
import { PodcastService } from '../_service/podcast.service';

@Component({
  selector: 'app-podcast-single',
  templateUrl: './podcast-single.component.html',
  styleUrls: ['./podcast-single.component.scss']
})
export class PodcastSingleComponent implements OnInit {
  public podcastId:string="";
  public errorPage:boolean=false;
  public singleData:any
  @ViewChild('patientDDL') patientDDL:ElementRef;
  constructor(
    public podcastService:PodcastService,private activatedRoute: ActivatedRoute,private route:Router,private api:GTRGeneralService) { 
    this.route.routeReuseStrategy.shouldReuseRoute = function() {
      return false;
  };
}

  ngOnInit(): void {
    this.podcastId = this.activatedRoute.snapshot.paramMap.get('title');
    if(this.podcastId){
      this.getPodcast(this.podcastId);
    }else{
      this.route.navigate(['/podcast'])
    }
  }
  public playPodcast(parameter:catchupPodcastInterface):void{
    /* this.data.forEach((v,i)=>{
      if(i!=idx){
        v.status=false;
      }
      
    })
    this.data[idx].status=!this.data[idx].status; */
    this.podcastService.playOrPause(parameter);  
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
  public channels(obj):string{
    return Object.keys(obj)[0]
  }
  public getPodcast(str:string):void{
    this.api.podcastSingle(this.podcastId)
    .pipe(take(1))
    .subscribe(res=>{
      if(res.status){
        this.singleData=res.data
      }else{
        this.errorPage=true;

      }
    },()=>{
      this.errorPage=true;
    })
  }
  
}
