import { AfterViewInit, Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { GTRGeneralService } from '../_service/gtr_general.service';
import { take } from 'rxjs/operators';
import { MapsAPILoader } from '@agm/core';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss']
})
export class WeatherComponent implements OnInit,AfterViewInit {
public today:string=("0" + new Date().getDate()).slice(-2)
public todayIndex:number=0
public days:any[]=[]
public hours:any[]=[]
public weather:any;

title: string = 'AGM project';
  latitude: number;
  longitude: number;
  zoom: number;
  address: string;
  private geoCoder;
  @ViewChild('search') searchElementRef: ElementRef;
  constructor(private api:GTRGeneralService,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone
    ) { }
    ngAfterViewInit():void{
      this.mapsAPILoader.load().then(() => {
        this.setCurrentLocation();
        this.geoCoder = new google.maps.Geocoder;
    
        let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement);
        autocomplete.addListener("place_changed", () => {
          this.ngZone.run(() => {
            let place: google.maps.places.PlaceResult = autocomplete.getPlace();
    
            if (place.geometry === undefined || place.geometry === null) {
              return;
            }
            this.latitude = place.geometry.location.lat();
            this.longitude = place.geometry.location.lng();
            
            this.getWeather(this.latitude,this.longitude )
            
            this.zoom = 12;
          });
        });
      });
    }
  ngOnInit(): void {
    this.getWeather(54.9114822,-1.417365)
    this.daysArray()
    window.localStorage.setItem('gtr-active', 'weather');
    console.log([this.latitude,this.longitude ])
  }

  getWeather(lat,lon){
    this.api.getWeather(lat,lon)
    .pipe(take(1))
    .subscribe(v=>{
      this.weather=v;
      this.hourArray();
      console.log(v)
    })
  }
  
  private setCurrentLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.zoom = 8;
        this.getAddress(this.latitude, this.longitude);
      });
    }
  }
  getAddress(latitude, longitude) {
    this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results, status) => {
      if (status === 'OK') {
        if (results[0]) {
          this.zoom = 12;
          this.address = results[0].formatted_address;
        } else {
          window.alert('No results found');
        }
      } else {
        window.alert('Geocoder failed due to: ' + status);
      }
  
    });
  }
  selectDate(selectde:string,index:number):void{
this.today=selectde
this.todayIndex=index
this.hourArray()
  }
  daysArray():void{
    const today = new Date();
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"
];
const dayNames = ["Sunday","Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
];

    let daysSorted:any[]=[]
    for(var i = 0; i < 6; i++) {
      var newDate = new Date(today.setDate(today.getDate() + 1));
      let nth="th"
      if(newDate.getDate()==1){
        nth="st"
      }else if(newDate.getDate()==2){
        nth="ns"
      }else if(newDate.getDate()==3){
        nth="rd"
      }
      daysSorted.push(
        {
          days:("0" + newDate.getDate()).slice(-2),
          dayNumber:newDate.getDate()+nth,
          month:monthNames[newDate.getMonth()],
          dow:dayNames[newDate.getDay()]
      }
        );
    }
    let nth="th"
      if(new Date().getDate()==1){
        nth="st"
      }else if(new Date().getDate()==2){
        nth="ns"
      }else if(new Date().getDate()==3){
        nth="rd"
      }
    this.days=[ {
      days:("0" + new Date().getDate()).slice(-2),
      dayNumber:new Date().getDate()+nth,
      month:monthNames[new Date().getMonth()],
      dow:dayNames[new Date().getDay()]
  },...daysSorted]
  }
  hourArray():void{
    var hours = [];
    for(var i=0; i < 24; i++) {
      let weather
      if(i<=6){
        weather=this.weather?.daily[this.todayIndex]?.feels_like.night|| ""
      }else if(i<=12){
        weather=this.weather?.daily[this.todayIndex]?.feels_like.morn|| ""
      }else if(i<=18){
        weather=this.weather?.daily[this.todayIndex]?.feels_like.day|| ""
      }else if(i<=24){
        weather=this.weather?.daily[this.todayIndex]?.feels_like.eve || ""
      }
        hours.push({
          title:(i < 10 ? "0" : "") + i + ":00",
        weather:this.convertWeather(weather),
        hour:i
      }
        );
    }
    this.hours=hours
  }
  checkVisible(i):boolean{
if (this.todayIndex==0 && new Date().getHours()>i){
  return false
}else{
  return true
}
  }
  getWeatherInfo(index):any{
    return this.weather.daily[index]
  }
  convertWeather(val):any{
    if(val){
      return (val - 273.15).toFixed(0);
    }else{
      return "";
    }
    
  }
  windDegree(val:number):any{
    let compassSector = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW", "N"];

return compassSector[(val / 22.5).toFixed(0)];
  }
}
