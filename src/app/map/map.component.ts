import { AfterViewInit, Component } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent  implements AfterViewInit {
  private map: L.Map | undefined;

  private initMap(): void {
    this.map = L.map('map', {
      center: [ 39.8282, -98.5795 ],
      zoom: 3
    });

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    tiles.addTo(this.map);

    this.initMarker(this.map);

    this.addCustomMarkers(this.map);
  }

  initMarker(map: L.Map): L.Marker {
    const userMarker = L.marker([39.8282, -98.5795]);

    userMarker.addTo(map);

    return userMarker;
  }

  addCustomMarkers(map: L.Map) : void {
    const markers = new Array();

    // for(let i = 0; i < markers.length; i++) {
    //   markers.push(L.marker([(39 - i),(-98 - i)]).addTo(map));
    // }

    markers.push(L.marker([(39 - 1),(-98 - 1)]).addTo(map));
    markers.push(L.marker([(39 - 2),(-98 - 2)]).addTo(map));
    markers.push(L.marker([(39 - 3),(-98 - 3)]).addTo(map));
    markers.push(L.marker([(39 - 4),(-98 - 4)]).addTo(map));
    markers.push(L.marker([(39 - 5),(-98 - 5)]).addTo(map));


    console.log(markers);
  }

  constructor() { }

  ngAfterViewInit(): void {
    this.initMap();
   }

}
