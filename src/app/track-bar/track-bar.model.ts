import { TrackData } from '../track-data';

export interface TrackBarModel {
  paused: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  muted: boolean;
  trackData: TrackData;
  random: boolean;
}
