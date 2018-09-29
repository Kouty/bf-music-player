export class HtmlAudio {
  constructor(private element: HTMLAudioElement) {}

  set src(url: string) {
    this.element.src = url;
  }

  get src(): string {
    return this.element.src;
  }
}
