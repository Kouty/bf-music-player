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
      play: jasmine.createSpy('play'),
      pause: jasmine.createSpy('pause')
    };
    component = new AppComponent({
      createAudio: () => <Audio>audioMock
    });
  });

  it('should register to onPause during init phase', () => {
    spyOn(audioMock.onPause, 'subscribe');

    component.ngOnInit();

    expect(audioMock.onPause.subscribe).toHaveBeenCalled();
  });

  it('should update pause state when onPause emits values', () => {
    component.ngOnInit();

    audioMock.onPause.next(false);

    expect(component.trackBarModel.paused).toBe(false);
  });

  it('should update currentTime when onTimeUpdate emits values', () => {
    component.ngOnInit();

    audioMock.onTimeUpdate.next(10);

    expect(component.trackBarModel.currentTime).toBe(10);
  });

  it('should play current track', () => {
    component.ngOnInit();
    component.playTrack();

    expect(audioMock.src).not.toBe('');
    expect(audioMock.play).toHaveBeenCalled();
  });

  it('should play the current track when the user click play', () => {
    component.ngOnInit();

    component.onPlayPauseClick(true);

    expect(audioMock.play).toHaveBeenCalled();
  });

  it('should pause the current track when the user click pause', () => {
    component.ngOnInit();

    component.onPlayPauseClick(false);

    expect(audioMock.pause).toHaveBeenCalled();
  });
});
