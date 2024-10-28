import { AfterViewInit, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-digital-clock',
  templateUrl: './digital-clock.component.html',
  styleUrls: ['./digital-clock.component.scss']
})
export class DigitalClockComponent implements OnInit, AfterViewInit {

  private customWindow: any = window;

  constructor() { }

  ngOnInit(): void {
    // this.customWindow.clock()
  }

  ngAfterViewInit(): void {
      
  }

}
