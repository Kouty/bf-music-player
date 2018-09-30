import { TrackBarComponent } from './track-bar.component';

describe('TrackBarComponent', () => {
  let component: TrackBarComponent;

  beforeEach(() => {
    component = new TrackBarComponent();
    component.model = {
      paused: true,
      currentTime: 0,
      duration: 60
    };
  });

  it('should emit event playPauseClick when user click on play/pause button', done => {
    component.playPauseClicked.subscribe(emitted => {
      expect(emitted).toBe(component.model.paused);
      done();
    });

    component.playPauseClick();
  });
});
