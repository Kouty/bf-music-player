import { Injectable } from '@angular/core';
import { Audio } from './audio';
import { HtmlAudio } from './html-audio';

@Injectable()
export class AudioProvider {
  createAudio(): Audio {
    return new HtmlAudio(document.createElement('audio'));
  }
}
