import { Component, Input, OnInit } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { PostInterface } from 'src/app/_model/all.interface';

@Component({
  selector: 'app-mobile-news',
  templateUrl: './mobile-news.component.html',
  styleUrls: ['./mobile-news.component.scss'],
})
export class MobileNewsComponent implements OnInit {
  @Input() public news: any[] = [];
  @Input() public video: any[] = [[], []];
  @Input() public totalNews: number = 0;
  public videos: any[] = [];
  constructor() {}
  public getVideoLink(para: string): string {
    let data = JSON.parse(
      para.substring(para.indexOf('{'), para.lastIndexOf('}') + 1)
    );
    if (data?.url) {
      return data?.url;
    } else {
      return 'https://youtu.be/AQL2MOMK3xA';
    }
  }
  ngOnInit(): void {
    this.videos = this.video[0];
    this.videos.concat(this.video[1]);
  }
  public getContent(para: string): string {
    let a = para.replace(/(<([^>]+)>)/gi, '');
    if (a.length > 250) {
      return a.slice(0, 230) + '...';
    } else {
      return a;
    }
  }
  public get total() {
    return parseInt((this.totalNews / 10).toString());
  }

  public getUrl(para: string): string {
    if (para == '') {
      return 'news';
    }
    return para;
  }
  public getName(para: string): string {
    if (para == 'Home') {
      return 'Featured';
    }
    return para;
  }
  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1,
      },
      400: {
        items: 2,
      },
      740: {
        items: 3,
      },
      940: {
        items: 4,
      },
    },
    nav: true,
  };
}
// @ghanaTalksRadio2024
// bdfc506d-55ec-4815-8a87-67fb75610125