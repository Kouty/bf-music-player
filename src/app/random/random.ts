export class Random {

  static randIntExclusive(start: number, end: number): number {
    return Math.floor(start + Math.random() * (end - start));
  }
}
