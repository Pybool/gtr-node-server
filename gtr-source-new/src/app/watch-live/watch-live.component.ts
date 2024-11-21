import { Component, OnInit } from '@angular/core';
declare const $: any;
@Component({
  selector: 'app-watch-live',
  templateUrl: './watch-live.component.html',
  styleUrls: ['./watch-live.component.scss'],
})
export class WatchLiveComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    window.localStorage.setItem('gtr-active', 'gtrtv');
  }
  
  get currentDate(): string {
    return new Date().toLocaleDateString('en-us', {
      weekday: 'long',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  ngAfterViewInit() {
    const link =
      'https://player.twitch.tv/?channel=ghanatalksradio&parent=www.ghanatalksradio.com';
    $.get(link, function (response) {
      var html = response;
      var html_src = 'data:text/html;charset=utf-8,' + html;
      $('#iframe').attr('src', html_src);
    });
  }
}
