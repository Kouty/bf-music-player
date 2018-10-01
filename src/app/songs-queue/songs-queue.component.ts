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
  @Output()
  songSelected = new EventEmitter<number>();

  columnsToDisplay = ['title', 'artist', 'album'];

  constructor() {
  }

  ngOnInit() {
  }

  selectSong(index: number) {
    console.log('row', index);
    this.songSelected.emit(index);
  }
}
