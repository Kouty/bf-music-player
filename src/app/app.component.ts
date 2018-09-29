import { Component } from '@angular/core';
import { SongData } from './song-data';
import { TrackBarModel } from './track-bar/track-bar.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  queue: SongData[] = [
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

  trackBarData: TrackBarModel = {
    paused: true,
    currentTime: 0,
    endTime: 60
  };

  onSongSelected(index: number) {
    console.log(index);
  }
}
