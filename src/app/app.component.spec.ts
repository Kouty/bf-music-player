import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { Audio } from './audio/html-audio';

describe('AppComponent', () => {
  let component: AppComponent;
  let audioMock: Audio;

  beforeEach(() => {
    audioMock = {
      src: ''

    };
    component = new AppComponent({
      createAudio: () => audioMock
    });
  });
});
