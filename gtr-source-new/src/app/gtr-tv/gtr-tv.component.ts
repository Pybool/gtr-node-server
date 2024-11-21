import { Component, OnInit, ViewChild } from '@angular/core';
import { take } from 'rxjs/operators';
import { YoutubeService } from '../_service/youtube-service.service';
import { YoutubePlayerComponent } from '../youtube-player/youtube-player.component';

@Component({
  selector: 'app-gtr-tv',
  templateUrl: './gtr-tv.component.html',
  styleUrls: ['./gtr-tv.component.scss']
})
export class GtrTvComponent implements OnInit {
  public nextPage:string='';
  public playerHieght:number=400;
  public videoData:any[]=[]
  public loader:boolean=true;
  public tvPlayers:any={}
  @ViewChild('youtubeModal') youtubeModal!: YoutubePlayerComponent;
  constructor(private youTubeService: YoutubeService) { }

  ngOnInit(): void {
    this.loadVideo()
  }
  public loadVideo():any{
    this.youTubeService.getVideosForChanel(this.nextPage).pipe(take(1)).subscribe(v=>{
      if(v.nextPageToken){
        this.nextPage=v.nextPageToken;
        
      }
      console.log('NextPage ', v)
      console.log(v.items)
      this.videoData.push(...v.items)
      this.loader=false;
    })

  }
public playerReady($event,id):void{
  this.tvPlayers[id]=$event

}
public morefeed():void{
  this.loader=true;
  this.loadVideo();
}
public onVideoChange($event,id):void{
  //https://www.npmjs.com/package/@hercilio/ngx-youtube-player/v/14.2.6?activeTab=readme
  console.log(this.tvPlayers)
  Object.keys(this.tvPlayers).forEach(v=>{
    console.log([v,this.tvPlayers[v]?.getPlayerState()])
    if(this.tvPlayers[v]?.getPlayerState()==1 && v!=id){
      this.tvPlayers[v].pauseVideo()
    }
  })
  
}
}
