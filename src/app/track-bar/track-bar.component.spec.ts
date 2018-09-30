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

  it('should update slider value when audio time changes', () => {
    component.currentTime = 10;

    expect(component.sliderTime).toBe(component.currentTime);
  });

  it('should NOT update slider value when a user is changing the slider value', () => {
    component.sliderChangeStart();
    component.currentTime = 10;

    expect(component.sliderTime).toBe(0);
  });

  it('should restore slider update when the user stop interacting with the slider', () => {
    component.sliderChangeStart();
    component.sliderChangeEnd();
    component.currentTime = 10;

    expect(component.sliderTime).toBe(10);
  });
});
