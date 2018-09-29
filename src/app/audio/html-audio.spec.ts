import { HtmlAudio } from './html-audio';

describe('AudioTrack', () => {
  let audio: HtmlAudio;
  let audioElementMock: HTMLAudioElement;

  beforeEach(() => {
    audioElementMock = <HTMLAudioElement>{
      src: ''
    };
    audio = new HtmlAudio(audioElementMock);
  });

  it('should expose src audio property', () => {
    const trackUrl = 'some track url';

    audio.src = trackUrl;

    expect(audioElementMock.src).toEqual(trackUrl);
  });
});
