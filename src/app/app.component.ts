import { Component, OnInit } from '@angular/core';
import { TrackData } from './track-data';
import { TrackBarModel } from './track-bar/track-bar.model';
import { Audio } from './audio/audio';
import { AudioProvider } from './audio/audio-provider';
import * as TWEEN from '@tweenjs/tween.js';

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

  trackBarModelA: TrackBarModel = {
    paused: true,
    currentTime: 0,
    duration: 0,
    volume: 1,
    trackData: null
  };

  trackBarModelB: TrackBarModel = {
    paused: true,
    currentTime: 0,
    duration: 0,
    volume: 1,
    trackData: null
  };
  private _trackBarModel: TrackBarModel;

  private audioA: Audio;
  private audioB: Audio;
  private currentAudio: Audio;
  private currentTrackIndex = 0;
  private crossFade: any;
  private volume = 1;
  private neverPlayed = true;

  constructor(private audioProvider: AudioProvider) {
    this.crossFade = { stop: () => null };
  }

  ngOnInit() {
    this.audioA = this.audioProvider.createAudio();
    this.audioA.src = this.queue[0].src;
    this.currentAudio = this.audioA;
    this._trackBarModel = this.trackBarModelA;
    this.audioA.onPause.subscribe(paused => {
      this.trackBarModelA.paused = paused;
    });
    this.audioA.onTimeUpdate.subscribe(currentTime => {
      this.trackBarModelA.currentTime = currentTime;
    });
    this.audioA.onLoadedMetadata.subscribe(() => {
      this.trackBarModelA.duration = this.audioA.duration;
    });

    this.audioB = this.audioProvider.createAudio();
    this.audioB.onPause.subscribe(paused => {
      this.trackBarModelB.paused = paused;
    });
    this.audioB.onTimeUpdate.subscribe(currentTime => {
      this.trackBarModelB.currentTime = currentTime;
    });
    this.audioB.onLoadedMetadata.subscribe(() => {
      this.trackBarModelB.duration = this.audioB.duration;
    });
  }

  get trackBarModel() {
    return this._trackBarModel;
  }

  switchTrack() {
    let otherAudio: Audio;
    if (this.currentAudio === this.audioA) {
      this.currentAudio = this.audioB;
      this._trackBarModel = this.trackBarModelB;
      otherAudio = this.audioA;
    } else {
      this.currentAudio = this.audioA;
      this._trackBarModel = this.trackBarModelA;
      otherAudio = this.audioB;
    }
    this.currentAudio.src = this.queue[this.currentTrackIndex].src;
    this.currentAudio.currentTime = 0;

    this.currentAudio.play();
    otherAudio.play();
    this.crossFade.stop();

    if (!this.neverPlayed) {
      const toTween = { val: 1 };
      this.crossFade = new TWEEN.Tween(toTween)
        .to({ val: 0 }, 8000)
        .easing(TWEEN.Easing.Quadratic.Out)
        .onUpdate(() => {
          this.currentAudio.volume = (1 - toTween.val) * this.volume;
          otherAudio.volume = toTween.val * this.volume;
        })
        .onComplete(() => otherAudio.pause())
        .start();
    } else {
      this.neverPlayed = false;
      this.currentAudio.volume = this.volume;
      otherAudio.volume = 0;
    }
  }

  playCurrentTrack() {
    this.neverPlayed = false;
    this.currentAudio.play();
  }

  pauseCurrentTrack(): void {
    this.audioA.pause();
    this.audioB.pause();
    this.crossFade.stop();
  }

  onSongSelected(index: number) {
    if (index !== this.currentTrackIndex) {
      this.currentTrackIndex = index;
      this.switchTrack();
    } else {
      this.playCurrentTrack();
    }
  }

  onPlayPauseClick(paused: boolean) {
    paused ? this.playCurrentTrack() : this.pauseCurrentTrack();
  }

  onSeek(time) {
    this.currentAudio.currentTime = time;
  }

  onVolumeChanged(value) {
    this.volume = value;
    this.currentAudio.volume = value;
    this.trackBarModelA.volume = value;
    this.trackBarModelB.volume = value;
  }
}
