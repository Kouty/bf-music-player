import { TrackBarComponent } from './track-bar.component';
import { PlaybackCommand } from './playback-command';
import { PlaybackStateCommand } from './platyback-state-command';

describe('TrackBarComponent', () => {
  let component: TrackBarComponent;

  beforeEach(() => {
    component = new TrackBarComponent();
    component.model = {
      paused: true,
      currentTime: 0,
      duration: 60,
      volume: 1,
      trackData: null,
      random: false
    };
  });

  it('should emit event playPauseClick when user click on play/pause button', done => {
    component.playPauseClicked.subscribe(emitted => {
      expect(emitted).toBe(component.model.paused);
      done();
    });

    component.playPauseClick();
  });

  it('should update slider value when audio time changes', () => {
    component.currentTime = 10;

    expect(component.sliderTime).toBe(component.currentTime);
  });

  it('should NOT update slider value when a user is changing the slider value', () => {
    component.sliderChangeStart();
    component.currentTime = 10;

    expect(component.sliderTime).toBe(0);
  });

  it('should restore slider update when the user stop interacting with the slider', () => {
    component.sliderChangeStart();
    component.sliderChangeEnd();
    component.currentTime = 10;

    expect(component.sliderTime).toBe(10);
  });

  it('should emit timeChanged event when the user changes the slider value', done => {
    component.timeChanged.subscribe(sliderTime => {
      expect(sliderTime).toBe(component.sliderTime);
      done();
    });

    component.sliderTime = 10;
  });

  it('should emit volumeChanged event', done => {
    component.volumeChanged.subscribe(volume => {
      expect(volume).toBe(0.5);
      done();
    });

    component.volumeChange({ value: 0.5 });
  });

  it('should emit backward event', done => {
    component.playbackChanged.subscribe(command => {
      expect(command).toBe(PlaybackCommand.backward);
      done();
    });

    component.backwardClick();
  });

  it('should emit forward event', done => {
    component.playbackChanged.subscribe(command => {
      expect(command).toBe(PlaybackCommand.forward);
      done();
    });

    component.forwardClick();
  });

  it('should emit random click event', done => {
    component.playbackStateChanged.subscribe(command => {
      expect(command).toBe(PlaybackStateCommand.random);
      done();
    });

    component.randomClick();
  });
});
