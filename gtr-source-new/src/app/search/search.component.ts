import { AfterViewInit, Component, OnInit } from '@angular/core';
import { UntypedFormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import {
  CategoryViewInterface,
  PostInterface,
  SearchResultInterface,
} from '../_model/all.interface';
import { GTRGeneralService } from '../_service/gtr_general.service';
// import { generateHash, generateRequestId } from './tester';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit, AfterViewInit {
  public id: number;
  public formControl: UntypedFormControl = new UntypedFormControl(
    null,
    Validators.required
  );
  public search: string = '';
  public loader1: boolean = false;
  public loader2: boolean = false;
  public searchText: string = '';
  public data: PostInterface[] = [];
  constructor(
    private activatedRoute: ActivatedRoute,
    private route: Router,
    private api: GTRGeneralService
  ) {
    this.route.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
  }

  ngOnInit(): void {
    this.id = 1;
    this.data = [];
    window.localStorage.setItem('gtr-active', 'search');
  }

  ngAfterViewInit() {
    this.toggleShowSearchInput();
  }



  public searchSubmit(): void {
    this.getNews();
  }

  public toggleShowSearchInput(close: boolean = false) {
    setTimeout(() => {
      const searchOverlay = document.querySelector(
        '#overlay_background_search'
      ) as any;
      if (searchOverlay) {
        if (close) {
          return searchOverlay.classList.remove('visible');
        }
        if (Array.from(searchOverlay.classList).includes('visible')) {
          searchOverlay.classList.remove('visible');
        } else {
          searchOverlay.classList.add('visible');
        }
      }
    }, 200);
  }

  getNews(): void {
    this.api
      .newsCheck(this.search, this.id)
      .pipe(take(1))
      .subscribe(
        (res: SearchResultInterface) => {
          this.loader1 = false;
          this.loader2 = false;

          this.data.push(...res.data);
          this.toggleShowSearchInput(true);
          if (this.data?.length > 0) {
            // this.searchText = 'Search Result';
          } else {
            // this.searchText = 'No result Found';
          }
        },
        (err) => {}
      );
  }

  public searchItem(): void {
    if (this.searchText?.trim().length > 0) {
      this.loader1 = true;
      this.id = 1;
      this.search = this.searchText;
      this.data = [];
      this.getNews();
    }
  }

  public loadMore(): void {
    this.loader2 = true;
    this.id++;
    this.getNews();
  }
}
