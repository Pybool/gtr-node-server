import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutUsComponent } from './about-us/about-us.component';
import { CategoryComponent } from './category/category.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { ErrorComponent } from './error/error.component';
import { GtrTvComponent } from './gtr-tv/gtr-tv.component';
import { HomeComponent } from './home/home.component';
import { ListenLiveComponent } from './listen-live/listen-live.component';
import { PageComponent } from './page/page.component';
import { PodcastSingleComponent } from './podcast-single/podcast-single.component';
import { PodcastComponent } from './podcast/podcast.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { SearchComponent } from './search/search.component';
import { ShowComponent } from './show/show.component';
import { WeatherComponent } from './weather/weather.component';
import { WatchLiveComponent } from './watch-live/watch-live.component';
import { FlightTrackerComponent } from './flight-tracker/flight-tracker.component';
import { LoginComponent } from './raffledraw/login/login.component';
import { MainComponent } from './raffledraw/main/main.component';
import { WinnersComponent } from './raffledraw/winners/winners.component';
import { PrizesComponent } from './raffledraw/admin/prizes/prizes.component';
import { RaffleEventComponent } from './raffledraw/admin/raffle-event/raffle-event.component';
import { AdminGuard } from './_service/admin-guard.service';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'post/:id',
    component: ShowComponent
  },
  {
    path: 'category/:search',
    component: CategoryComponent
  },
  {
    path: 'search',
    component: SearchComponent
  },
  {
    path: 'page/:id',
    component: PageComponent
  },
  {
    path: 'about-us',
    component: AboutUsComponent
  },{
    path: 'podcast/:id/:title',
    component: PodcastSingleComponent
  }, {
    path: 'podcast/:id',
    component: PodcastComponent
  },{
    path: 'podcast',
    component: PodcastComponent
  },
  {
    path: 'contact-us',
    component: ContactUsComponent
  },
  {
    path: 'weather',
    component: WeatherComponent
  },
  {
    path: 'flights-tracker',
    component: FlightTrackerComponent
  },
  {
    path: 'flights-tracker/:airport/:type',
    component: FlightTrackerComponent
  },
  {
    path: 'raffledraws/login',
    component: LoginComponent
  },
  {
    path: 'raffledraws/play',
    component: MainComponent
  },
  {
    path: 'raffledraws/prizes',
    component: PrizesComponent,
    canActivate: [AdminGuard]
  },

  {
    path: 'raffledraws/create',
    component: RaffleEventComponent,
    canActivate: [AdminGuard]
  },
  {
    path: 'raffledraws/winners',
    component: WinnersComponent
  },
  // {
  //   path: 'raffledraws/account-verification',
  //   title: 'Account Verification',
  //   component: OtpAuthorizeComponent,
  // },
  {
    path: 'schedule',
    component: ScheduleComponent
  }
  ,
  {
    path: 'privacy-policy',
    component: PrivacyComponent
  }
  ,
  {
    path: 'listen-live',
    component: ListenLiveComponent
  },
  {
    path: 'gtr-tv',
    component: GtrTvComponent
  },
  {
    path: 'watch-live',
    component: WatchLiveComponent
  },{
    path: ':id',
    component: ShowComponent
  },
	{ path: '404', component: ErrorComponent },
	{ path: '**', redirectTo: '404' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: false, scrollPositionRestoration: 'enabled', initialNavigation: 'enabledBlocking' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
