import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as L from 'leaflet';
import { forkJoin, Observable } from 'rxjs';
import {
  addCustomMarkersToClusterGroup,
  addParkingMarkersToClusterGroup,
  addPOIMarkersToClusterGroup,
  addVehicleMarkersToClusterGroup,
  ParkingsWrapper,
  PoisWrapper,
  VehiclesWrapper,
} from './helpers/helpers';

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

  respObjectsArray: Array<any> | undefined;
  markers: { lat: number; lng: number; discriminator: string }[] = [];
  markersClustersGroup: L.MarkerClusterGroup | undefined;

  constructor(private http: HttpClient) {}

  makeClusterGroup(map: L.Map): void {
    forkJoin({
      vehiclesRequest: this.getVehiclesMarkers(),
      poisRequest: this.getPOIsMarkers(),
      parkingsRequest: this.getParkingsMarkers(),
    }).subscribe(({ vehiclesRequest, poisRequest, parkingsRequest }) => {
      this.respObjectsArray = [
        ...vehiclesRequest.objects,
        ...poisRequest.objects,
        ...parkingsRequest.objects,
      ];

      this.markers = this.respObjectsArray.map((item) => {
        return {
          lat: item.location.latitude,
          lng: item.location.longitude,
          discriminator: item.discriminator,
        };
      });

      this.markersClustersGroup = addCustomMarkersToClusterGroup(
        this.markers,
        map
      );
    });
  }

  updateClustersGroup(
    map: L.Map,
    showParkings: boolean,
    showPois: boolean,
    showVehicles: boolean,
    showAvailableVehicles: boolean,
    minVehiclesRange: number
  ): void {
    if (this.markersClustersGroup) map.removeLayer(this.markersClustersGroup);

    if (this.respObjectsArray) {
      const filteredObjectsArray = this.respObjectsArray.filter((item) => {
        if (showParkings && item.discriminator === 'parking') return item;
        if (showPois && item.discriminator === 'poi') return item;

        if (showVehicles && item.discriminator === 'vehicle') {
          if (showAvailableVehicles && item.status !== 'AVAILABLE') return;
          if (minVehiclesRange > 0 && item.rangeKm < minVehiclesRange) return;
          else return item;
        }
      });

      this.markers = filteredObjectsArray.map((item) => {
        return {
          lat: item.location.latitude,
          lng: item.location.longitude,
          discriminator: item.discriminator,
        };
      });

      this.markersClustersGroup = addCustomMarkersToClusterGroup(
        this.markers,
        map
      );
    }
  }

  makeVehiclesClusterGroups(map: L.Map): void {
    this.getVehiclesMarkers().subscribe((data: VehiclesWrapper) => {
      // console.log(data.objects);

      addVehicleMarkersToClusterGroup(data.objects, map);
    });
  }

  makePOIsClusterGroups(map: L.Map): void {
    this.getParkingsMarkers().subscribe((data: ParkingsWrapper) => {
      // console.log(data.objects);

      addPOIMarkersToClusterGroup(data.objects, map);
    });
  }

  makeParkingsMarkersClusterGroups(map: L.Map): void {
    this.getPOIsMarkers().subscribe((data: PoisWrapper) => {
      // console.log(data.objects);

      addParkingMarkersToClusterGroup(data.objects, map);
    });
  }

  getVehiclesMarkers(): Observable<VehiclesWrapper> {
    return this.http.get<VehiclesWrapper>(this.vozillaVehicles);
  }

  getPOIsMarkers(): Observable<PoisWrapper> {
    return this.http.get<PoisWrapper>(this.vozillaPOIs);
  }

  getParkingsMarkers(): Observable<ParkingsWrapper> {
    return this.http.get<ParkingsWrapper>(this.vozillaParkings);
  }
}
