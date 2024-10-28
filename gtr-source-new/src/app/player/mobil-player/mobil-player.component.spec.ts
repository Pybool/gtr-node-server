import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobilPlayerComponent } from './mobil-player.component';
declare const $: any;
describe('MobilPlayerComponent', () => {
  let component: MobilPlayerComponent;
  let fixture: ComponentFixture<MobilPlayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MobilPlayerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MobilPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
