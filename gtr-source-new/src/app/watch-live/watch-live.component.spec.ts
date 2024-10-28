import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WatchLiveComponent } from './watch-live.component';

describe('WatchLiveComponent', () => {
  let component: WatchLiveComponent;
  let fixture: ComponentFixture<WatchLiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WatchLiveComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WatchLiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
