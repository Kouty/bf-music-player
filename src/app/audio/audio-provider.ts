import { Injectable } from '@angular/core';
import { HtmlAudio } from './html-audio';

@Injectable()
export class AudioProvider {
  createAudio(): HtmlAudio {
    return new HtmlAudio(document.createElement('audio'));
  }
}
