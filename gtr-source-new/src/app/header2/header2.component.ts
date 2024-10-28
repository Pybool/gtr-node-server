import {
  Component,
  ElementRef,
  HostListener,
  Inject,
  OnDestroy,
  PLATFORM_ID,
} from '@angular/core';
import { CommonModule, isPlatformBrowser, Location } from '@angular/common';
import { environment } from 'src/environments/environment.prod';
import { Subject } from 'rxjs';
import { Store } from '@ngrx/store';
import { WindowRef } from '../_service/windowRef.service';
import { take, takeUntil } from 'rxjs/operators';
import { GTRGeneralService } from '../_service/gtr_general.service';
import { catchupPodcastInterface } from '../_model/all.interface';
import { PodcastService } from '../_service/podcast.service';
import { initilializeAudio } from './main';

interface ilocation {
  country?: string;
  code?: string;
  expire?: Date;
}

@Component({
  selector: 'app-header2',
  templateUrl: './header2.component.html',
  styleUrls: ['./header2.component.scss'],
})
export class Header2Component {
  public mobileView: boolean = false;
  public timer: any;
  public isMobile: any;
  public mobileNavOpen: boolean = false;
  public scrHeight: number;
  public scrWidth: number;
  public intervalTimer;
  public showBar: boolean = false;
  public mobileTarget: number = environment.mobileTarget;
  public dropdownMenu: string;
  public isCollapsed: boolean = true;
  public headerNews: any[] = [];
  public showSearchInput: boolean = false;
  public imageads: {
    url: string;
    image: string;
    route: string;
    open_in_app: boolean;
  };
  public podcasts: any[] = [];
  public id: number = 1;
  public catchupData: any[] = [];
  public playingStatus: boolean = false;
  private unsubscriber$ = new Subject<void>();

  constructor(
    public GtrWebStore: Store<any>,
    @Inject(PLATFORM_ID) private platformId: any,
    private windowRef: WindowRef,
    private el: ElementRef,
    public podcastService: PodcastService,
    private gtrWebService: GTRGeneralService
  ) {}

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
    if (isPlatformBrowser(this.platformId)) {
      this.scrHeight = this.windowRef.nativeWindow.innerHeight;
      this.scrWidth = this.windowRef.nativeWindow.innerWidth;
    }
  }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: MouseEvent) {
    const clickedInside = this.el.nativeElement.contains(event.target);
    if (!clickedInside && !this.isCollapsed) {
      this.toggleNavBar();
    }
  }

  ngOnInit(): void {
    this.getScreenSize();
    this.callCatchup();
    this.imageads = this.imageadsFcn();
    this.showBar = isPlatformBrowser(this.platformId);
    if (isPlatformBrowser(this.platformId)) {
      this.intervalTimer = setInterval(() => {
        this.imageads = this.imageadsFcn();
      }, 10000);
    }
    this.getHeaderNews();
    this.getPodcast('');
  }

  ngAfterViewInit() {
    const pathname = document.location.pathname;
    let activeLinkId = pathname.replace('/', '-'); //replace first /
    if (activeLinkId == '-') {
      // Home page
      activeLinkId = 'home';
    } else if (activeLinkId.includes('flights-tracker')) {
      activeLinkId = 'flights-tracker';
    } else {
      activeLinkId = activeLinkId.replace('-', '').replace('/', '-');
    }

    if (activeLinkId) {
      const anchorLink = document.querySelector(
        `#${activeLinkId}`
      ) as HTMLAnchorElement;
      if (anchorLink) {
        anchorLink.classList.add('gtr-active');
      }
      const spanElement = anchorLink?.querySelector('span') as HTMLSpanElement;
      if (spanElement) spanElement.style.borderBottom = '2px solid orange';
    }
  }

  public getObjectByname(array: any, name: string) {
    return array.find((item: any) => item?.name === name);
  }

  private getHeaderNews() {
    this.gtrWebService
      .getHeaderNews()
      .pipe(take(1))
      .subscribe((response: any) => {
        if (response.status) {
          const data = response.data.news;
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
              this.headerNews.push({ category, data: newsObj.data[3] });
            }
          }
        }
      },((error:any)=>{

      }));
  }

  
  public callCatchup(): void {
    this.GtrWebStore.select('GtrWeb')
      .pipe(takeUntil(this.unsubscriber$))
      .subscribe((res) => {
        if (res && res.GtrWebOverview) {
          this.catchupData = res.GtrWebOverview.data.radio.catchup;
        }
      });
  }

  public toggleMobileMenu(){
    const overlay = document.querySelector("#overlay_background") as any;
    const mobileMenu = document.querySelector(".mobile_menu_wrapper") as any;
    if(mobileMenu){
      mobileMenu.classList.toggle("translate-mobile-menu")
    }
    this.mobileNavOpen = !this.mobileNavOpen
    if(overlay){
      
      if(this.mobileNavOpen){
        overlay.classList.add("visible")
      }else{
        overlay.classList.remove("visible")
        mobileMenu.classList.remove("translate-mobile-menu")
      }
    }
  }

  public getPodcast(str: string): void {
    this.gtrWebService
      .podcast(this.id.toString(), str)
      .pipe(take(1))
      .subscribe((res) => {
        this.podcasts.push(...res.data);
        this.podcasts = this.podcasts?.slice(0, 4);
        console.log(this.podcasts);
      });
  }

  public slugify(string: string): string {
    try{
      return string
      .toString()
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
    }catch{
      return ""
    }
  }

  public getImage(news: any): string {
    try{
      if (news.data?.image) {
        return news?.data?.image;
      }
      return news?.details?.image;
    }catch{
      return ""
    }
  }

  playStatus(idx): boolean {
    return this.playingStatus;
  }
  
  public playPodcast(e:any, idx: number): void {
    try{
      this.podcasts.forEach((v, i) => {
        if (i != idx) {
          v.status = false;
        }
      });
      this.podcasts[idx].status = !this.podcasts[idx].status;
      // this.podcastService.playOrPause(parameter);
      console.log(this.podcasts[idx]);
      initilializeAudio(e,this.podcasts[idx]?.data?.url)
    }catch{}
  }

  public channels(obj): string {
    try{
      return Object.keys(obj)[0];
    }catch{
      return ""
    }
  }

  public external(obj): any[] {
    try{
      if (obj != '') {
        let f = JSON.parse(obj);
        if (f instanceof Array) {
          return f;
        } else {
          return [];
        }
      } else {
        return [];
      }
    }catch{
      return []
    }
  }

  toggleNavBar($event: any = null) {
    if (!$event) {
      this.isCollapsed = !this.isCollapsed;
      return null;
    }

    if ($event) {
      this.isCollapsed = !this.isCollapsed;
      this.setNavLInk($event);
    }

    const navToggle = document.querySelector('.navbar-toggle') as HTMLElement;
    const navEl = document.querySelector('.navbar-collapse') as HTMLElement;
    if (window.innerWidth <= 768) {
      if (navToggle) {
        navToggle.classList.toggle('collapsed');
        navToggle.setAttribute(
          'aria-expanded',
          `${navToggle.getAttribute('aria-expanded')}`
        );
      }
      if (navEl) {
        navEl.classList.toggle('in');
      }
    }
  }

  //Angulars routerLinkActive could be used , but since we arent marking the anchorLinks, we use localStorage
  setNavLInk($event: any) {
    if ($event) {
      const activeLinks = document.querySelectorAll('.gtr-active') as any;
      for (const activeLink of activeLinks) {
        activeLink.querySelector('span').style.borderBottom = '0px';
        activeLink?.classList.remove('gtr-active');
      }
      const id = $event.target.closest('a')?.id;
      if (id) {
        if (id.length > 0) {
          $event.target.closest('a').classList.add('gtr-active');
          $event.target.closest('a').querySelector('span').style.borderBottom =
            '2px solid orange';
        }
      }
    }
  }

  public toggleMenu(): void {
    var menuToggle = document.querySelector('.toggle-upper i');
    var menu = document.querySelector('.menu');
    if (menuToggle.classList.contains('fa fa-bars')) {
      menuToggle.classList.replace('fa-bars', 'fa-close');
    } else {
      menuToggle.classList.replace('fa-close', 'fa-bars');
    }
    menu.classList.toggle('active');
  }

  public toggleMenuMain(): void {
    var menuToggle = document.querySelector('.toggle');
    var menu = document.querySelector('.menu-upper');
    menuToggle.classList.toggle('active');
    menu.classList.toggle('active');
  }

  public toggleSubMenu($event: any, para: string): void {
    const active = document.querySelectorAll(
      '.menu__toggle-submenu.active'
    ) as any;

    for (const btn of active) {
      if ($event.target.classList == btn.classList) {
        btn.style.transform = 'rotate(0deg)';
        btn.classList.toggle('active');
        var submenu_news = document.querySelector(para);
        submenu_news.classList.toggle('active');

        return null;
      }
      btn.style.transform = 'rotate(0deg)';
      btn.classList.remove('active');
      console.log('removed active from ', btn);
    }

    const activeSub = document.querySelectorAll('.submenu.active') as any;
    for (const subMenu of activeSub) {
      subMenu.classList.remove('active');
    }

    var submenu_news = document.querySelector(para);
    $event.target.classList.toggle('active');
    submenu_news.classList.toggle('active');

    let rotation = 'rotate(45deg)';

    if ($event.target.style.transform === 'rotate(45deg)') {
      rotation = 'rotate(0deg)';
    }
    $event.target.style.transform = rotation;
  }

  public fireme(): void {
    this.toggleMobileMenu()
  }

  public ngOnDestroy(): void {
    this.unsubscriber$.next();
    this.unsubscriber$.complete();
    if (this.intervalTimer) {
      clearInterval(this.intervalTimer);
    }
  }

  public imageadsFcn(): {
    url: string;
    image: string;
    route: string;
    open_in_app: boolean;
  } {
    let ads = [
      {
        url: 'filla-showbiz',
        image: 'ads1.gif',
        route: '/podcast',
        open_in_app: true,
      },
      {
        url: 'gh-trendz',
        image: 'ads7.gif',
        route: '/podcast',
        open_in_app: true,
      },
      {
        url: 'time-with-koo-ntakra',
        image: 'ads3.gif',
        route: '/podcast',
        open_in_app: true,
      },
      {
        url: 'naija-rendezvous',
        image: 'ads4.gif',
        route: '/podcast',
        open_in_app: true,
      },
      {
        url: 'd-mu-ns-m-relationship-show',
        image: 'ads5.gif',
        route: '/podcast',
        open_in_app: true,
      },
      {
        url: 'up-and-coming-artistes-roundtable',
        image: 'ads6.gif',
        route: '/podcast',
        open_in_app: true,
      },
      {
        url: 'the-cubicle',
        image: 'ads8.jpg',
        route: '/podcast',
        open_in_app: true,
      },
      {
        url: 'dj-rok-music-show',
        image: 'ads9.gif',
        route: '/podcast',
        open_in_app: true,
      },
    ];
    let id = Math.random() * ads.length;
    return ads[id | 0];
  }
}
