import { AppComponent } from './app.component';
import { Audio } from './audio/audio';

describe('AppComponent', () => {
  let component: AppComponent;
  let audioMock: Audio;

  beforeEach(() => {
    audioMock = {
      src: '',
      onPause: null,
      onTimeUpdate: null
    };
    component = new AppComponent({
      createAudio: () => audioMock
    });
  });
});
