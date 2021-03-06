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
  private crtTrackBarModel: AOrB<TrackBarModel>;
  public currentTrackIndex = -1;

  private crtAudio: AOrB<Audio>;
  private crossFade: any;
  private volume = 1;
  private noCrossFade = true;
  private randomPlayback = false;
  private repeat = false;
  private muted = false;
  private trackHistory: number[] = [];

  constructor(private audioProvider: AudioProvider) {
    this.crossFade = { stop: () => null };
    const me = this;
    this.crtTrackBarModel = new AOrB<TrackBarModel>(
      {
        paused: true,
        currentTime: 0,
        duration: 0,
        get trackData(): TrackData {
          return me.queue[Math.max(me.currentTrackIndex, 0)];
        },
        get volume(): number {
          return me.volume;
        },
        get random() {
          return me.randomPlayback;
        },
        get muted() {
          return me.muted;
        },
        get repeat() {
          return me.repeat;
        },
        get backEnabled() {
          return me.trackHistory.length >= 2;
        }
      },
      {
        paused: true,
        currentTime: 0,
        duration: 0,
        get trackData(): TrackData {
          return me.queue[Math.max(me.currentTrackIndex, 0)];
        },
        get volume(): number {
          return me.volume;
        },
        get random() {
          return me.randomPlayback;
        },
        get muted() {
          return me.muted;
        },
        get repeat() {
          return me.repeat;
        },
        get backEnabled() {
          return me.trackHistory.length >= 2;
        }
      }
    );
  }

  ngOnInit() {
    const audioA = this.audioProvider.createAudio();
    const audioB = this.audioProvider.createAudio();
    this.crtAudio = new AOrB(audioA, audioB);

    audioA.onPause.subscribe(paused => {
      this.crtTrackBarModel.a.paused = paused;
    });
    audioA.onTimeUpdate.subscribe(currentTime => {
      this.crtTrackBarModel.a.currentTime = currentTime;
    });
    audioA.onLoadedMetadata.subscribe(() => {
      this.crtTrackBarModel.a.duration = audioA.duration;
    });
    const forward = endedAudio => {
      if (this.crtAudio.current === endedAudio) {
        this.noCrossFade = true;
        this.onPlaybackChanged(PlaybackCommand.forward);
      }
    };
    audioA.onEnded.subscribe(() => forward(audioA));

    audioB.onPause.subscribe(paused => {
      this.crtTrackBarModel.b.paused = paused;
    });
    audioB.onTimeUpdate.subscribe(currentTime => {
      this.crtTrackBarModel.b.currentTime = currentTime;
    });
    audioB.onLoadedMetadata.subscribe(() => {
      this.crtTrackBarModel.b.duration = audioB.duration;
    });
    audioB.onEnded.subscribe(() => forward(audioB));
  }

  get trackBarModel() {
    return this.crtTrackBarModel.current;
  }

  switchTrack() {
    this.crtAudio.switch();
    this.crtTrackBarModel.switch();

    if (this.currentTrackIndex === -1) {
      this.currentTrackIndex = this.randomPlayback ? Random.randIntExclusive(0, this.queue.length) : 0;
    }

    if (this.currentTrackIndex !== this.trackHistory[this.trackHistory.length - 1]) {
      this.trackHistory.push(this.currentTrackIndex);
    }
    const trackData = this.queue[this.currentTrackIndex];
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
    if (this.noCrossFade) {
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
  }

  onPlaybackChanged(command: PlaybackCommand) {
    let trackIndex;

    if (command === PlaybackCommand.backward) {
      if (this.trackHistory.length >= 2) {
        this.trackHistory.pop();
        trackIndex = this.trackHistory.pop();
      }
    } else if (this.randomPlayback) {
      trackIndex = Random.randIntExclusive(0, this.queue.length);
    } else if (this.repeat) {
      trackIndex = this.currentTrackIndex;
    } else if (command === PlaybackCommand.forward) {
      trackIndex = (this.currentTrackIndex + 1) % this.queue.length;
    }

    if (trackIndex !== undefined) {
      this.currentTrackIndex = trackIndex;
      this.switchTrack();
    }
  }

  onPlaybackStateChanged(state: PlaybackStateCommand) {
    switch (state) {
      case PlaybackStateCommand.random:
        this.randomPlayback = !this.randomPlayback;
        break;
      case PlaybackStateCommand.repeat:
        this.repeat = !this.repeat;
        break;
    }
  }

  get playing(): boolean {
    return !this.crtAudio.current.paused;
  }

  onMuteStateChanged() {
    this.muted = !this.muted;
    this.crtAudio.current.muted = this.muted;
    this.crtAudio.other.muted = this.muted;
  }
}
