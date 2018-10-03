import { Observable } from 'rxjs';

export interface Audio {

  src: string;
  onPause: Observable<boolean>;
  onTimeUpdate: Observable<number>;
  onLoadedMetadata: Observable<void>;
  onEnded: Observable<void>;

  duration: number;
  currentTime: number;
  volume: number;
  paused: boolean;
  muted: boolean;

  play(): Promise<void>;
  pause(): void;
}
