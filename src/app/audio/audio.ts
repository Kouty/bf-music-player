import { Observable } from 'rxjs';

export interface Audio {

  src: string;
  onPause: Observable<boolean>;
  onTimeUpdate: Observable<number>;
}
