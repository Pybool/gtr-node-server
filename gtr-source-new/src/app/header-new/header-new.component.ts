import { isPlatformBrowser } from '@angular/common';
import {
  Component,
  HostListener,
  Inject,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { WindowRef } from '../_service/windowRef.service';

@Component({
  selector: 'app-header-new',
  templateUrl: './header-new.component.html',
  styleUrls: ['./header-new.component.scss'],
})
export class HeaderNewComponent implements OnInit {
  scrHeight: number;
  scrWidth: number;
  public intervalTimer;
  showBar: boolean = false;
  mobileTarget: number = environment.mobileTarget;
  public dropdownMenu: string;
  public imageads: {
    url: string;
    image: string;
    route: string;
    open_in_app: boolean;
  };
  public catchupData: any[] = [];
  private unsubscriber$ = new Subject<void>();
  constructor(
    public GtrWebStore: Store<any>,
    @Inject(PLATFORM_ID) private platformId: any,
    private windowRef: WindowRef
  ) {}
  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
    if (isPlatformBrowser(this.platformId)) {
      this.scrHeight = this.windowRef.nativeWindow.innerHeight;
      this.scrWidth = this.windowRef.nativeWindow.innerWidth;
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
  public toggleSubMenu(para: string): void {
    var submenuNews = document.querySelector('.menu__toggle-submenu');
    var submenu_news = document.querySelector(para);
    submenuNews.classList.toggle('active');
    submenu_news.classList.toggle('active');
  }
  fireme(): void {
    var menuToggle = document.querySelector('.toggle');
    if (menuToggle.classList.contains('active')) {
      this.toggleMenu();
    }
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

/* <script>
    function toggleMenu(){
       
    }

    function toggleSubMenuNews(){
        var submenuNews = document.querySelector(".menu__toggle-submenu");
        var submenu_news = document.querySelector('.submenu--news');
        submenuNews.classList.toggle("active");
        submenu_news.classList.toggle("active");
    }

    function toggleSubMenuPodcast(){
        var submenuPodcast = document.querySelector(".menu__toggle-submenu");
        var submenu_podcast = document.querySelector('.submenu--arts-life');
        submenuPodcast.classList.toggle("active");
        submenu_podcast.classList.toggle("active");
    }
    function toggleSubMenuLifestyle(){
        var submenuLifestyle = document.querySelector(".menu__toggle-submenu");
        var submenu_lifestyle = document.querySelector('.submenu--music');
        submenuLifestyle.classList.toggle("active");
        submenu_lifestyle.classList.toggle("active");
    }
</script> */
