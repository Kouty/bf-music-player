import { Observable } from 'rxjs';

export interface Audio {

  src: string;
  onPause: Observable<boolean>;
  onTimeUpdate: Observable<number>;
  onLoadedMetadata: Observable<void>;

  duration: number;
  currentTime: number;

  play(): Promise<void>;
  pause(): void;
}
