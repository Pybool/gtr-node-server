import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-youtube-player',
  templateUrl: './youtube-player.component.html',
  styleUrls: ['./youtube-player.component.scss'],
})
export class YoutubePlayerComponent implements OnInit {
  @Input() videoId: string = '';
  @Input() thumbnail: string = '';
  @Input() playerVars: any;

  constructor() {}

  ngOnInit(): void {}

  isVisible: boolean = false;

  get videoUrl(): string {
    return `https://www.youtube.com/embed/${this.videoId}`;
  }

  openModal(videoId: string): void {
    this.videoId = videoId;
    this.isVisible = true;
  }

  closeModal(): void {
    this.isVisible = false;
  }
}
