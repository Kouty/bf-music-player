import { Observable } from 'rxjs';

export interface Audio {
  src: string;
  readonly onPause: Observable<boolean>;
  readonly onTimeUpdate: Observable<number>;
  readonly onLoadedMetadata: Observable<void>;
  readonly onEnded: Observable<void>;

  readonly duration: number;
  currentTime: number;
  volume: number;
  paused: boolean;
  muted: boolean;

  play(): Promise<void>;
  pause(): void;
}
