import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as L from 'leaflet';
import { forkJoin, Observable } from 'rxjs';
import {
  addCustomMarkersToClusterGroup,
  addParkingMarkersToClusterGroup,
  addPOIMarkersToClusterGroup,
  addVehicleMarkersToClusterGroup,
  createCustomMarkerFromVehicle,
  createCustomMarkerFromPOI,
  createCustomMarkerFromParking,
  ParkingsWrapper,
  PoisWrapper,
  VehiclesWrapper,
} from './helpers/helpers';
import { CustomMarker } from './models/CustomMarker';
import { getVehiclesMockup } from './services/markers.service.mockup';

@Injectable({
  providedIn: 'root',
})
export class MarkersService {
  vozillaAPI: string =
    'https://dev.vozilla.pl/api-client-portal/map?objectType=';
  vozillaVehicles: string = `${this.vozillaAPI}VEHICLE`;
  vozillaPOIs: string = `${this.vozillaAPI}POI`;
  vozillaParkings: string = `${this.vozillaAPI}PARKING`;

  vehicleString: string = 'vehicle';
  poiString: string = 'poi';
  parkingString: string = 'parking';

  respObjectsArray: Array<any> | undefined;
  markers: CustomMarker[] = [];
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

      this.mapRespToMarkers(this.respObjectsArray);

      this.markersClustersGroup = addCustomMarkersToClusterGroup(
        this.markers,
        map
      );
    });
  }
  makeClusterGroupFromMockedData(map: L.Map): void {
    this.respObjectsArray = getVehiclesMockup();

    this.mapRespToMarkers(this.respObjectsArray);

    this.markersClustersGroup = addCustomMarkersToClusterGroup(
      this.markers,
      map
    );
  }

  private mapRespToMarkers(arr: Array<any>) {
    if (arr)
      this.markers = arr.map((item) => {
        switch (item.discriminator) {
          case this.vehicleString:
            return createCustomMarkerFromVehicle(item);
          case this.poiString:
            return createCustomMarkerFromPOI(item);
          case this.parkingString:
            return createCustomMarkerFromParking(item);

          default:
            return createCustomMarkerFromParking(item);
        }
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
        if (showParkings && item.discriminator === this.parkingString)
          return item;
        if (showPois && item.discriminator === this.poiString) return item;

        if (showVehicles && item.discriminator === this.vehicleString) {
          if (showAvailableVehicles && item.status !== 'AVAILABLE') return;
          if (minVehiclesRange > 0 && item.rangeKm < minVehiclesRange) return;
          else return item;
        }
      });

      this.mapRespToMarkers(filteredObjectsArray);

      this.markersClustersGroup = addCustomMarkersToClusterGroup(
        this.markers,
        map
      );
    }
  }

  makeVehiclesClusterGroups(map: L.Map): void {
    this.getVehiclesMarkers().subscribe((data: VehiclesWrapper) => {
      addVehicleMarkersToClusterGroup(data.objects, map);
    });
  }

  makePOIsClusterGroups(map: L.Map): void {
    this.getPOIsMarkers().subscribe((data: PoisWrapper) => {
      addPOIMarkersToClusterGroup(data.objects, map);
    });
  }

  makeParkingsMarkersClusterGroups(map: L.Map): void {
    this.getParkingsMarkers().subscribe((data: ParkingsWrapper) => {
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
