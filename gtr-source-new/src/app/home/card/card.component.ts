import { isPlatformBrowser } from '@angular/common';
import {
  Component,
  HostListener,
  Inject,
  Input,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { PostInterface } from 'src/app/_model/all.interface';
import { getNewsCategory } from 'src/app/_model/constants.interface';
import { WindowRef } from 'src/app/_service/windowRef.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent implements OnInit {
  @Input() public news: PostInterface;
  scrHeight: number;
  scrWidth: number;
  mobileTarget: number = environment.mobileTarget;
  constructor(
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
  }
  public getContent(para: string): string {
    let a = para?.replace(/(<([^>]+)>)/gi, '');
    if (a?.length > 250) {
      return (
        a?.slice(0, this.scrWidth >= this.mobileTarget ? 300 : 250) + '...'
      );
    } else {
      return a;
    }
  }
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
}
