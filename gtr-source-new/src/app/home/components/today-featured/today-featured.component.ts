import { Component, Input, OnInit } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { take } from 'rxjs/operators';
import { MoreTodayInterface, PostInterface } from 'src/app/_model/all.interface';
import { GTRGeneralService } from 'src/app/_service/gtr_general.service';

@Component({
  selector: 'app-today-featured',
  templateUrl: './today-featured.component.html',
  styleUrls: ['./today-featured.component.scss']
})
export class TodayFeaturedComponent implements OnInit {
  @Input() public news:PostInterface[][]=[]
  public pagenation:number=2;
  constructor(private ngxService: NgxUiLoaderService,private gtrWebService:GTRGeneralService) { }

  ngOnInit(): void {
 
  }
  public moreFeed():void{
    //this.ngxService.startLoader("app-today-featured-01");
    this.gtrWebService.moreToday(this.pagenation.toString())
    .pipe(take(1))
    .subscribe((res:MoreTodayInterface)=>{
      //this.ngxService.stopLoader("app-today-featured-01");
      this.news.push(res.data.news[0]);
      this.news.push(res.data.news[1]);
      this.pagenation=this.pagenation+2;
    },
    ()=>{
   
    })
    
    
  }

}
