import { AfterViewInit, Component, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import * as L from 'leaflet';
import { MarkersService } from '../markers.service';

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
  form: FormGroup;

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

  submitForm(): void {
    console.log(this.form.value);
    if (this.map)
      this.markerService.updateClustersGroup(
        this.map,
        this.form.value.showParkingsCheckbox,
        this.form.value.showPOIsCheckbox,
        this.form.value.showVehiclesCheckbox,
        this.form.value.availableVehiclesOnlyCheckbox,
        this.form.value.minimalRangeInput
      );
  }

  constructor(private markerService: MarkersService, private fb: FormBuilder) {
    this.form = new FormGroup({
      showVehiclesCheckbox: new FormControl('showVehiclesCheckbox'),
      showPOIsCheckbox: new FormControl('showPOIsCheckbox'),
      showParkingsCheckbox: new FormControl('showParkingsCheckbox'),
      availableVehiclesOnlyCheckbox: new FormControl(''),
      minimalRangeInput: new FormControl(''),
    });
  }

  ngAfterViewInit(): void {
    this.initMap();
    if (this.map) {
      // this.markerService.makeClusterGroup(this.map);
      this.markerService.makeClusterGroupFromMockedData(this.map);
    }
  }
}
