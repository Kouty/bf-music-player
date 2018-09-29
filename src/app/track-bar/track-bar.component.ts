import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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

  constructor() {}

  ngOnInit() {}

  playPauseClick() {
    this.playPauseClicked.emit(this.model.paused);
  }
}
