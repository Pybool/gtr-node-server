import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxSmartBannerModule } from '@netcreaties/ngx-smart-banner';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';
// import { FeaturedComponent } from './home/components/featured/featured.component';
import { TodayFeaturedComponent } from './home/components/today-featured/today-featured.component';
import { VideoComponent } from './home/components/video/video.component';
import { LifestyleComponent } from './home/components/lifestyle/lifestyle.component';
import { LatestNewsComponent } from './home/components/latest-news/latest-news.component';
import { AdsComponent } from './home/components/ads/ads.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { CategoryComponent, ReplacePipe } from './category/category.component';
import { ShowComponent } from './show/show.component';
import { SearchComponent } from './search/search.component';
import { GTRGeneralService } from './_service/gtr_general.service';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { GtrWebReducer } from './state/gtr-web.reducer';
import { GtrWebEffects } from './state/gtr-web.effects';
import { HttpClientModule } from '@angular/common/http';
import { PlayerComponent } from './player/player.component';
import { AngMusicPlayerModule } from 'ang-music-player';
import { NgxUiLoaderModule, NgxUiLoaderRouterModule } from 'ngx-ui-loader';
import { PageComponent } from './page/page.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularStickyThingsModule } from '@w11k/angular-sticky-things';
import { MobilPlayerComponent } from './player/mobil-player/mobil-player.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatBottomSheetModule,
  MAT_BOTTOM_SHEET_DEFAULT_OPTIONS,
} from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { RouterModule } from '@angular/router';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { AboutUsComponent } from './about-us/about-us.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { MobileNewsComponent } from './home/components/mobile-news/mobile-news.component';
import { MiniComponent } from './player/mini/mini.component';
import { AdsenseModule } from 'ng2-adsense';
import { NgxNewstickerAlbeModule } from 'ngx-newsticker-albe';
import { ListenLiveComponent } from './listen-live/listen-live.component';
import { HeaderNewComponent } from './header-new/header-new.component';
import { TrendingComponent } from './home/trending/trending.component';
import { CardComponent } from './home/card/card.component';
import { PodcastComponent } from './podcast/podcast.component';
import { PodcastService } from './_service/podcast.service';
import { ScheduleComponent } from './schedule/schedule.component';
import { LoaderComponent } from './home/components/loader/loader.component';
import { ErrorComponent } from './error/error.component';
import {
  NgxGoogleAnalyticsModule,
  NgxGoogleAnalyticsRouterModule,
} from 'ngx-google-analytics';
import { PodcastSingleComponent } from './podcast-single/podcast-single.component';
import { GtrTvComponent } from './gtr-tv/gtr-tv.component';
import { VjsPlayerComponent } from './vjs-player/vjs-player.component';
import { NgxYoutubePlayerModule } from '@hercilio/ngx-youtube-player';
import { WeatherComponent } from './weather/weather.component';
import { AgmCoreModule } from '@agm/core';
import { WatchLiveComponent } from './watch-live/watch-live.component';
import { FlightTrackerComponent } from './flight-tracker/flight-tracker.component';
import { ArrivalsComponent } from './flights/arrivals/arrivals.component';
import { DigitalClockComponent } from './digital-clock/digital-clock.component';
import {
  HttpCacheInterceptorModule,
  useHttpCacheLocalStorage,
} from '@ngneat/cashew';
import { CacheService } from './_service/cacheService.service';
import { PaginationComponent } from './pagination/pagination.component';
import { Header2Component } from './header2/header2.component';
import { HeaderComponent } from './header/header.component';
import { PodcastPlayerComponent } from './podcast-player/podcast-player.component';
import { RouterInterceptorService } from './_service/routerInterceptor';
import { PrizeCarousel } from './raffledraw/prize-carousel/prize-carousel.component';
import { MainComponent } from './raffledraw/main/main.component';
import { RaffleDrawService } from './_service/raffledraw.service';
import { PaymentModalComponent } from './raffledraw/payment-modal/payment-modal.component';
import { WinnersComponent } from './raffledraw/winners/winners.component';
import { AuthService } from './_service/auth.service';
import { CommonModule } from '@angular/common';
import { ClickOutsideDirective } from './directives/country-select.directive';
import { PrizesComponent } from './raffledraw/admin/prizes/prizes.component';
import { RaffleEventComponent } from './raffledraw/admin/raffle-event/raffle-event.component';
import { GLOBAL_HTTP_PROVIDERS } from './global-providers';
import { CustomDropdownComponent } from './raffledraw/custom-dropdown/custom-dropdown.component';
import { GenericWhiteLoaderComponent } from './raffledraw/admin/raffle-event/loader/loader.component';
import { TransactionService } from './_service/transaction.service';
import { GenericCountrySelectComponent } from './raffledraw/main/country-select/country-select.component';
import { SnackBarService } from './_service/snackbar.service';
import { SnackBarComponent } from './raffledraw/snackbar/snackbar.component';
import { YoutubePlayerComponent } from './youtube-player/youtube-player.component';
import { SafeUrlPipe } from './youtube-player/safe-url.pipe';
import { RaffleClaimModalComponent } from './raffledraw/raffle-claim-modal/raffle-claim-modal.component';

@NgModule({
  declarations: [
    ReplacePipe,
    SafeUrlPipe,
    PlayerComponent,
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    FlightTrackerComponent,
    TodayFeaturedComponent,
    VideoComponent,
    LifestyleComponent,
    LatestNewsComponent,
    AdsComponent,
    SidebarComponent,
    CategoryComponent,
    ShowComponent,
    SearchComponent,
    PageComponent,
    MobilPlayerComponent,
    AboutUsComponent,
    ContactUsComponent,
    PrivacyComponent,
    MobileNewsComponent,
    MiniComponent,
    ListenLiveComponent,
    HeaderNewComponent,
    TrendingComponent,
    CardComponent,
    PodcastComponent,
    ScheduleComponent,
    LoaderComponent,
    ErrorComponent,
    PodcastSingleComponent,
    GtrTvComponent,
    VjsPlayerComponent,
    WeatherComponent,
    WatchLiveComponent,
    ArrivalsComponent,
    DigitalClockComponent,
    PaginationComponent,
    Header2Component,
    PodcastPlayerComponent,
    PrizeCarousel,
    MainComponent,
    PaymentModalComponent,
    WinnersComponent,
    PrizesComponent,
    RaffleEventComponent,
    CustomDropdownComponent,
    GenericWhiteLoaderComponent,
    GenericCountrySelectComponent,
    SnackBarComponent,
    YoutubePlayerComponent,
    RaffleClaimModalComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    AppRoutingModule,
    StoreModule.forRoot({}),
    EffectsModule.forRoot([]),
    NgxNewstickerAlbeModule,
    NgxGoogleAnalyticsModule.forRoot('UA-154356692-1'),
    NgxGoogleAnalyticsRouterModule,
    AdsenseModule.forRoot({
      adClient: 'ca-pub-2147054503852134',
      adSlot: 4374512434,
    }),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBTPMz4G4Ml1QYadSB5ftA8jtwDBbBwIcs',
      libraries: ['places'],
    }),
    NgxSmartBannerModule,
    StoreModule.forFeature('GtrWeb', GtrWebReducer),
    EffectsModule.forFeature([GtrWebEffects]),
    HttpClientModule,
    AngMusicPlayerModule,
    NgxUiLoaderModule,
    NgxUiLoaderRouterModule,
    ReactiveFormsModule,
    AngularStickyThingsModule,
    FormsModule,
    CommonModule, ReactiveFormsModule, 
    ClickOutsideDirective,
    BrowserAnimationsModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatIconModule,
    MatExpansionModule,
    MatBottomSheetModule,
    MatListModule,
    RouterModule,
    CarouselModule,
    NgxYoutubePlayerModule.forRoot(),
    HttpCacheInterceptorModule.forRoot(),
  ],
  providers: [
    PodcastService,
    GTRGeneralService,
    AuthService,
    RouterInterceptorService,
    RaffleDrawService,
    TransactionService,
    CacheService,
    SnackBarService,
    useHttpCacheLocalStorage,
    {
      provide: MAT_BOTTOM_SHEET_DEFAULT_OPTIONS,
      useValue: { hasBackdrop: true },
    },
    ...GLOBAL_HTTP_PROVIDERS
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
