import { Component, Input, OnInit } from '@angular/core';
import { PostInterface } from 'src/app/_model/all.interface';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss']
})
export class VideoComponent implements OnInit {
  @Input() public news:PostInterface[][]=[]
  constructor() { }

  ngOnInit(): void {
  }
  public getVideoLink(para:string):string{
    return "https://youtu.be/AQL2MOMK3xA"
  }

}
