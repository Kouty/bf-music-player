import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SongsQueueComponent } from './songs-queue.component';
import { SongsQueueItem } from './songs-queue-item';

describe('SongsQueueComponent', () => {
  let component: SongsQueueComponent;

  beforeEach(() => {
    component = new SongsQueueComponent();
  });

  it('should emit songSelected when a track is clicked', done => {
    const item: SongsQueueItem = {
      src: 'src',
      title: 'title',
      artist: 'artist',
      album: 'album'
    };

    component.songSelected.subscribe(emitted => {
      expect(emitted).toBe(item);
      done();
    });

    component.selectSong(item);
  });
});
