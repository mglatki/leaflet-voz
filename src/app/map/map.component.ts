import { AfterViewInit, Component, Input } from '@angular/core';
import * as L from 'leaflet';
import { Observable } from 'rxjs';
import { fakeVehicles } from '../helpers/helpers';
import { MarkersService } from '../markers.service';
import { Vehicle } from '../models/Vehicle';

const iconRetinaUrl = 'assets/marker-icon-2x.png';
const iconUrl = 'assets/marker-icon.png';
const shadowUrl = 'assets/marker-shadow.png';
const iconDefault = L.icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = iconDefault;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements AfterViewInit {
  private map: L.Map | undefined;
  // vehicles$: Observable<VehiclesWrapper> | undefined;
  // @Input() vehicles:<VehiclesWrapper>;

  private initMap(): void {
    this.map = L.map('map', {
      center: [52.1935, 20.9304],
      zoom: 3,
    });

    const tiles = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom: 18,
        minZoom: 3,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }
    );

    tiles.addTo(this.map);

    this.map.on('zoomend', () => {
      console.log(this.map?.getZoom());
      console.log(this.map?.getMaxZoom());
    });

    // this.initMarker(this.map);

    // fakeVehicles(this.map);

    // this.markerService.makeCapitalMarkers(this.map);
    // this.vehicles$ = this.markerService.getVehiclesMarkers(this.map);
    // this.markerService.makeVehiclesMarkers(this.map);
    // this.markerService.makePOIsMarkers(this.map);
    // this.markerService.makeParkingsMarkers(this.map);
  }

  initMapEvents(map: L.Map): void {
    this.map?.on('zoomend', () => {
      console.log(map.getZoom());
      console.log(map.getMaxZoom());
    });
  }

  initMarkers(map: L.Map): void {
    this.markerService.makeVehiclesMarkers(map);
    this.markerService.makePOIsMarkers(map);
    this.markerService.makeParkingsMarkers(map);
  }

  initMarker(map: L.Map): L.Marker {
    const userMarker = L.marker([39.8282, -98.5795]);

    userMarker.addTo(map);

    return userMarker;
  }

  constructor(private markerService: MarkersService) {}

  ngAfterViewInit(): void {
    this.initMap();
    if (this.map) {
      this.initMapEvents(this.map);
      this.initMarkers(this.map);
    }
  }
}
