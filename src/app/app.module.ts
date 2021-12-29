import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { LeafletMarkerClusterModule } from '@asymmetrik/ngx-leaflet-markercluster';

import { AppComponent } from './app.component';
import { MapComponent } from './map/map.component';
import { MarkersService } from './markers.service';

@NgModule({
  declarations: [AppComponent, MapComponent],
  imports: [BrowserModule, HttpClientModule, LeafletMarkerClusterModule],
  providers: [MarkersService],
  bootstrap: [AppComponent],
})
export class AppModule {}
