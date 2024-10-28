import { Component, Input, OnInit } from '@angular/core';
import { PostInterface } from 'src/app/_model/all.interface';

@Component({
  selector: 'app-trending',
  templateUrl: './trending.component.html',
  styleUrls: ['./trending.component.scss']
})
export class TrendingComponent implements OnInit {
  @Input() public news:{name:string;data:PostInterface;}[]=[]
  constructor() { }

  ngOnInit(): void {
    console.log(this.news)
  }

}
