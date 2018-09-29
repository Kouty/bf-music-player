import { Observable, Subject } from 'rxjs';

export class HtmlAudio {
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

  onTimeUpdate(): Observable<number> {
    return this.timeSubject;
  }

  onPause(): Observable<boolean> {
    return this.pauseSubject;
  }
}
