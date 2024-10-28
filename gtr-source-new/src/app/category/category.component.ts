import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { take } from 'rxjs/operators';
import { GTtrNewsCategoryPageNumberAction, GTtrNewsHomePageNumberAction } from '../state/gtr-web.action';
import { CategoryViewInterface, PostInterface } from '../_model/all.interface';
import { GTRGeneralService } from '../_service/gtr_general.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
  public id:string="1";
  public pagination:number=1;
  public search:string|null=null;
  public loader:boolean=true;
  public loadMore:boolean=true;
  
  public total:number=0;
  public mainData:PostInterface[]=[];
  public result:CategoryViewInterface
  constructor(public GtrWebStore: Store<any>,private activatedRoute: ActivatedRoute,private route:Router,private api:GTRGeneralService) { 
    this.route.routeReuseStrategy.shouldReuseRoute = function() {
      return false;
  };
  }

  openExternal(url:string){
    window.open(url, '_blank');
  }

  ngOnInit(): void {
    this.pagination=1;
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.search=this.activatedRoute.snapshot.paramMap.get('search');
    window.localStorage.setItem('gtr-active', 'news');
    if(this.search ){
      this.GtrWebStore
          .select('GtrWeb')
          .pipe(take(1))
          .subscribe(res => {
            if(res && res.GtrCategoryPageNumber){
              if(res.GtrCategoryPageNumber.name==this.search){
                res.GtrCategoryPageNumber.load.map(v=>{
                  this.mainData=[...this.mainData, v]
                })
                this.pagination=(this.mainData.length/10)+1;
                this.loader=false;
              }else{
                this.getNews()
              }
              
              
              
            }else{
              this.getNews()
            }
                
          });
      
    }else{
      this.loader=false;
      this.route.navigate(["/"])
    }
  }
  public compareSlug(url:string):boolean{
   
    return true;
  }
  public get intId():number{
    return parseInt(this.id)
  }
  public getNews(){
    let ag=this.pagination++;
    console.log(ag)
    this.api.category(this.search,ag.toString())
    .pipe(take(1))
    .subscribe(res=>{
      if(res.data.news.length<=0){
        this.loadMore=false;
      }
      this.result=res;
      this.loader=false;
      if(res.status){
        res.data.news.map((v)=>{
          this.mainData=[...this.mainData, v]
        })
      }
      //this.mainData=res.data.news;
      this.GtrWebStore.dispatch(new GTtrNewsCategoryPageNumberAction({name:this.search,load:this.mainData}));
      this.total=res.data.total;
    },
    ()=>{
      
    })
  }
  public getContent(para:string):string{
    let a=para.replace(/(<([^>]+)>)/gi, "")
    if(a.length>250){
      return a.slice(0,230)+"..."
    }else{
      return a
    }
  }
  public get totals(){
    return parseInt((this.total/10).toString())
  }
  public morefeed():void{
    this.loader=true;
    this.getNews();
    
  }
get slicerStart():PostInterface[]{
  if(this.mainData.length>=4){
    return this.mainData.slice(3)
  }else{
    
    return this.mainData
  }
}
}
@Pipe({name: 'replace'})
export class ReplacePipe implements PipeTransform {
  transform(value: string, strToReplace: string, replacementStr: string): string {

    if(!value || ! strToReplace || ! replacementStr)
    {
      return value;
    }
    let result=value.replace(new RegExp(strToReplace, 'g'), replacementStr);
    
    return result.charAt(0).toUpperCase() + result.substr(1).toLowerCase();
  }
}
