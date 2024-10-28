import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodayFeaturedComponent } from './today-featured.component';

describe('TodayFeaturedComponent', () => {
  let component: TodayFeaturedComponent;
  let fixture: ComponentFixture<TodayFeaturedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TodayFeaturedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TodayFeaturedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
