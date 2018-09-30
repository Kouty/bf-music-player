import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MatSliderModule } from '@angular/material';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SongsQueueComponent } from './songs-queue/songs-queue.component';
import { TrackBarComponent } from './track-bar/track-bar.component';
import { AudioProvider } from './audio/audio-provider';

@NgModule({
  declarations: [AppComponent, SongsQueueComponent, TrackBarComponent],
  imports: [BrowserModule, BrowserAnimationsModule, MatSliderModule],
  providers: [AudioProvider],
  bootstrap: [AppComponent]
})
export class AppModule {}
