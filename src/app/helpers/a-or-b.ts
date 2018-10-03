export class AOrB<T> {
  private _current: T;

  constructor(public readonly a: T, public readonly b: T) {
    this._current = a;
  }

  switch() {
    this._current = this.isA() ? this.b : this.a;
  }

  isA(): boolean {
    return this.current === this.a;
  }

  get current(): T {
    return this._current;
  }

  get other(): T {
    return this.isA() ? this.b : this.a;
  }
}
