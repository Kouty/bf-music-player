import { Observable, Subject } from 'rxjs';
import { Audio } from './audio';

export class HtmlAudio implements Audio {
  private timeSubject = new Subject<number>();
  private pauseSubject = new Subject<boolean>();
  private loadedMetadataSubject = new Subject<void>();

  constructor(private element: HTMLAudioElement) {
    this.element.ontimeupdate = () => {
      this.timeSubject.next(this.element.currentTime);
    };
    const emitPauseState = () => {
      this.pauseSubject.next(this.element.paused);
    };
    this.element.onpause = emitPauseState;
    this.element.onplay = emitPauseState;

    this.element.onloadedmetadata = () => {
      this.loadedMetadataSubject.next();
    };
  }

  set src(url: string) {
    this.element.src = url;
  }

  get src(): string {
    return this.element.src;
  }

  get duration(): number {
    return this.element.duration;
  }

  get onTimeUpdate(): Observable<number> {
    return this.timeSubject;
  }

  get onPause(): Observable<boolean> {
    return this.pauseSubject;
  }

  get onLoadedMetadata(): Observable<void> {
    return this.loadedMetadataSubject;
  }

  play() {
    return this.element.play();
  }

  pause() {
    this.element.pause();
  }
}
