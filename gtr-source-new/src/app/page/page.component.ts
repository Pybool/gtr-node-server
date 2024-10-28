import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { PostInterface } from '../_model/all.interface';
import { GTRGeneralService } from '../_service/gtr_general.service';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss']
})
export class PageComponent implements OnInit {
  public id:string|null=null
  public mainData:PostInterface[]=[];
  public total:number=0;
  constructor(private activatedRoute: ActivatedRoute,private route:Router,private api:GTRGeneralService) { 
    this.route.routeReuseStrategy.shouldReuseRoute = function() {
      return false;
  };
  }

  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    if(this.id ){
      this.getNews()
    }else{
      this.route.navigate(["/"])
    }
  }
  public get intId():number{
    return parseInt(this.id)
  }
  public getNews(){
    this.api.latestNews(this.id)
    .pipe(take(1))
    .subscribe(res=>{
      this.mainData=[];
      this.mainData=res.data.news;
      this.total=res.data.total
    },
    ()=>{
      
    })
  }
  public get totals(){
    return parseInt((this.total/10).toString())
  }
  public get getPagination(){
    if(parseInt(this.id)===1){
      return `
      <li><a class="active">1</a></li>
      <li><a href="#/page/2">2</a></li>
      <li><a href="#/page/3">3</a></li>
      <li><span>...</span></li>
      <li><a href="#/page/${this.totals}">${this.totals.toLocaleString()}</a></li>
      <li><a href="#/page/${parseInt(this.id)+1}">Next</a></li>
                
                `
    }
    else if(parseInt(this.id)===2){
      return `
      <li><a href="#/page/${parseInt(this.id)-1}">Prev</a></li>
          <li><a href="#/page/1">1</a></li>
            <li><a  class="active" >2</a></li>
            <li><a href="#/page/3">3</a></li>
            <li><span>...</span></li>
            <li><a href="#/page/${this.totals}">${this.totals.toLocaleString()}</a></li>
            <li><a href="#/page/${parseInt(this.id)+1}">Next</a></li>
            `
    }
    else if(parseInt(this.id)===3){
      return `
      <li><a href="#/page/${parseInt(this.id)-1}">Prev</a></li>
          <li><a  href="#/page/1">1</a></li>
            <li><a href="#/page/2">2</a></li>
            <li><a class="active" >3</a></li>
            <li><a href="#/page/4">4</a></li>
            <li><span>...</span></li>
            <li><a href="#/page/${this.totals}">${this.totals.toLocaleString()}</a></li>
            <li><a href="#/page/${parseInt(this.id)+1}">Next</a></li>
            `
    }
    else if(parseInt(this.id)>=this.totals){
      return `
            <li><a href="#/page/${parseInt(this.id)-1}">Prev</a></li>
              <li><a href="#/page/1">1</a></li>
              <li><span>...</span></li>
                <li><a href="#/page/${this.totals-2}">${(this.totals-2).toLocaleString()}</a></li>
                <li><a href="#/page/${this.totals-1}">${(this.totals-1).toLocaleString()}</a></li>
                <li><a  class="active" >${this.totals.toLocaleString()}</a></li>
                <li><a href="#/page/${parseInt(this.id)+1}">Next</a></li>
                `
    }
    else if(parseInt(this.id)==(this.totals-1)){
      return `
      <li><a href="#/page/${parseInt(this.id)-1}">Prev</a></li>
              <li><a href="#/page/1">1</a></li>
              <li><span>...</span></li>
                <li><a href="#/page/${this.totals-2}">${(this.totals-2).toLocaleString()}</a></li>
                <li><a  class="active">${(this.totals-1).toLocaleString()}</a></li>
                <li><a href="#/page/${this.totals}">${this.totals.toLocaleString()}</a></li>
                
                `
    }
    else if(parseInt(this.id)==(this.totals-2)){
      return `
      <li><a href="#/page/${parseInt(this.id)-1}">Prev</a></li>
              <li><a href="#/page/1">1</a></li>
              <li><span>...</span></li>
              <li><a href="#/page/${this.totals-3}">${(this.totals-3).toLocaleString()}</a></li>
                <li><a class="active">${(this.totals-2).toLocaleString()}</a></li>
                <li><a href="#/page/${this.totals-1}">${(this.totals-1).toLocaleString()}</a></li>
                <li><a href="#/page/${this.totals}">${this.totals.toLocaleString()}</a></li>
                <li><a href="#/page/${parseInt(this.id)+1}">Next</a></li>
                
                `
    }else{
      return `
          <li><a href="#/page/${parseInt(this.id)-1}">Prev</a></li>
            <li><a  href="#/page/1">1</a></li>
            <li><span>...</span></li>
            <li><a href="#/page/${parseInt(this.id)-1}">${(parseInt(this.id)-1).toLocaleString()}</a></li>
            <li><a class="active">${parseInt(this.id).toLocaleString()}</a></li>
            <li><a href="#/page/${parseInt(this.id)+1}">${(parseInt(this.id)+1).toLocaleString()}</a></li>
            <li><span>...</span></li>
            <li><a href="#/page/${this.totals}">${this.totals.toLocaleString()}</a></li>
            <li><a href="#/page/${parseInt(this.id)+1}">Next</a></li>
            
          `
    }
    
  }
}
