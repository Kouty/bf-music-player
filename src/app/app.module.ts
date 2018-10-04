import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {
  MatSliderModule,
  MatTableModule,
  MatButtonModule,
  MatIconModule,
  MatToolbarModule,
  MatGridListModule
} from '@angular/material';
import * as TWEEN from '@tweenjs/tween.js';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SongsQueueComponent } from './songs-queue/songs-queue.component';
import { TrackBarComponent } from './track-bar/track-bar.component';
import { AudioProvider } from './audio/audio-provider';

@NgModule({
  declarations: [AppComponent, SongsQueueComponent, TrackBarComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatSliderModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatGridListModule
  ],
  providers: [AudioProvider],
  bootstrap: [AppComponent]
})
export class AppModule {}

function animate(time) {
  requestAnimationFrame(animate);
  TWEEN.update(time);
}
requestAnimationFrame(animate);
