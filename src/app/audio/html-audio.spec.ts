import { HtmlAudio } from './html-audio';

describe('AudioTrack', () => {
  let audio: HtmlAudio;
  let audioElementMock;

  beforeEach(() => {
    audioElementMock = {
      src: '',
      currentTime: 0
    };
    audio = new HtmlAudio(<HTMLAudioElement>audioElementMock);
  });

  it('should provide a src audio setter', () => {
    const trackUrl = 'some track url';

    audio.src = trackUrl;

    expect(audioElementMock.src).toEqual(trackUrl);
  });

  it('should provide a src audio getter', () => {
    const trackUrl = 'some track url';

    audio.src = trackUrl;

    expect(audio.src).toEqual(trackUrl);
  });

  describe('ontimeupdate ', () => {
    it('should register to ontimeupdate', () => {
      expect(audioElementMock.ontimeupdate).not.toBe(undefined);
    });

    it('should expose timeupdate event as an Observable', () => {
      let updateTime = 0;
      const expectedTime = 12;
      audio.onTimeUpdate.subscribe(videoTime => {
        updateTime = videoTime;
      });

      audioElementMock.currentTime = expectedTime;
      audioElementMock.ontimeupdate(<Event>{});

      expect(updateTime).toBe(expectedTime);
    });
  });

  describe('onPause', () => {
    it('should expose pause event as an Observable', done => {
      audio.onPause.subscribe((paused) => {
        expect(paused).toBe(true);
        done();
      });

      audioElementMock.paused = true;
      audioElementMock.onpause(<Event>{});
    });

    it('should emit paused false on play event', done => {
      audio.onPause.subscribe((paused) => {
        expect(paused).toBe(false);
        done();
      });

      audioElementMock.paused = false;
      audioElementMock.onplay(<Event>{});
    });
  });
});
