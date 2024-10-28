import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
providedIn: 'root'
})
export class YoutubeService {

apiKey : string = 'AIzaSyACh6FZHOEtKsdGTykNFBm8kqfLy_Np3AE';

constructor(public http: HttpClient) { }

getVideosForChanel(nextPage:string): Observable<any> {
let url = 'https://www.googleapis.com/youtube/v3/search?key=' + this.apiKey + '&channelId=UCmN2CYTXGwEzvpI1TK37Jmg&order=date&part=snippet &type=video,id&maxResults=10'
nextPage
return this.http.get(url)
  .pipe(map((res) => {
    return res;
  }))
}}