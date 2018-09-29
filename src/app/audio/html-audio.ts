export class HtmlAudio {
  constructor(private element: HTMLAudioElement) {
    this.element.ontimeupdate = () => {

    };
  }

  set src(url: string) {
    this.element.src = url;
  }

  get src(): string {
    return this.element.src;
  }
}
