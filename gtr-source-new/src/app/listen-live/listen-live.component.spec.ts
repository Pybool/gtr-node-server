import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListenLiveComponent } from './listen-live.component';

describe('ListenLiveComponent', () => {
  let component: ListenLiveComponent;
  let fixture: ComponentFixture<ListenLiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListenLiveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListenLiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
