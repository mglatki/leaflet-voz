import { Injectable } from '@angular/core';
import * as L from 'leaflet';
import { Parking } from '../models/Parking';
import { Poi } from '../models/Poi';
import { Vehicle } from '../models/Vehicle';

export function initMarker(map: L.Map): L.Marker {
  const userMarker = L.marker([39.8282, -98.5795]);

  userMarker.addTo(map);

  return userMarker;
}

export function fakeMarkers(map: L.Map): void {
  const markers = new Array();

  markers.push({ lat: 39 - 1, lng: -98 - 1 });
  markers.push({ lat: 39 - 2, lng: -98 - 2 });
  markers.push({ lat: 39 - 3, lng: -98 - 3 });
  markers.push({ lat: 39 - 4, lng: -98 - 4 });
  markers.push({ lat: 39 - 5, lng: -98 - 5 });

  addCustomMarkers(markers, map);
}

export function addVehicleMarkers(veh: ReadonlyArray<Vehicle>, map: L.Map) {
  addCustomMarkers(
    veh.map((v) => {
      return { lat: v.location.latitude, lng: v.location.longitude };
    }),
    map
  );
}

export function addPOIMarkers(pois: ReadonlyArray<Poi>, map: L.Map) {
  addCustomMarkers(
    pois.map((p) => {
      return { lat: p.location.latitude, lng: p.location.longitude };
    }),
    map
  );
}

export function addParkingMarkers(
  parkings: ReadonlyArray<Parking>,
  map: L.Map
) {
  addCustomMarkers(
    parkings.map((p) => {
      return { lat: p.location.latitude, lng: p.location.longitude };
    }),
    map
  );
}

export function addCustomMarkers(
  markers: Array<{ lat: number; lng: number }>,
  map: L.Map
): void {
  markers.forEach((item) => {
    L.marker([item.lat, item.lng])
      .addTo(map)
      .bindPopup(`Lat ${item.lat}, lng ${item.lng}`);
  });

  // console.log(markers);
}

export function fakeVehicles(map: L.Map): void {
  let veh = new Array<Vehicle>();
  const firstVehicle: Vehicle = {
    discriminator: 'vehicle',
    platesNumber: 'WZPV001',
    sideNumber: 'Z3-PVAN-01',
    color: 'White',
    type: 'TRUCK',
    picture: {
      id: 'e7ace1de-ab7f-4120-922d-23441a041bd9',
      name: 'e7ace1de-ab7f-4120-922d-23441a041bd9',
      extension: null,
      contentType: null,
    },
    rangeKm: 193,
    batteryLevelPct: 98,
    reservationEnd: null,
    reservation: null,
    status: 'AVAILABLE',
    locationDescription: null,
    address: null,
    mapColor: {
      rgb: 'ffffff',
      alpha: 0.5,
    },
    promotion: null,
    id: '00000000-0000-0000-0005-000000000003',
    name: 'Enigma Python Van',
    description: null,
    location: {
      latitude: 52.1935161702226,
      longitude: 20.9304286193486,
    },
    metadata: null,
  };
  const secondVehicle: Vehicle = {
    discriminator: 'vehicle',
    platesNumber: 'WZ8748W',
    sideNumber: 'Z1-WH-01',
    color: 'White',
    type: 'CAR',
    picture: {
      id: '9818875c-9e8b-4dc5-98ae-5909a8d632e2',
      name: '9818875c-9e8b-4dc5-98ae-5909a8d632e2',
      extension: null,
      contentType: null,
    },
    rangeKm: 134,
    batteryLevelPct: 86,
    reservationEnd: null,
    reservation: null,
    status: 'AVAILABLE',
    locationDescription: null,
    address: null,
    mapColor: {
      rgb: 'ffffff',
      alpha: 0.5,
    },
    promotion: null,
    id: '00000000-0000-0000-0005-000000000001',
    name: 'Nissan Leaf White',
    description: null,
    location: {
      latitude: 52.193275,
      longitude: 20.930372,
    },
    metadata: null,
  };
  const thirdVehicle: Vehicle = {
    discriminator: 'vehicle',
    platesNumber: 'WZPC001',
    sideNumber: 'Z4-PCAR-01',
    color: 'White',
    type: 'CAR',
    picture: {
      id: '61133b4c-2e9b-4da9-b22c-009baad8eadd',
      name: '61133b4c-2e9b-4da9-b22c-009baad8eadd',
      extension: null,
      contentType: null,
    },
    rangeKm: 193,
    batteryLevelPct: 98,
    reservationEnd: null,
    reservation: null,
    status: 'AVAILABLE',
    locationDescription: null,
    address: null,
    mapColor: {
      rgb: 'ffffff',
      alpha: 0.5,
    },
    promotion: null,
    id: '00000000-0000-0000-0005-000000000004',
    name: 'Enigma Python Car',
    description: null,
    location: {
      latitude: 52.193891367697,
      longitude: 20.930564789789,
    },
    metadata: null,
  };

  veh.push(firstVehicle, secondVehicle, thirdVehicle);

  addCustomMarkers(
    veh.map((v) => {
      return { lat: v.location.latitude, lng: v.location.longitude };
    }),
    map
  );
}

export interface VehiclesWrapper {
  objects: Vehicle[];
}

export interface PoisWrapper {
  objects: Poi[];
}

export interface ParkingsWrapper {
  objects: Parking[];
}
