import { Observable, Subject } from 'rxjs';
import { Audio } from './audio';

export class HtmlAudio implements Audio {
  private timeSubject = new Subject<number>();
  private pauseSubject = new Subject<boolean>();

  constructor(private element: HTMLAudioElement) {
    this.element.ontimeupdate = () => {
      this.timeSubject.next(this.element.currentTime);
    };
    const emitPauseState = () => {
      this.pauseSubject.next(this.element.paused);
    };
    this.element.onpause = emitPauseState;
    this.element.onplay = emitPauseState;
  }

  set src(url: string) {
    this.element.src = url;
  }

  get src(): string {
    return this.element.src;
  }

  get onTimeUpdate(): Observable<number> {
    return this.timeSubject;
  }

  get onPause(): Observable<boolean> {
    return this.pauseSubject;
  }
}
