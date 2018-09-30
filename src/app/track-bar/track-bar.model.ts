import { TrackData } from '../track-data';

export interface TrackBarModel {
  paused: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  trackData: TrackData;
  random: boolean;
}
