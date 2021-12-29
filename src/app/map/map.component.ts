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
  markerClusterGroup: L.MarkerClusterGroup | undefined;
  markerClusterData = [];
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
  }

  initMarkers(map: L.Map): void {
    this.markerService.makeVehiclesMarkers(map);
    this.markerService.makePOIsMarkers(map);
    this.markerService.makeParkingsMarkers(map);
  }

  constructor(private markerService: MarkersService) {}

  ngAfterViewInit(): void {
    this.initMap();
    if (this.map) {
      this.markerService.makePOIsClusterGroups(this.map);
      // this.markerService.makeParkingsMarkersClusterGroups(this.map);
      // this.markerService.makeVehiclesClusterGroups(this.map);
    }
  }
}
