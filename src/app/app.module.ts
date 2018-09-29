import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SongsQueueComponent } from './songs-queue/songs-queue.component';
import { TrackBarComponent } from './track-bar/track-bar.component';

@NgModule({
  declarations: [
    AppComponent,
    SongsQueueComponent,
    TrackBarComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
