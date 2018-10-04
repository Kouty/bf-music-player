import { AppComponent } from './app.component';
import { Audio } from './audio/audio';
import { Subject } from 'rxjs';
import { PlaybackCommand } from './track-bar/playback-command';
import { Random } from './random/random';
import { PlaybackStateCommand } from './track-bar/platyback-state-command';

describe('AppComponent', () => {
  let component: AppComponent;
  let audioMock;

  beforeEach(() => {
    audioMock = {
      src: '',
      onPause: new Subject<boolean>(),
      onTimeUpdate: new Subject<number>(),
      onLoadedMetadata: new Subject<void>(),
      onEnded: new Subject<void>(),
      play: jasmine.createSpy('play'),
      pause: jasmine.createSpy('pause'),
      seek: jasmine.createSpy('seek'),
      paused: true
    };
    component = new AppComponent({
      createAudio: () => <Audio>audioMock
    });
    component.ngOnInit();
  });

  it('should update pause state when onPause emits values', () => {
    audioMock.onPause.next(false);

    expect(component.trackBarModel.paused).toBe(false);
  });

  it('should update currentTime when onTimeUpdate emits values', () => {
    audioMock.onTimeUpdate.next(10);

    expect(component.trackBarModel.currentTime).toBe(10);
  });

  it('should play current track', () => {
    component.playCurrentTrack();

    expect(audioMock.src).not.toBe('');
    expect(audioMock.play).toHaveBeenCalled();
  });

  it('should play the current track when the user click play', () => {
    component.onPlayPauseClick(true);

    expect(audioMock.play).toHaveBeenCalled();
  });

  it('should pause the current track when the user click pause', () => {
    component.onPlayPauseClick(false);

    expect(audioMock.pause).toHaveBeenCalled();
  });

  it('should update track-bar model duration on audio metadata loaded', () => {
    audioMock.duration = 31;
    audioMock.onLoadedMetadata.next();

    expect(component.trackBarModel.duration).toBe(audioMock.duration);
  });

  it('should play the selected song when the user tap on a track from the queue', () => {
    component.playCurrentTrack();
    const firstTrackSrc = audioMock.src;

    component.onSongSelected(1);

    expect(audioMock.src).not.toBe(firstTrackSrc);
  });

  it('should seek the current audio when the user seeks the audio', () => {
    component.onSeek(13);

    expect(audioMock.currentTime).toBe(13);
  });

  describe('audio', () => {
    let audioMock2;

    beforeEach(() => {
      let count = 0;
      audioMock2 = {
        src: '',
        onPause: new Subject<boolean>(),
        onTimeUpdate: new Subject<number>(),
        onLoadedMetadata: new Subject<void>(),
        onEnded: new Subject<void>(),
        play: jasmine.createSpy('play'),
        pause: jasmine.createSpy('pause'),
        seek: jasmine.createSpy('seek'),
        paused: true
      };
      component = new AppComponent({
        createAudio: () => <Audio>(count++ === 0 ? audioMock : audioMock2)
      });
      component.ngOnInit();
    });

    it('should be able to switch the audio to cross fade', () => {
      component.onSongSelected(0);
      expect(audioMock.play).toHaveBeenCalled();

      component.onSongSelected(1);
      expect(audioMock2.play).toHaveBeenCalled();
    });

    it('should update trackData when switching', () => {
      component.onSongSelected(1);
      expect(component.trackBarModel.trackData).not.toBe(null);
    });

    it('should update the volume when the user changes the volume', () => {
      const volume = 0.5;
      component.onVolumeChanged(volume);

      expect(audioMock.volume).toBe(0.5);
      expect(component.trackBarModel.volume).toBe(volume);
    });

    it('should restore the volume when stopping the cross fade', () => {
      audioMock.volume = 0.2;
      audioMock2.volume = 0.8;

      component.pauseCurrentTrack();

      expect(audioMock.volume).toBe(1);
      expect(audioMock2.volume).toBe(0);
    });

    it('should restore the volume when stopping the cross fade and track are swapped', () => {
      component.switchTrack();
      audioMock.volume = 0.2;
      audioMock2.volume = 0.8;

      component.pauseCurrentTrack();

      expect(audioMock.volume).toBe(0);
      expect(audioMock2.volume).toBe(1);
    });

    it('should be able to mute audio', () => {
      component.onMuteStateChanged();

      expect(audioMock.muted).toBe(true);
      expect(audioMock2.muted).toBe(true);

      expect(component.trackBarModel.muted).toBe(true);
      component.switchTrack();
      expect(component.trackBarModel.muted).toBe(true);
    });
  });

  it('should begin with the first trackData', () => {
    component.playCurrentTrack();

    expect(audioMock.src).not.toBe('');
    expect(component.trackBarModel.trackData).not.toBe(null);
  });

  it('should go to next song on forward click', () => {
    component.onSongSelected(0);
    component.onPlaybackChanged(PlaybackCommand.forward);

    expect(audioMock.src).toBe(component.queue[1].src);
  });

  it('should go to previous song on backward click', () => {
    component.onSongSelected(1);
    component.onSongSelected(3);
    component.onPlaybackChanged(PlaybackCommand.backward);

    expect(component.currentTrackIndex).toBe(1);
  });

  it('backward wins on random', () => {
    component.onPlaybackStateChanged(PlaybackStateCommand.random);
    component.onSongSelected(1);
    component.onSongSelected(3);
    component.onPlaybackChanged(PlaybackCommand.backward);

    expect(component.currentTrackIndex).toBe(1);
  });

  it('should go to first song when going forward on last song', () => {
    component.onSongSelected(component.queue.length - 1);
    component.onPlaybackChanged(PlaybackCommand.forward);

    expect(audioMock.src).toBe(component.queue[0].src);
  });

  it('should go to a random song when user fast forward and random is active', () => {
    component.onSongSelected(1);
    spyOn(Random, 'randIntExclusive').and.returnValue(0);
    component.onPlaybackStateChanged(PlaybackStateCommand.random);
    component.onPlaybackChanged(PlaybackCommand.forward);

    expect(Random.randIntExclusive).toHaveBeenCalled();
    expect(audioMock.src).toBe(component.queue[0].src);
  });

  it('should toggle random', () => {
    spyOn(Random, 'randIntExclusive').and.returnValue(0);
    component.onPlaybackStateChanged(PlaybackStateCommand.random);
    component.onPlaybackStateChanged(PlaybackStateCommand.random);
    component.onPlaybackChanged(PlaybackCommand.forward);
    expect(Random.randIntExclusive).not.toHaveBeenCalled();
  });

  it('should play a random song if users click random before first play', () => {
    spyOn(Random, 'randIntExclusive').and.returnValue(3);

    component.onPlaybackStateChanged(PlaybackStateCommand.random);
    component.playCurrentTrack();

    expect(component.currentTrackIndex).toBe(3);
  });

  it('should update trackModel when user activates random play', () => {
    component.onPlaybackStateChanged(PlaybackStateCommand.random);

    expect(component.trackBarModel.random).toBe(true);
  });

  it('should keep random state when switching song', () => {
    component.onPlaybackStateChanged(PlaybackStateCommand.random);
    component.onSongSelected(1);
    component.switchTrack();

    expect(component.trackBarModel.random).toBe(true);
  });

  it('should play next song on current song ended', () => {
    spyOn(component, 'onPlaybackChanged');

    component.playCurrentTrack();
    audioMock.onEnded.next();

    expect(component.onPlaybackChanged).toHaveBeenCalledWith(PlaybackCommand.forward);
  });

  it('should tell if the current song is playing', () => {
    audioMock.paused = false;
    expect(component.playing).toBe(true);

    audioMock.paused = true;
    expect(component.playing).toBe(false);
  });

  it('should play the same song if repeat is enabled', () => {
    component.onSongSelected(0);
    component.onPlaybackStateChanged(PlaybackStateCommand.repeat);
    component.onPlaybackChanged(PlaybackCommand.forward);

    expect(component.currentTrackIndex).toBe(0);
  });

  it('should update trackBarModel if repeat is enabled', () => {
    expect(component.trackBarModel.repeat).toBe(false);

    component.onPlaybackStateChanged(PlaybackStateCommand.repeat);

    expect(component.trackBarModel.repeat).toBe(true);
  });

  it('should start with back button disabled', () => {
    expect(component.trackBarModel.backEnabled).toBe(false);
  });

  it('should set backEnabled to true when the history has more than two elements', () => {
    component.onSongSelected(1);
    component.onSongSelected(2);

    expect(component.trackBarModel.backEnabled).toBe(true);
  });

  it('should not put in the history the same track', () => {
    component.onSongSelected(1);
    component.onSongSelected(2);
    component.onPlaybackStateChanged(PlaybackStateCommand.repeat);
    component.onPlaybackChanged(PlaybackCommand.forward);
    component.onPlaybackChanged(PlaybackCommand.backward);

    expect(component.currentTrackIndex).toBe(1);
  });

  it('backwards ignore repeat play state', () => {
    component.onSongSelected(1);
    component.onSongSelected(2);
    component.onPlaybackStateChanged(PlaybackStateCommand.repeat);
    component.onPlaybackChanged(PlaybackCommand.backward);

    expect(component.currentTrackIndex).toBe(1);
  });

  it('backwards ignore random play state', () => {
    component.onSongSelected(1);
    component.onSongSelected(2);
    component.onPlaybackStateChanged(PlaybackStateCommand.random);
    component.onPlaybackChanged(PlaybackCommand.backward);

    expect(component.currentTrackIndex).toBe(1);
  });
});
