import { isPlatformBrowser } from '@angular/common';
import {
  Component,
  HostListener,
  Inject,
  OnInit,
  PLATFORM_ID,
  ViewEncapsulation,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import {
  GTtrHeaderOverviewAction,
  GTtrNewsHomePageNumberAction,
} from '../state/gtr-web.action';
import {
  LandingInterface,
  LandingResponseInterface,
  PostInterface,
} from '../_model/all.interface';
import { GTRGeneralService } from '../_service/gtr_general.service';
import { WindowRef } from '../_service/windowRef.service';
import * as data from '../../assets/ghanatalksradio/data/home-data.json';
import * as landing from '../../assets/ghanatalksradio/data/landing.json';
import { getNewsCategory } from 'src/app/_model/constants.interface';
import { trackScrolling } from './asideScroll';
const datas: any = data;
const landings: any = landing;
declare const $: any;
let _window: any;
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  private unsubscriber$ = new Subject<void>();
  public headerData: any[] = [];
  public id: number = 2;
  public mainData = [];
  public loader: boolean = false;
  public dataLoaded: boolean = false;
  public landingData?: LandingInterface | any = landings.data;
  public trending: { name: string; data: PostInterface }[] = [];
  public bannerNews: { name: string; data: PostInterface }[] = [];
  public intervalTimer;
  public headerNews: any[] = [];
  public popularLoader: boolean = false;

  public asideCountData: any[] = [];
  scrHeight: number;
  scrWidth: number;
  mobileTarget: number = environment.mobileTarget;
  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    private windowRef: WindowRef,
    public GtrWebStore: Store<any>,
    private gtrWebService: GTRGeneralService
  ) {}

  ngOnInit(): void {
    _window = window;
    this.headerData = datas.data.news;
    this.trending = [
      {
        name: this.headerData[1].name,
        data: this.headerData[1].data[0],
      },
      {
        name: this.headerData[2].name,
        data: this.headerData[2].data[0],
      },
      {
        name: this.headerData[3].name,
        data: this.headerData[3].data[0],
      },
      {
        name: this.headerData[4].name,
        data: this.headerData[4].data[0],
      },
      {
        name: this.headerData[5].name,
        data: this.headerData[5].data[0],
      },
      {
        name: this.headerData[6].name,
        data: this.headerData[6].data[0],
      },
    ];

    this.getAsideCountData();
    // trackScrolling()
    this.GtrWebStore.select('GtrWeb')
      // .pipe(take(1))
      .subscribe((res) => {
        console.log(res);
        if (res) {
          this.getHeaderNews(res?.GtrWebOverview?.data?.news);
          if(res?.GtrWebOverview?.data?.news){
            this.popularLoader = false;
          }
          
        }
      });

    this.getOverview();
    window.localStorage.setItem('gtr-active', 'home');
    this.gtrWebService
      .landingNews()
      .pipe(take(1))
      .subscribe(
        (res: LandingResponseInterface) => {
          this.landingData = res.data;
          this.dataLoaded = true;

          this.GtrWebStore.select('GtrWeb')
            .pipe(take(1))
            .subscribe((res) => {
              console.log(res);
              if (res && res.GtrLandingPageNumber) {
                res.GtrLandingPageNumber.map((v) => {
                  this.mainData = [...this.mainData, v];
                });

                this.id = this.mainData.length / 10 + 2;
              }
            });
        },
        () => {}
      );
  }
  public morefeed(): void {
    this.loader = true;
    this.getNews();
  }
  /*  get allnewsData():any[]{
    
    this.landingData.all.sort((a, b) => a.post_modified < b.post_modified ? 1 : -1);
    return this.landingData.all
  }
  get getMainData():any[]{
    this.mainData.sort((a, b) => a.post_modified < b.post_modified ? 1 : -1);
    return this.mainData;
  } */
  public ngOnDestroy(): void {
    this.unsubscriber$.next();
    this.unsubscriber$.complete();
  }

  ngAfterViewInit() {}

  getNewsCategory(para: any[]): boolean {
    let show: boolean = false;
    for (let i = 0; i < para.length; i++) {
      if (getNewsCategory(para[i].slug).length > 0) {
        show = true;
        break;
      }
    }
    return show;
  }
  getNewsCategoryName(para: any[]): { name: string; slug: string } {
    let show: { name: string; slug: string } = { name: '', slug: '' };
    for (let i = 0; i < para.length; i++) {
      if (getNewsCategory(para[i].slug).length > 0) {
        show = para[i];
        break;
      }
    }
    return show;
  }

  private generateRandomUniqueIndices(maxIndex, count) {
    const indices = [];
    const usedIndices = new Set();

    while (indices.length < count) {
      const randomIndex = Math.floor(Math.random() * maxIndex);
      if (!usedIndices.has(randomIndex)) {
        indices.push(randomIndex);
        usedIndices.add(randomIndex);
      }
    }

    return indices;
  }

  public getOverview(): void {
    this.GtrWebStore.select('GtrWeb')
      .pipe(takeUntil(this.unsubscriber$))
      .subscribe((res) => {
        if (res && res.GtrWebOverview) {
          this.headerData = res.GtrWebOverview.data.news;
          this.trending = [
            {
              name: this.headerData[1].name,
              data: this.headerData[1].data[0],
            },
            {
              name: this.headerData[2].name,
              data: this.headerData[2].data[0],
            },
            {
              name: this.headerData[3].name,
              data: this.headerData[3].data[0],
            },
            {
              name: this.headerData[4].name,
              data: this.headerData[4].data[0],
            },
            {
              name: this.headerData[5].name,
              data: this.headerData[5].data[0],
            },
            {
              name: this.headerData[6].name,
              data: this.headerData[6].data[0],
            },
          ];
          const randomIndices = this.generateRandomUniqueIndices(9, 4);
          this.bannerNews = [
            {
              name: this.headerData[randomIndices[0]].name,
              data: this.headerData[randomIndices[0]].data[0],
            },
            {
              name: this.headerData[randomIndices[1]].name,
              data: this.headerData[randomIndices[1]].data[0],
            },
            {
              name: this.headerData[randomIndices[2]].name,
              data: this.headerData[randomIndices[2]].data[0],
            },
            {
              name: this.headerData[randomIndices[3]].name,
              data: this.headerData[randomIndices[3]].data[0],
            },
          ];

          window.localStorage.setItem('trend', JSON.stringify(this.trending));

          setTimeout(() => {
            _window.renderBannerNews();
            _window.renderTrending();
          }, 500);
        }
      });
  }

  ngOnChanges(): void {
    this.owlLoader();
  }

  public getAsideCountData() {
    this.GtrWebStore.select('GtrWeb')
      .pipe(takeUntil(this.unsubscriber$))
      .subscribe((res) => {
        if (res && res.GtrWebOverview) {
          this.asideCountData = res.GtrWebOverview.data.footer;
        }
      });
  }

  public owlLoader(): void {
    var owlWrap = $('.owl-wrapper');
    owlWrap.each((element: any) => {
      var carousel = $(owlWrap[element]).find('owl-carousel'),
        dataNum = $(owlWrap[element]).find('owl-carousel').attr('data-num'),
        dataNum2,
        dataNum3;

      if (dataNum == 1) {
        dataNum2 = 1;
        dataNum3 = 1;
      } else if (dataNum == 2) {
        dataNum2 = 2;
        dataNum3 = dataNum - 1;
      } else {
        dataNum2 = dataNum - 1;
        dataNum3 = dataNum - 2;
      }

      carousel.owlCarousel({
        autoPlay: 10000,
        navigation: true,
        items: dataNum,
        itemsDesktop: [1199, dataNum2],
        itemsDesktopSmall: [979, dataNum3],
      });
    });
  }

  private getObjectByname(array: any, name: string) {
    return array.find((item: any) => item.name === name);
  }

  private getHeaderNews(data) {
    this.popularLoader = true;

    const categories = [
      'World',
      'Politics',
      'Tech',
      'CRIME',
      'National',
      'Sports',
      'Education',
      'Cryptocurrency',
    ];
    for (let category of categories) {
      const newsObj = this.getObjectByname(data, category);
      if (newsObj) {
        this.headerNews.push({
          category,
          data: newsObj.data[this.generateRandomIndex(newsObj.data.length)],
        });
      }
    }
  }

  private generateRandomIndex(end: number = 4) {
    return Math.floor(Math.random() * end + 1);
  }

  public getNews() {
    this.gtrWebService
      .latestNews(this.id.toString())
      .pipe(take(1))
      .subscribe(
        (res) => {
          this.loader = false;
          if (res.status) {
            res.data.news.map((v: PostInterface) => {
              this.mainData = [...this.mainData, v];
            });
          }
          this.id++;
          this.GtrWebStore.dispatch(
            new GTtrNewsHomePageNumberAction(this.mainData)
          );
        },
        () => {}
      );
  }
}
