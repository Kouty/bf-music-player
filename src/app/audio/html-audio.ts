import { Observable, Subject } from 'rxjs';

export class HtmlAudio {
  private timeSubject = new Subject<number>();

  constructor(private element: HTMLAudioElement) {
    this.element.ontimeupdate = () => {
      this.timeSubject.next(this.element.currentTime);
    };
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
}
