import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GTRGeneralService } from '../_service/gtr_general.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  public footerData:any[]=[];
  public newsData:any[]=[];
  private unsubscriber$ = new Subject<void>();
 
  constructor(public GtrWebStore: Store<any>,private gtrWebService:GTRGeneralService,private route:Router) { }

  ngOnInit(): void {
    this.getOverview();
  }
  public getOverview(): void {
    this.GtrWebStore
      .select('GtrWeb')
      .pipe(takeUntil(this.unsubscriber$))
      .subscribe(res => {
        if (res && res.GtrWebOverview) {
          this.footerData = res.GtrWebOverview.data.footer;
          this.newsData = res.GtrWebOverview.data.news;
         
          
        }
      });
  }
}
