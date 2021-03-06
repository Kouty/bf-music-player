import { Observable, Subject } from 'rxjs';
import { Audio } from './audio';

export class HtmlAudio implements Audio {
  private timeSubject = new Subject<number>();
  private pauseSubject = new Subject<boolean>();
  private loadedMetadataSubject = new Subject<void>();
  private endedSubject = new Subject<void>();

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
    this.element.onended = () => {
      this.endedSubject.next();
    };
  }

  set src(url: string) {
    if (url !== this.element.src) {
      this.element.src = url;
    }
  }

  get src(): string {
    return this.element.src;
  }

  get duration(): number {
    return this.element.duration;
  }

  get volume(): number {
    return this.element.volume;
  }

  set volume(value) {
    this.element.volume = value;
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

  get onEnded() {
    return this.endedSubject;
  }

  get currentTime() {
    return this.element.currentTime;
  }

  set currentTime(value) {
    this.element.currentTime = value;
  }

  get paused() {
    return this.element.paused;
  }

  play() {
    return this.element.play();
  }

  pause() {
    this.element.pause();
  }

  get muted(): boolean {
    return this.element.muted;
  }

  set muted(value: boolean) {
    console.log('muted', value);
    this.element.muted = value;
  }
}
