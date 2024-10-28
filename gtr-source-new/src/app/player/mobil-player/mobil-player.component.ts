import { Component, HostListener, OnInit } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { environment } from 'src/environments/environment';
declare const $: any;
@Component({
  selector: 'app-mobil-player',
  templateUrl: './mobil-player.component.html',
  styleUrls: ['./mobil-player.component.scss']
})
export class MobilPlayerComponent implements OnInit {
  // scrHeight:number;
  // scrWidth:number;
  // mobileTarget:number=environment.mobileTarget;

  constructor(
    private bottomSheet: MatBottomSheet
  ) { }

  // @HostListener('window:resize', ['$event'])
  // getScreenSize(event?) {
  //       this.scrHeight = window.innerHeight;
  //       this.scrWidth = window.innerWidth;
  // }

  ngOnInit(): void {
    // this.getScreenSize();
  }
  

//   closePlayerForm(){
//     $(".bar").animate({
//       height: "60px"
//   });
//   $(".bar").removeClass("audio-sys");
//   $(".top-close-btn").css("display","none");
//   $(".right-side").css("display","block");
//   $(".left-side").removeClass("audio-sys-props");
//   $(".play-btn").removeClass("extra-btn");
//   }
//   openPlayerForm(){
//     $(".bar").addClass("audio-sys");
//     $(".top-close-btn").css("display","block");
//     $(".right-side").css("display","none");
//     $(".left-side").addClass("audio-sys-props");
//     $(".play-btn").addClass("extra-btn");
//     $(".bar").animate({
//         height: "91%"
//     });
//   }
 
//   closeComponentSheetMenu() {
//     this.bottomSheet.dismiss();
//   }
}
