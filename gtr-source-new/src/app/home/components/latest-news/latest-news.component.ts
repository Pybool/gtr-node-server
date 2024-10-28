import { Component, Input, OnInit } from '@angular/core';
import { PostInterface } from 'src/app/_model/all.interface';

@Component({
  selector: 'app-latest-news',
  templateUrl: './latest-news.component.html',
  styleUrls: ['./latest-news.component.scss']
})
export class LatestNewsComponent implements OnInit {
  @Input() public news:PostInterface[]=[]
  @Input() public totalNews:number=0
  constructor() { }
  
  ngOnInit(): void {
    //totalNews
  }
  public getContent(para:string):string{
    let a=para.replace(/(<([^>]+)>)/gi, "")
    if(a.length>250){
      return a.slice(0,230)+"..."
    }else{
      return a
    }
  }
  public get total(){
    return parseInt((this.totalNews/10).toString())
  }

}
