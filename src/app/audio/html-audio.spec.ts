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


});
