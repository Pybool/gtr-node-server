import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RaffleEventComponent } from './raffle-event.component';

describe('RaffleEventComponent', () => {
  let component: RaffleEventComponent;
  let fixture: ComponentFixture<RaffleEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RaffleEventComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RaffleEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
