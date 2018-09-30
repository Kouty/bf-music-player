import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChange } from '@angular/core';
import { TrackBarModel } from './track-bar.model';

@Component({
  selector: 'app-track-bar',
  templateUrl: './track-bar.component.html',
  styleUrls: ['./track-bar.component.css']
})
export class TrackBarComponent implements OnInit {
  @Input()
  model: TrackBarModel;

  @Output()
  playPauseClicked = new EventEmitter<boolean>();
  @Output()
  timeChanged = new EventEmitter<number>();
  @Output()
  volumeChanged = new EventEmitter<number>();

  private _sliderTime = 0;
  private _currentTime: number;
  private _preventTimeChange = false;

  constructor() {
  }

  ngOnInit() {
  }

  @Input()
  set currentTime(value) {
    this._currentTime = value;
    if (!this._preventTimeChange) {
      this._sliderTime = value;
    }
  }

  get currentTime() {
    return this._currentTime;
  }

  playPauseClick() {
    this.playPauseClicked.emit(this.model.paused);
  }

  set sliderTime(value) {
    this._preventTimeChange = false;
    this._sliderTime = value;
    this.timeChanged.next(value);
  }

  get sliderTime() {
    return this._sliderTime;
  }

  sliderChangeStart() {
    this._preventTimeChange = true;
  }

  sliderChangeEnd() {
    this._preventTimeChange = false;
  }

  volumeChange(evt) {
    this.volumeChanged.emit(evt.value);
  }
}
