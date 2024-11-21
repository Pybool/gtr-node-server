import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class YoutubeService {
  apiKey: string = environment.kYouTubeApiKey;
  YOUTUBE_CHANNEL_ID = environment.kYoutubeChannelId
  baseUrl = environment.kBaseUrl

  constructor(public http: HttpClient) {}

  getVideosForChanel(nextPageToken: string | null = null): Observable<any> {
    // Base URL for fetching videos
    let url = `https://www.googleapis.com/youtube/v3/search?key=${this.apiKey}&channelId=${environment.kYoutubeChannelId}&order=date&part=snippet&type=video,id&maxResults=10`;
  
    // Append pageToken if nextPageToken is provided
    if (nextPageToken) {
      url += `&pageToken=${nextPageToken}`;
    }
  
    return this.http.get(url);
  }
  

  getPlayListItems(playlistId: string, pageToken: string, maxResults: string) {
    const params = new HttpParams()
      .set('part', 'snippet')
      .set('playlistId', playlistId)
      .set('maxResults', maxResults)
      .set('pageToken', pageToken)
      .set('key', this.apiKey);

    return this.http.get(`${this.baseUrl}/playlistItems`, { params });
  }

  getPlaylistList(pageToken: string, maxResults: string){
    const params = new HttpParams()
      .set('part', 'snippet')
      .set('maxResults', maxResults)
      .set('pageToken', pageToken)
      .set('key', this.apiKey)
      .set('channelId', this.YOUTUBE_CHANNEL_ID);

    return this.http.get(`${this.baseUrl}/playlists`, { params });
  }
}
