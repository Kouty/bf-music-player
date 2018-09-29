import { SongsQueueComponent } from './songs-queue.component';

describe('SongsQueueComponent', () => {
  let component: SongsQueueComponent;

  beforeEach(() => {
    component = new SongsQueueComponent();
  });

  it('should emit songSelected when a track is clicked', done => {
    const index = 2;

    component.songSelected.subscribe(emitted => {
      expect(emitted).toBe(index);
      done();
    });

    component.selectSong(index);
  });
});
