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

  constructor() {
  }

  ngOnInit() {
  }

  selectSong(index: number) {
    this.songSelected.emit(index);
  }
}
