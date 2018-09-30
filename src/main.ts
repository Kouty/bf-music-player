import 'hammerjs';
import * as TWEEN from '@tweenjs/tween.js';
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));

// function animate(time) {
//   requestAnimationFrame(animate);
//   TWEEN.update(time);
// }
// requestAnimationFrame(animate);
