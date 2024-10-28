import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-watch-live',
  templateUrl: './watch-live.component.html',
  styleUrls: ['./watch-live.component.scss']
})
export class WatchLiveComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    window.localStorage.setItem('gtr-active', 'gtrtv');
  }
  get currentDate():string{
    return new Date().toLocaleDateString('en-us', { weekday:"long", year:"numeric", month:"short", day:"numeric"})
  }

}
