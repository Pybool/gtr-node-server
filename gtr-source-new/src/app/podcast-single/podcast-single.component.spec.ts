import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PodcastSingleComponent } from './podcast-single.component';

describe('PodcastSingleComponent', () => {
  let component: PodcastSingleComponent;
  let fixture: ComponentFixture<PodcastSingleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PodcastSingleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PodcastSingleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
