import { Component, OnInit } from '@angular/core';
import { TrackData } from './track-data';
import { TrackBarModel } from './track-bar/track-bar.model';
import { Audio } from './audio/audio';
import { AudioProvider } from './audio/audio-provider';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  queue: TrackData[] = [
    {
      src: 'https://www.bensound.com/bensound-music/bensound-ukulele.mp3',
      title: 'Ukulele',
      artist: 'Benjamin TISSOT',
      album: 'Bensound'
    },
    {
      src: 'https://www.bensound.com/bensound-music/bensound-summer.mp3',
      title: 'Summer',
      artist: 'Benjamin TISSOT',
      album: 'Bensound'
    }
  ];

  trackBarModel: TrackBarModel = {
    paused: true,
    currentTime: 0,
    duration: 0
  };

  private currentAudio: Audio;
  private currentTrackIndex = 0;

  constructor(private audioProvider: AudioProvider) {
  }

  ngOnInit() {
    this.currentAudio = this.audioProvider.createAudio();
    this.currentAudio.onPause.subscribe(paused => {
      this.trackBarModel.paused = paused;
    });
    this.currentAudio.onTimeUpdate.subscribe(currentTime => {
      this.trackBarModel.currentTime = currentTime;
    });
    this.currentAudio.onLoadedMetadata.subscribe(() => {
      this.trackBarModel.duration = this.currentAudio.duration;
    });
  }

  playCurrentTrack(): Promise<void> {
    this.currentAudio.src = this.queue[this.currentTrackIndex].src;
    return this.currentAudio.play();
  }

  pauseCurrentTrack(): void {
    this.currentAudio.pause();
  }

  onSongSelected(index: number) {
    this.currentTrackIndex = index;
    this.playCurrentTrack();
  }

  onPlayPauseClick(paused: boolean) {
    paused ? this.playCurrentTrack() : this.pauseCurrentTrack();
  }
}
