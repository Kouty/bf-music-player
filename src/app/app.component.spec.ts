import { AppComponent } from './app.component';
import { Audio } from './audio/audio';
import { Observable, Subject } from 'rxjs';

describe('AppComponent', () => {
  let component: AppComponent;
  let audioMock;

  beforeEach(() => {
    audioMock = {
      src: '',
      onPause: new Subject<boolean>(),
      onTimeUpdate: new Subject<number>(),
      onLoadedMetadata: new Subject<void>(),
      play: jasmine.createSpy('play'),
      pause: jasmine.createSpy('pause')
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
});
