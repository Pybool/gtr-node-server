import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RaffleClaimModalComponent } from './raffle-claim-modal.component';

describe('RaffleClaimModalComponent', () => {
  let component: RaffleClaimModalComponent;
  let fixture: ComponentFixture<RaffleClaimModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RaffleClaimModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RaffleClaimModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
