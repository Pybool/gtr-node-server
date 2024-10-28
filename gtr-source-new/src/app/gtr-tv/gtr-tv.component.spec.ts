import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GtrTvComponent } from './gtr-tv.component';

describe('GtrTvComponent', () => {
  let component: GtrTvComponent;
  let fixture: ComponentFixture<GtrTvComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GtrTvComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GtrTvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
