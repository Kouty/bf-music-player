import { HtmlAudio } from './html-audio';

describe('HtmlAudio', () => {
  let audio: HtmlAudio;
  let audioElementMock;

  beforeEach(() => {
    let src;
    audioElementMock = {
      set src(value) {
        src = value;
      },
      get src() {
        return src;
      },
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

  it('should not change src if the url did not change', () => {
    const trackUrl = 'some track url';
    const seSrcSpy = spyOnProperty(audioElementMock, 'src', 'set');
    spyOnProperty(audioElementMock, 'src', 'get').and.returnValue(trackUrl);

    audio.src = trackUrl;

    expect(seSrcSpy).not.toHaveBeenCalled();
  });

  it('should provide volume property', () => {
    const value = 0.2;
    audio.volume = value;

    expect(audio.volume).toBe(value);
    expect(audioElementMock.volume).toBe(value);
  });

  it('should provide a duration getter', () => {
    audioElementMock.duration = 31;

    expect(audio.duration).toBe(31);
  });

  it('should provide a currentTime getter and setter', () => {
    audio.currentTime = 12;

    expect(audio.currentTime).toBe(12);
    expect(audioElementMock.currentTime).toBe(12);
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
      audio.onPause.subscribe(paused => {
        expect(paused).toBe(true);
        done();
      });

      audioElementMock.paused = true;
      audioElementMock.onpause(<Event>{});
    });

    it('should emit paused false on play event', done => {
      audio.onPause.subscribe(paused => {
        expect(paused).toBe(false);
        done();
      });

      audioElementMock.paused = false;
      audioElementMock.onplay(<Event>{});
    });
  });

  it('should expose onLoadedMetadata event as an Observable', done => {
    audio.onLoadedMetadata.subscribe(() => {
      done();
    });

    audioElementMock.onloadedmetadata(<Event>{});
  });

  it('should expose onEnded event as an Observable', done => {
    audio.onEnded.subscribe(() => {
      done();
    });

    audioElementMock.onended(<Event>{});
  });
});
