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
      onTimeUpdate: new Subject<number>()
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
});
