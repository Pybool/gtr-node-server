import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArrivalsComponent } from './arrivals.component';

describe('ArrivalsComponent', () => {
  let component: ArrivalsComponent;
  let fixture: ComponentFixture<ArrivalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArrivalsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArrivalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
