import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CacheService } from '../_service/cacheService.service';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
})
export class PaginationComponent {
  @Input() data: any; // Total number of items
  @Input() pageSize: number = 10; // Items per page
  @Output() pageChange = new EventEmitter<number>(); // Event for page changes
  private _interval = 0;
  timeRangeString;
  blockFilter: string = 'arrival';
  public lastTimeRangeData: any;
  index:any
  earlierActive =false
  laterActive = false

  constructor(private cacheService: CacheService) {}

  ngOnInit() {
    this.cacheService.getFlightSegments().subscribe((data: any) => {
      this.data = data;
      if (this.data?.data) {
        if (this.data.data.current.length > 0) {
          this.blockFilter = this.data.blockFilter;
          this.timeRangeString = this.generateTimeRangeString(1);
          this.earlierAvailable()
          this.laterAvailable()
        }
      }
    });
  }

  ngAfterViewInit() {}

  goToFlightSection(index) {
    const now = new Date();
    const currentHour = now.getHours();
    const interval = this._interval + index;
    this._interval = interval;
    this.index = index
    this.pageChange.emit(currentHour + interval); // Emit event with new page number
    this.timeRangeString = this.generateTimeRangeString(1);
  }

  earlierAvailable() {
    this.earlierActive =  Number(this.lastTimeRangeData?.startHours) <= 0
  }

  laterAvailable() {
    console.log("Later ", Number(this.lastTimeRangeData?.endHours))
    this.laterActive =  Number(this.lastTimeRangeData?.endHours) > 23 || `${Number(this.lastTimeRangeData?.endHours)}` == '00' || `${Number(this.lastTimeRangeData?.endHours)}` == '0'
  }

  generateTimeRangeString(interval) {
    console.log("Interval ", interval, this.index)
    
    if (this.data.data.current.length == 0) {
      let startHours = (
        Number(this.lastTimeRangeData.startHours) + this.index
      ).toString();
      let endHours = (Number(this.lastTimeRangeData.endHours) + this.index).toString();
      let formattedTimeRangeString = `${this.lastTimeRangeData.startDay} ${this.lastTimeRangeData.startMonth} ${startHours}:${this.lastTimeRangeData.startMinutes} - ${endHours}:${this.lastTimeRangeData.endMinutes}`;

      this.lastTimeRangeData = {
        startDay: this.lastTimeRangeData.startDay,
        startMonth: this.lastTimeRangeData.startMonth,
        startHours,
        startMinutes: this.lastTimeRangeData.startMinutes,
        endHours,
        endMinutes: this.lastTimeRangeData.endMinutes,
      };
      this.earlierAvailable()
      this.laterAvailable()

      return formattedTimeRangeString;
    }

    const now = new Date(
      this.data.data.current[0][this.blockFilter]?.scheduled
    );
    const currentHour = now.getUTCHours();

    // Calculate start and end hours based on current hour and interval
    const startHour = Math.floor(currentHour / interval) * interval;
    const endHour = startHour + interval;

    // Swap start and end hours if interval is negative (descending range)
    let tempStartHour;
    let tempEndHour;
    if (interval < 0) {
      tempStartHour = endHour;
      tempEndHour = startHour;
    } else {
      tempStartHour = startHour;
      tempEndHour = endHour;
    }

    // Format date strings
    const startDateString = `${now.getFullYear()}-${
      now.getMonth() + 1
    }-${now.getDate()} ${tempStartHour.toString().padStart(2, '0')}:00`;
    const endDateString = `${now.getFullYear()}-${
      now.getMonth() + 1
    }-${now.getDate()} ${tempEndHour.toString().padStart(2, '0')}:00`;

    try {
      // Extract day, month, hours, and minutes
      const startDate = new Date(startDateString);
      const endDate = new Date(endDateString);

      let startDay = startDate.getDate();
      const startMonth = startDate.toLocaleDateString('en-US', {
        month: 'short',
      });
      const startHours = startDate.getHours().toString().padStart(2, '0');
      const startMinutes = startDate.getMinutes().toString().padStart(2, '0');
      const endHours = endDate.getHours().toString().padStart(2, '0');
      const endMinutes = endDate.getMinutes().toString().padStart(2, '0');

      // Format the time range string
      if (interval == 0) {
        return `${new Date().getDate()} ${new Date().toLocaleDateString(
          'en-US',
          {
            month: 'short',
          }
        )} ${currentHour}:${'00'} - ${currentHour + 1}:${'00'}`;
      }
      if (startHours == '23') {
        startDay = startDay - 1;
      }

      this.lastTimeRangeData = {
        startDay,
        startMonth,
        startHours,
        startMinutes,
        endHours,
        endMinutes,
      };
      const formattedTimeRangeString = `${startDay} ${startMonth} ${startHours}:${startMinutes} - ${endHours}:${endMinutes}`;

      return formattedTimeRangeString;
    } catch (error) {
      return 'Error generating time range string.';
    }
  }
}
