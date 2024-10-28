import { Component, Inject, OnInit, Output, PLATFORM_ID } from '@angular/core';
import { Store } from '@ngrx/store';
import { StreamState } from '../../_model/stream-state';
import { Subject } from 'rxjs';
import { AudioService } from 'src/app/_service/audio.service';
import { CloudService } from 'src/app/_service/cloud.service';
import { environment } from 'src/environments/environment';
import { takeUntil } from 'rxjs/operators';
import { PodcastService } from 'src/app/_service/podcast.service';
import { catchupPodcastInterface } from 'src/app/_model/all.interface';
import { WindowRef } from 'src/app/_service/windowRef.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-mini',
  templateUrl: './mini.component.html',
  styleUrls: ['./mini.component.scss']
})
export class MiniComponent implements OnInit {
  public status:string="OPEN";
  public icon:string="fa-angle-up";
  public open:boolean=false;
  public headerData:any;
  public playlistData:any[]=[];
  public catchupData:any[]=[];
  public availableData:any[]=[];
  public minimizeRadio:boolean=false;
 private unsubscriber$ = new Subject<void>();
 gtrPlayingMode=PlayingMode.Radio;
 gtrPlayingStatus=PlayingStatus.Stop;
 
 public baseUrl=environment.apiAsset;
 public selectedRadioPlaylist
 public selectedRadioCatchup

 public currentMusicInfor:{mode:string;url:string;title:string;cover:string;author:string,description:string}={
   mode:PlayingMode.Radio,
   url: "https://s4.radio.co/s330e23155/low",
   title: "GTR Radio",
   author: "Listen Live",
   cover: "https://3.bp.blogspot.com/_mupIVJbjvuU/TKgPuOEekII/AAAAAAAAHd4/HGTyRWuhw2c/s1600/Made+by+In+For+The+Kill.png",
   description: "anything there"
 }
 showPlayList:boolean=false;
 files: Array<any> = [];
 state: StreamState;
 currentFile: any = {};
 audioList = {
   mode:PlayingMode.Radio,
   url: "https://s4.radio.co/s330e23155/low",
   title: "GTR Radio",
   author: "Listen Live",
   cover: "https://3.bp.blogspot.com/_mupIVJbjvuU/TKgPuOEekII/AAAAAAAAHd4/HGTyRWuhw2c/s1600/Made+by+In+For+The+Kill.png",
   description: "anything there"
 }
 constructor(
  @Inject(PLATFORM_ID) private platformId: any,
  private windowRef: WindowRef,
  public podcastService:PodcastService,
   public audioService: AudioService,public GtrWebStore: Store<any>,
   public cloudService: CloudService) {
     // get media files
   cloudService.getFiles().subscribe(files => {
     this.files = files;
   });

   // listen to stream state
   this.audioService.getState()
   .subscribe(state => {
     this.state = state;
   });


    }
    public get internalWidth(){
      if(isPlatformBrowser(this.platformId)) {
        return this.windowRef.nativeWindow.innerWidth
      }
      return 0;
    }
    public ngOnDestroy(): void {
     this.unsubscriber$.next();
     this.unsubscriber$.complete();
   }
   changePlaylist(para:any):void{
     
   }
 changeCatchup(para:any):void{
     
 }
 public initEmitter():void{
  if (this.podcastService.subsVar==undefined) {    
    this.podcastService.subsVar = this.podcastService.    
    invokeFirstComponentFunction.subscribe((name:catchupPodcastInterface) => {  
      this.playOrPause(name);    
    });    
  } 
}
public playOrPause(name:catchupPodcastInterface):void{
  if(name.status){
    this.selectedCatchupList({
      url:name.data.url,
      shows_data:{
        name:name.details.name,
        image:name.details.image
      },
      start_date:name.data.start_date,
      description:name.data.description,
    })
  }else{
    this.pause()
  }
  
}
 ngOnInit(): void {
  this.initEmitter();
   this.GtrWebStore
   .select('GtrWeb')
   .pipe(takeUntil(this.unsubscriber$))
   .subscribe(res => {
     if (res && res.GtrWebOverview) {
       this.playlistData = res.GtrWebOverview.data.radio.playlist
       this.catchupData=res.GtrWebOverview.data.radio.catchup
     }
   });
 }
 get radioPlaylist():any[]{
   return this.playlistData
 }
 get radioCatchup():any[]{
   return this.catchupData
 }
 selectedPlaylistList(lik:any){
   this.currentMusicInfor={
     mode:PlayingMode.Playlist,
     url: lik.url,
     title: lik.name,
     author: lik.author,
     cover:  this.baseUrl+"images/"+lik.image,
     description: lik.description
   }
   this.playAudio();
 }
 selectedCatchupList(lik:any){
   this.currentMusicInfor={
     mode:PlayingMode.Playlist,
     url: lik.url,
     title: lik.shows_data.name,
     author: lik.start_date,
     cover: this.baseUrl+"images/"+lik.shows_data.image,
     description: lik.description
   }
   this.playAudio();
 }
 changeRadio($event:any,selectedData){
   this.availableData=selectedData
 }

 changeRadioCatchup($event:any,selected){
   this.availableData=selected//this.selectedRadioCatchup
 }
 getChecked(i:number):boolean{
   if(i===0){
     return true;
   }else{
     return false
   }
 }
 playStream(url) {
   this.audioService.playStream(url).subscribe(events => {
     // listening for fun here
   });
 }
 openFile(file, index) {
   this.currentFile = { index, file };
   this.audioService.stop();
   this.playStream(file.url);
 }
 pause() {
   this.gtrPlayingStatus=PlayingStatus.Pause;
   this.audioService.pause();
 }
 playAudio(){
   this.audioService.stop();
   this.playStream(this.currentMusicInfor.url);
   this.gtrPlayingStatus=PlayingStatus.Play;
 }
 play() {
   
   this.audioService.play();
 }
 stop() {
   this.gtrPlayingStatus=PlayingStatus.Stop;
   this.audioService.stop();
 }
 next() {
   const index = this.currentFile.index + 1;
   const file = this.files[index];
   this.openFile(file, index);
 }
 previous() {
   const index = this.currentFile.index - 1;
   const file = this.files[index];
   this.openFile(file, index);
 }
 isFirstPlaying() {
   return this.currentFile.index === 0;
 }

 isLastPlaying() {
   return this.currentFile.index === this.files.length - 1;
 }
 onSliderChangeEnd(change) {
   this.audioService.seekTo(change.value);
 }
 slideSeeker($event){

 }
 fmtMSS(s){
   let minutes = ~~(s / 60);
   let seconds = ~~(s % 60);
   var minute
   var second
   if(minutes.toString().length==1){
     minute="0"+minutes.toString();
   }else{
     minute=minutes.toString();
   }
   if(seconds.toString().length==1){
     second="0"+seconds.toString();
   }else{
     second=seconds.toString();
   }
   return minute + ':' + second;
 }
 get seeker():number{
   if(this.state.duration){
     return (this.state.currentTime/this.state.duration)
   }else{
     return 0; 
   }
 }
 get getTotalTime():string{
   if(this.state.duration){
     if(this.state.duration==Infinity){
       return "00:00";
     }else{
       return this.fmtMSS(this.state.duration)
     }
   }else{
     return "00:00";
   }
   
 }
 get getCurrentTime():string{
   if(this.state.currentTime){
     return this.fmtMSS(this.state.currentTime)
   }else{
     return "00:00";
   }
 }
 showList(){
   this.showPlayList=!this.showPlayList
 }
 selectMode(mode:string){
   this.showPlayList=false;
   switch (mode){
     case 'radio':
       if(this.currentMusicInfor.mode!==PlayingMode.Radio){
         this.currentMusicInfor=this.audioList;
         this.playAudio();
       }
       this.gtrPlayingMode=PlayingMode.Radio
       this.minimizeRadio=false;
       break
     case 'catchup':
       this.gtrPlayingMode=PlayingMode.Catchup
       if(this.catchupData.length>0){
         this.availableData=this.catchupData[0].data
       }
       this.minimizeRadio=true;
       this.showPlayList=true;
       
       break
     case 'playlist':
       this.gtrPlayingMode=PlayingMode.Playlist
       if(this.catchupData.length>0){
         this.availableData=this.playlistData[0].data
       }
       this.minimizeRadio=true;
       this.showPlayList=true;
       break
     default:
       this.gtrPlayingMode=PlayingMode.Radio
       this.minimizeRadio=false;
       break
   }
 }
 public minimizeplay():void{
   this.minimizeRadio=!this.minimizeRadio;
 }
 get minimizeStatus():string{
   if(!this.minimizeRadio){
     return "fa fa-angle-double-down";
   }else{
     return "fa fa-angle-double-up";
   }
 }
 
translateup(){
  if(!this.open){
    this.open=!this.open;
    this.status="CLOSE";
    this.icon="fa-angle-down";
  }else{
    this.open=!this.open;
    this.status="OPEN";
    this.icon="fa-angle-up";
  }
  
  }
}
export enum PlayingMode {
 Radio = 'radio',
 Catchup = 'catchup',
 Playlist = 'playlist'
}
export enum PlayingStatus {
 Play = 'play',
 Pause = 'pause',
 Stop = 'stop'
}