import { Component, Input, OnInit } from '@angular/core';
import { carouselInit } from './script';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-prize-carousel',
  templateUrl: './prize-carousel.component.html',
  styleUrls: ['./prize-carousel.component.scss']
})
export class PrizeCarousel implements OnInit {

  @Input() prizes: any = []
  public serverUrl: string = environment.nodeApi;

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(){
    carouselInit()
  }

  getPrizeImage(prize:any): string {
    return prize?.image ? this.serverUrl + prize.image.replace('public', '') : '';
  }

}
