import {
  Component,
  HostListener,
  Inject,
  PLATFORM_ID,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  NavigationStart,
  Router,
} from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MobilPlayerComponent } from './player/mobil-player/mobil-player.component';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { environment } from 'src/environments/environment';
import { GTtrHeaderOverviewAction } from './state/gtr-web.action';
import { Store } from '@ngrx/store';
import { Meta, Title } from '@angular/platform-browser';
import { OneSignal } from 'onesignal-ngx';
import {
  NgxSmartBannerPlatform,
  NgxSmartBannerService,
} from '@netcreaties/ngx-smart-banner';
import { WindowRef } from './_service/windowRef.service';
import { isPlatformBrowser } from '@angular/common';
import { RouterInterceptorService } from './_service/routerInterceptor';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'gtrweb';
  public intervalTimer;
  public blurstatus: number = 10;
  public secondHeader: boolean = false;
  public defaultTags: { name: string; content: string }[] = [
    { name: 'author', content: 'ghanatalksradio' },
    { name: 'apple-itunes-app', content: 'app-id=1511977360' },
    { name: 'google-play-app', content: 'app-id=com.ghanatalksradio' },
    {
      name: 'keywords',
      content:
        'gtr, GTR, ghana, ghanatalksradio, radio, ghanatalks, party, News, ghana news, election, news update',
    },
  ];
  private sub = this.router.events
    .pipe(
      filter((event) => event instanceof NavigationEnd),
      map((event) => event as NavigationEnd)
    )
    .subscribe((event) => {
      let url: string[] = event.url.split('/');
      if (url.length > 0) var title = url[url.length - 1];
      if (title == '') {
        this.setTitle('GhanaTalksRadio | giving the youth a voice');
      } else {
        this.setTitle(
          title
            .split('-')
            .join(' ')
            .replace(/\w\S*/g, function (txt) {
              return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            }) + ' - Ghanatalksradio.com'
        );
      }
    });
  scrHeight: number;
  scrWidth: number;
  mobileTarget: number = environment.mobileTarget;
  @ViewChild('vcrcontainer', { read: ViewContainerRef }) _vcr;
  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    private readonly ngxSmartBannerService: NgxSmartBannerService,
    private readonly viewContainerRef: ViewContainerRef,
    private meta: Meta,
    private maintitle: Title,
    public GtrWebStore: Store<any>,
    private _bottomSheet: MatBottomSheet,
    private ngxService: NgxUiLoaderService,
    private router: Router,
    private windowRef: WindowRef,
    private activatedRoute: ActivatedRoute,
    private oneSignal: OneSignal,
    private routerInterceptorService: RouterInterceptorService
  ) {
    //https://github.com/RFreij/ngx-smart-banner
    this.ngxSmartBannerService.initialize({
      viewContainerRef: this.viewContainerRef,
      daysHidden: 15,
      daysReminder: 90,
      title: 'GhanaTalksRadio',
      author: 'GTR',
      icon: {
        ios: 'https://www.ghanatalksradio.com/assets/ghanatalksradio/images/gtr-logo.png',
        android:
          'https://www.ghanatalksradio.com/assets/ghanatalksradio/images/gtr-logo.png',
      },
      closeLabel: 'Close',
      buttonLabel: 'View',
      enabledPlatforms: [
        NgxSmartBannerPlatform.Android,
        NgxSmartBannerPlatform.IOS,
      ],
      buttonUrl: {
        ios: 'https://apps.apple.com/gb/developer/ghana-talks-radio-ltd/id1511977359',
        android:
          'https://play.google.com/store/apps/details?id=com.ghanatalksradio',
      },
      hideRating: true,
    });
    /*  this.oneSignal.init({
      appId: "206ba97e-7a2d-44bf-966d-3d67a488b64b",
  }); */
  }
  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
    if (isPlatformBrowser(this.platformId)) {
      this.scrHeight = this.windowRef.nativeWindow.innerHeight;
      this.scrWidth = this.windowRef.nativeWindow.innerWidth;
    }
  }
  ngOnDestroy() {
    if (this.intervalTimer) {
      clearInterval(this.intervalTimer);
    }
    this.sub.unsubscribe();
  }
  onActivate(event) {
    if (isPlatformBrowser(this.platformId)) {
      this.windowRef.nativeWindow.scroll(0, 0);
    }

    //or document.body.scrollTop = 0;
    //or document.querySelector('body').scrollTo(0,0)
  }
  public setTitle(newTitle: string) {
    this.maintitle.setTitle(newTitle);
  }

  togglePlayState() {
    const activePlaying = WindowRef.prototype.nativeWindow.activePlaying;
    const audioContext = WindowRef.prototype.nativeWindow.audioContext;
    const pauseBtnIcon = document.querySelector('._pause') as any;
    const playBtnIcon = document.querySelector('._play') as any;
    const playAudioBtn = document.querySelector('.audio-player-button') as any;
    if (playAudioBtn) {
      if (activePlaying) {
        pauseBtnIcon.style.display = 'none';
        playBtnIcon.style.display = 'block';
      } else {
        pauseBtnIcon.style.display = 'block';
        playBtnIcon.style.display = 'none';
      }
      return playAudioBtn.click();
    }
    if (activePlaying == true || activePlaying == false) {
      if (pauseBtnIcon) {
        if (pauseBtnIcon.style.display === 'block') {
          audioContext.pause();
          pauseBtnIcon.style.display = 'none';
          playBtnIcon.style.display = 'block';
        } else {
          audioContext.play();
          pauseBtnIcon.style.display = 'block';
          playBtnIcon.style.display = 'none';
        }
      }
    }
  }

  ngOnInit() {
    // const newdep = window.localStorage.getItem('newdep')
    // if(!newdep){
    //     window.location.reload(true); // Set the second argument to true to bypass cache
    //     window.localStorage.setItem('newdep', '1')
    // }
    this.routerInterceptorService.onRouterLinkClicked();
    let url: string[] = this.router.url.split('/');
    if (url.length > 0) var title = url[url.length - 1];
    if (title == '') {
      console.log(this.router.routerState.snapshot.url);
      this.setTitle('GhanaTalksRadio | giving the youth a voice');
    } else {
      this.setTitle('GhanaTalksRadio | ' + title.replace('-', ' '));
    }
    this.meta.addTags(this.defaultTags);
    if (isPlatformBrowser(this.platformId)) {
      this.ngxService.start(); // start foreground spinner of the master loader with 'default' taskId
      // Stop the foreground loading after 5s
      this.intervalTimer = setInterval(() => {
        this.GtrWebStore.dispatch(new GTtrHeaderOverviewAction());
      }, 1000000);
      setTimeout(() => {
        this.ngxService.stop(); // stop foreground spinner of the master loader with 'default' taskId
      }, 3000);
    }
    this.GtrWebStore.dispatch(new GTtrHeaderOverviewAction());

    this.getScreenSize();
  }
}
