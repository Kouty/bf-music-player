import { Component, OnInit } from '@angular/core';
import { TrackData, TRACKS } from './track-data';
import { TrackBarModel } from './track-bar/track-bar.model';
import { Audio } from './audio/audio';
import { AudioProvider } from './audio/audio-provider';
import * as TWEEN from '@tweenjs/tween.js';
import { PlaybackCommand } from './track-bar/playback-command';
import { Random } from './random/random';
import { PlaybackStateCommand } from './track-bar/platyback-state-command';
import { AOrB } from './helpers/a-or-b';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  queue: TrackData[] = TRACKS;
  private crtTrackBarModel: AOrB<TrackBarModel> = new AOrB<TrackBarModel>(
    {
      paused: true,
      currentTime: 0,
      duration: 0,
      volume: 1,
      trackData: null,
      random: false,
      muted: false
    },
    {
      paused: true,
      currentTime: 0,
      duration: 0,
      volume: 1,
      trackData: null,
      random: false,
      muted: false
    }
  );
  public currentTrackIndex = 0;

  private crtAudio: AOrB<Audio>;
  private crossFade: any;
  private volume = 1;
  private noCrossFade = true;
  private randomPlayback = false;
  private muted = false;

  constructor(private audioProvider: AudioProvider) {
    this.crossFade = { stop: () => null };
  }

  ngOnInit() {
    const audioA = this.audioProvider.createAudio();
    const audioB = this.audioProvider.createAudio();
    this.crtAudio = new AOrB(audioA, audioB);

    audioA.src = this.queue[0].src;
    this.crtTrackBarModel.current.trackData = this.queue[0];
    audioA.onPause.subscribe(paused => {
      this.crtTrackBarModel.a.paused = paused;
    });
    audioA.onTimeUpdate.subscribe(currentTime => {
      this.crtTrackBarModel.a.currentTime = currentTime;
    });
    audioA.onLoadedMetadata.subscribe(() => {
      this.crtTrackBarModel.a.duration = audioA.duration;
    });
    const forward = () => {
      this.noCrossFade = true;
      this.onPlaybackChanged(PlaybackCommand.forward);
    };
    audioA.onEnded.subscribe(forward);

    audioB.onPause.subscribe(paused => {
      this.crtTrackBarModel.b.paused = paused;
    });
    audioB.onTimeUpdate.subscribe(currentTime => {
      this.crtTrackBarModel.b.currentTime = currentTime;
    });
    audioB.onLoadedMetadata.subscribe(() => {
      this.crtTrackBarModel.b.duration = audioB.duration;
    });
    audioB.onEnded.subscribe(forward);
  }

  get trackBarModel() {
    return this.crtTrackBarModel.current;
  }

  switchTrack() {
    this.crtAudio.switch();
    this.crtTrackBarModel.switch();

    const trackData = this.queue[this.currentTrackIndex];
    this.crtTrackBarModel.current.trackData = trackData;
    this.crtAudio.current.src = trackData.src;
    this.crtAudio.current.currentTime = 0;

    this.crtAudio.current.play();
    this.crtAudio.other.play();
    this.crossFade.stop();

    if (!this.noCrossFade) {
      const toTween = { current: 0, other: this.crtAudio.other.volume };
      this.crossFade = new TWEEN.Tween(toTween)
        .to({ current: 1, other: 0 }, 8000)
        .easing(TWEEN.Easing.Quadratic.Out)
        .onUpdate(() => {
          this.crtAudio.current.volume = toTween.current * this.volume;
          this.crtAudio.other.volume = toTween.other * this.volume;
        })
        .onComplete(() => this.crtAudio.other.pause())
        .start();
    } else {
      this.noCrossFade = false;
      this.crtAudio.current.volume = this.volume;
      this.crtAudio.other.volume = 0;
    }
  }

  playCurrentTrack() {
    if (this.noCrossFade && this.randomPlayback) {
      this.switchTrack();
    } else {
      this.crtAudio.current.play();
    }
    this.noCrossFade = false;
  }

  pauseCurrentTrack(): void {
    this.crtAudio.current.pause();
    this.crtAudio.other.pause();
    this.crossFade.stop();
    this.crtAudio.current.volume = this.volume;
    this.crtAudio.other.volume = 0;
  }

  onSongSelected(index: number) {
    if (index !== this.currentTrackIndex) {
      this.currentTrackIndex = index;
      this.switchTrack();
    } else {
      this.playing ? this.pauseCurrentTrack() : this.playCurrentTrack();
    }
  }

  onPlayPauseClick(paused: boolean) {
    paused ? this.playCurrentTrack() : this.pauseCurrentTrack();
  }

  onSeek(time) {
    this.crtAudio.current.currentTime = time;
  }

  onVolumeChanged(value: number) {
    this.volume = value;
    this.crtAudio.current.volume = value;
    this.crtTrackBarModel.current.volume = value;
    this.crtTrackBarModel.other.volume = value;
  }

  onPlaybackChanged(command: PlaybackCommand) {
    let trackIndex;

    if (this.randomPlayback) {
      trackIndex = Random.randIntExclusive(0, this.queue.length);
    } else {
      switch (command) {
        case PlaybackCommand.backward:
          trackIndex = (this.queue.length + ((this.currentTrackIndex - 1) % this.queue.length)) % this.queue.length;
          break;
        case PlaybackCommand.forward:
          trackIndex = (this.currentTrackIndex + 1) % this.queue.length;
          break;
      }
    }

    this.currentTrackIndex = trackIndex;
    this.switchTrack();
  }

  onPlaybackStateChanged(state: PlaybackStateCommand) {
    switch (state) {
      case PlaybackStateCommand.random:
        this.randomPlayback = !this.randomPlayback;
        break;
    }

    this.crtTrackBarModel.current.random = this.randomPlayback;
    this.crtTrackBarModel.other.random = this.randomPlayback;
  }

  get playing(): boolean {
    return !this.crtAudio.current.paused;
  }

  onMuteStateChanged() {
    this.muted = !this.muted;
    this.crtTrackBarModel.current.muted = this.muted;
    this.crtTrackBarModel.other.muted = this.muted;
    this.crtAudio.current.muted = this.muted;
    this.crtAudio.other.muted = this.muted;
  }
}
