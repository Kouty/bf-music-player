import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { SongsQueueItem } from './songs-queue-item';

@Component({
  selector: 'app-songs-queue',
  templateUrl: './songs-queue.component.html',
  styleUrls: ['./songs-queue.component.css']
})
export class SongsQueueComponent implements OnInit {
  @Input()
  items: SongsQueueItem[];
  @Input()
  selectedIndex: number;
  @Input()
  playing: boolean;
  @Output()
  songSelected = new EventEmitter<number>();

  columnsToDisplay = ['playState', 'title', 'artist', 'album'];

  constructor() {}

  ngOnInit() {}

  selectSong(index: number) {
    this.songSelected.emit(index);
  }
}
