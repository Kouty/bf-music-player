import { Component, OnInit } from '@angular/core';
import { TrackData } from './track-data';
import { TrackBarModel } from './track-bar/track-bar.model';
import { HtmlAudio } from './audio/html-audio';
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
    endTime: 60
  };

  private currentAudio: HtmlAudio;
  private currentTrack: TrackData;

  constructor(private audioProvider: AudioProvider) {
  }

  ngOnInit() {
    // this.currentAudio = this.audioProvider.createAudio();
    // this.currentAudio.onPause().subscribe(() => {
    //   this.currentTrack.paused = false;
    // });
  }

  playTrack(trackData) {
    // this.currentTrack = trackData;
    // this.currentTrackAudio.src = trackData.src;
    // this.currentTrackAudio.play();

    // this.trackBarModel = {
    //   paused: false,
    //   currentTime: 0,
    //   endTime: 60
    // };
  }

  onSongSelected(index: number) {
    console.log(index);
  }
}
