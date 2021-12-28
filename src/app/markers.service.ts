import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as L from 'leaflet';
import { Observable } from 'rxjs';
import {
  addParkingMarkers,
  addPOIMarkers,
  addVehicleMarkers,
  VehiclesWrapper,
} from './helpers/helpers';
import { Vehicle } from './models/Vehicle';

@Injectable({
  providedIn: 'root',
})
export class MarkersService {
  vozillaVehicles: string =
    'https://dev.vozilla.pl/api-client-portal/map?objectType=VEHICLE';

  vozillaPOIs: string =
    'https://dev.vozilla.pl/api-client-portal/map?objectType=POI';

  vozillaParkings: string =
    'https://dev.vozilla.pl/api-client-portal/map?objectType=PARKING';

  constructor(private http: HttpClient) {}

  makeVehiclesMarkers(map: L.Map): void {
    this.getVehiclesMarkers().subscribe((data: VehiclesWrapper) => {
      console.log(data.objects);

      addVehicleMarkers(data.objects, map);
    });
  }

  makePOIsMarkers(map: L.Map): void {
    this.getParkingsMarkers().subscribe((data: VehiclesWrapper) => {
      console.log(data.objects);

      addPOIMarkers(data.objects, map);
    });
  }

  makeParkingsMarkers(map: L.Map): void {
    this.getPOIsMarkers().subscribe((data: VehiclesWrapper) => {
      console.log(data.objects);

      addParkingMarkers(data.objects, map);
    });
  }

  getVehiclesMarkers(): Observable<VehiclesWrapper> {
    return this.http.get<VehiclesWrapper>(this.vozillaVehicles);
  }

  getPOIsMarkers(): Observable<VehiclesWrapper> {
    return this.http.get<VehiclesWrapper>(this.vozillaPOIs);
  }

  getParkingsMarkers(): Observable<VehiclesWrapper> {
    return this.http.get<VehiclesWrapper>(this.vozillaParkings);
  }
}
