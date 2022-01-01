import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as L from 'leaflet';
import { forkJoin, Observable } from 'rxjs';
import {
  addCustomMarkersToClusterGroup,
  addParkingMarkers,
  addParkingMarkersToClusterGroup,
  addPOIMarkers,
  addPOIMarkersToClusterGroup,
  addVehicleMarkers,
  addVehicleMarkersToClusterGroup,
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

  makeClusterGroup(map: L.Map): void {
    forkJoin({
      vehiclesRequest: this.getVehiclesMarkers(),
      poisRequest: this.getPOIsMarkers(),
      parkingsRequest: this.getParkingsMarkers(),
    }).subscribe(({ vehiclesRequest, poisRequest, parkingsRequest }) => {
      const markers = [
        ...vehiclesRequest.objects,
        ...poisRequest.objects,
        ...parkingsRequest.objects,
      ].map((item) => {
        return { lat: item.location.latitude, lng: item.location.longitude };
      });

      addCustomMarkersToClusterGroup(markers, map);
    });
  }

  makeVehiclesClusterGroups(map: L.Map): void {
    this.getVehiclesMarkers().subscribe((data: VehiclesWrapper) => {
      // console.log(data.objects);

      addVehicleMarkersToClusterGroup(data.objects, map);
    });
  }

  makePOIsClusterGroups(map: L.Map): void {
    this.getParkingsMarkers().subscribe((data: VehiclesWrapper) => {
      // console.log(data.objects);

      addPOIMarkersToClusterGroup(data.objects, map);
    });
  }

  makeParkingsMarkersClusterGroups(map: L.Map): void {
    this.getPOIsMarkers().subscribe((data: VehiclesWrapper) => {
      // console.log(data.objects);

      addParkingMarkersToClusterGroup(data.objects, map);
    });
  }

  makeVehiclesMarkers(map: L.Map): void {
    this.getVehiclesMarkers().subscribe((data: VehiclesWrapper) => {
      // console.log(data.objects);

      addVehicleMarkers(data.objects, map);
    });
  }

  makePOIsMarkers(map: L.Map): void {
    this.getParkingsMarkers().subscribe((data: VehiclesWrapper) => {
      // console.log(data.objects);

      addPOIMarkers(data.objects, map);
    });
  }

  makeParkingsMarkers(map: L.Map): void {
    this.getPOIsMarkers().subscribe((data: VehiclesWrapper) => {
      // console.log(data.objects);

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
