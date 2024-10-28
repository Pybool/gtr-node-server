import { isPlatformBrowser } from '@angular/common';
import {
  Component,
  ElementRef,
  HostListener,
  Inject,
  OnInit,
  PLATFORM_ID,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { take, takeUntil } from 'rxjs/operators';
import {
  LandingInterface,
  LandingResponseInterface,
  PostInterface,
  SingleViewInterface,
} from '../_model/all.interface';
import { GTRGeneralService } from '../_service/gtr_general.service';
import { WindowRef } from '../_service/windowRef.service';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
declare const $: any;
@Component({
  selector: 'app-show',
  templateUrl: './show.component.html',
  styleUrls: ['./show.component.scss'],
})
export class ShowComponent implements OnInit {
  public id: string | null = null;
  mainData: any;
  public asideCountData: any[] = [];
  public singleData: SingleViewInterface;
  public errorPage: boolean = false;
  public loader: boolean = true;
  public loadembed: boolean = true;
  private unsubscriber$ = new Subject<void>();
  public headerNews: any[] = [];
  public headerData: any[] = [];
  public popularLoader: boolean = false;
  public trending: { name: string; data: PostInterface }[] = [];
  public landingData?: LandingInterface | any;
  @ViewChild('patientDDL') patientDDL: ElementRef;
  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    private windowRef: WindowRef,
    private activatedRoute: ActivatedRoute,
    private meta: Meta,
    private route: Router,
    private api: GTRGeneralService,

    public GtrWebStore: Store<any>
  ) {
    activatedRoute.params.subscribe((params) => {
      this.setupComponent(params['id']);
    });
  }
  setupComponent(someParam) {
    this.loadembed = true;
    this.loader = true;
    this.id = someParam;
    if (this.id) {
      this.getNews();
    } else {
      this.route.navigate(['/']);
    }
  }
  ngOnInit(): void {
    this.getOverview();
    this.getAsideCountData();
    this.getHeaderNews();
  }

  public getAsideCountData() {
    this.GtrWebStore.select('GtrWeb')
      .pipe(takeUntil(this.unsubscriber$))
      .subscribe((res) => {
        if (res && res.GtrWebOverview) {
          this.asideCountData = res.GtrWebOverview.data.footer;
        }
      });
  }

  openExternal(url: string) {
    window.open(url, '_blank');
  }

  get currentUrl(): string {
    if (isPlatformBrowser(this.platformId)) {
      return this.windowRef.nativeWindow.location.href;
    }
    return '';
  }
  get encodeCurrentUrl(): string {
    if (isPlatformBrowser(this.platformId)) {
      return encodeURIComponent(this.windowRef.nativeWindow.location.href);
    }
    return '';
  }
  ngOnChanges(changes: SimpleChanges) {}
  ngDoCheck() {
    if (
      this.patientDDL?.nativeElement?.classList.contains('post-content') &&
      this.loadembed
    ) {
      this.renderHTML();
    }
  }
  public getText(para): string {
    return encodeURIComponent(para).replace(/%20/g, '+');
  }
  public renderHTML() {
    $('.wp-block-embed__wrapper').each(function () {
      var str = $(this).html();
      if (str.search('facebook.com') > -1) {
        //FACEBOOK EMBED IMPLEMENTATION
        (function (d, s, id) {
          var js,
            fjs = d.getElementsByTagName(s)[0];
          if (d.getElementById(id)) return;
          js = d.createElement(s);
          js.id = id;
          js.src = '//connect.facebook.net/en_US/all.js#xfbml=1';
          fjs.parentNode.insertBefore(js, fjs);
        })(document, 'script', 'facebook-jssdk');
        $(this).html(
          '<div class="fb-post" data-href="' +
            $(this).html().trim() +
            '"></div>'
        );
      } else if (str.search('twitter.com') > -1) {
        // usetwitter($(this))
        let url = $(this).html().trim();
        var piy = '';
        var arr = url.split('/');
        for (let i = 0; i < arr.length; i++) {
          if (arr[i] == 'status' || arr[i] == 'timelines') {
            piy = arr[i + 1];
            break;
          }
        }
        // $(this).html('<div class="tweet" id="'+piy+'"></div>')
        $(this).html(`<iframe border=0 frameborder=0 height='450px' width='100%'
        src="https://twitframe.com/show?url=${encodeURIComponent(
          str
        )}"></iframe>`);

        /* find all iframes with ids starting with "tweet_" */
        $("iframe[id^='tweet_']").load(function () {
          this.contentWindow.postMessage(
            { element: this.id, query: 'height' },
            'https://twitframe.com'
          );
        });
      } else if (str.search('instagram.com') > -1) {
        // useinstagram($(this))
        let url = $(this).html().trim();
        let cov = '';
        var arr = url.split('/');
        for (let i = 0; i < arr.length; i++) {
          if (arr[i] == 'p') {
            cov = cov + arr[i] + '/' + arr[i + 1] + '/embed/';
            break;
          } else {
            cov = cov + arr[i] + '/';
          }
        }

        $(this).html(
          `<iframe width="320" height="418" src="${cov}" frameborder="0"></iframe>`
        );
      } else if (str.search('youtu') > -1) {
        //YOUTUBE EMBED IMPLEMENTATION
        var ID = '';
        let url = $(this).html().trim();
        url = url
          .replace(/(>|<)/gi, '')
          .split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
        if (url[2] !== undefined) {
          ID = url[2].split(/[^0-9a-z_\-]/i);
          ID = ID[0];
        } else {
          ID = url;
        }
        $(this).html(
          '<br><iframe width="100%" height="415" src="https://www.youtube.com/embed/' +
            ID +
            '" ></iframe>'
        );
      }
    });
    this.loadembed = false;
  }
  public getContent(para: string): string {
    let a = para.replace(/(<([^>]+)>)/gi, '');
    if (a.length > 250) {
      return a.slice(0, 120) + '...';
    } else {
      return a;
    }
  }
  public getNews() {
    this.api
      .view(this.id)
      .pipe(take(1))
      .subscribe(
        (res) => {
          if (res.data.post.length <= 0) {
            this.errorPage = true;
          }
          this.meta.addTag({
            name: 'description',
            content: `Ghanatalksradio.com - ${res.data.post[0].post_title.slice(
              0,
              100
            )}`,
          });
          //this.meta.addTag({name: 'keywords', content: 'gtr, GTR, ghana, ghanatalksradio, radio, ghanatalks, party, News, ghana news, election, news update'})

          this.meta.addTag({
            property: 'og:title',
            content: `${res.data.post[0].post_title.slice(0, 35)}`,
          });
          this.meta.addTag({
            property: 'og:url',
            content: `https://www.ghanatalksradio.com/${this.id}`,
          });
          this.meta.addTag({
            property: 'og:description',
            content: `${res.data.post[0].post_title.slice(0, 65)}`,
          });
          this.meta.addTag({
            property: 'og:image',
            content: `${res.data.img[0]}`,
          });
          this.meta.addTag({ property: 'og:type', content: `article` });
          //this.meta.addTag({name: 'twitter:card', content: `${res.data.post[0].post_title}`})
          this.meta.addTag({
            name: 'twitter:card',
            content: `summary_large_image`,
          });

          res.data.othernews;
          this.singleData = res;
          this.loader = false;
        },
        () => {}
      );
  }

  public processString(parameter): string {
    var find = 'href="https://wordpress.ghanatalksradio.com/';
    var re = new RegExp(find, 'g');

    let str = parameter.replace(re, 'href="' + '/');
    var htmlObject = document.createElement('div');
    htmlObject.innerHTML = str;
    var embeded = htmlObject.querySelectorAll('.wp-block-embed__wrapper');
    let findText: string[] = [];
    embeded.forEach((v) => {
      if (v.innerHTML.indexOf('https://wordpress.ghanatalksradio.com/') >= 0) {
        findText.push(v.innerHTML);
      }
    });
    findText.forEach((v) => {
      let reformed = v.replace('https://wordpress.ghanatalksradio.com/', '/');
      str = str.replace(
        v,
        `<a href="${reformed}">https://www.ghanatalksradio.com${reformed}</a>`
      );
    });
    return str;
  }
  @HostListener('click', ['$event'])
  onClick(event: MouseEvent) {
    // If we don't have an anchor tag, we don't need to do anything.
    if (event.target instanceof HTMLAnchorElement === false) {
      return;
    }
    // Prevent page from reloading
    event.preventDefault();
    let target = <HTMLAnchorElement>event.target;
    // Navigate to the path in the link
    this.route.navigate([target.pathname]);
  }
  goToLink(url: string) {
    if (isPlatformBrowser(this.platformId)) {
      switch (url) {
        case 'FACEBOOK':
          this.windowRef.nativeWindow.open(
            `https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fwww.ghanatalksradio.com%2F${this.id}&amp;src=sdkpreparse`,
            '_blank'
          );
          break;
        case 'TWITTER':
          this.windowRef.nativeWindow.open(
            `http://twitter.com/share?text=${this.singleData.data.post[0].post_title}&url=https://www.ghanatalksradio.com/${this.id}`,
            '_blank'
          );
          break;
        case 'LINKEDIN':
          this.windowRef.nativeWindow.open(
            `https://www.linkedin.com/sharing/share-offsite/?url=https://www.ghanatalksradio.com/${this.id}`,
            '_blank'
          );
          break;
        case 'EMAIL':
          this.windowRef.nativeWindow.href = `mailto:?subject={${this.singleData.data.post[0].post_title}}&body=https://www.ghanatalksradio.com/${this.id}`; // add the links to
      }
    }
  }

  public getOverview(): void {
    this.api
      .landingNews()
      .pipe(take(1))
      .subscribe(
        (res: LandingResponseInterface) => {
          this.landingData = res.data?.news[0];
          console.log(this.landingData);
        },
        () => {}
      );
  }

  private getObjectByname(array: any, name: string) {
    return array.find((item: any) => item.name === name);
  }

  private getHeaderNews() {
    this.popularLoader = true;
    this.api
      .getHeaderNews()
      .pipe(take(1))
      .subscribe((response: any) => {
        if (response.status) {
          this.popularLoader = false;
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
              this.headerNews.push({
                category,
                data: newsObj.data[
                  this.generateRandomIndex(newsObj.data.length)
                ],
              });
            }
          }
          console.log('this.headerNews ', this.headerNews);
        }
      });
  }

  private generateRandomIndex(end: number = 4) {
    return Math.floor(Math.random() * end + 1);
  }
}
