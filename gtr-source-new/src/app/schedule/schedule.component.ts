import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';
import { SingleViewInterface } from '../_model/all.interface';
import { GTRGeneralService } from '../_service/gtr_general.service';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent implements OnInit {
public data:SingleViewInterface
  constructor(private api:GTRGeneralService) { }

  ngOnInit(): void {
    this.getNews();
  }
  public getNews(){
    this.api.view('schedule')
    .pipe(take(1))
    .subscribe(res=>{
      this.data=res;

    },
    ()=>{
     
    })
  }
}
