import * as L from 'leaflet';
import { Parking } from '../models/Parking';
import { Poi } from '../models/Poi';
import { Vehicle } from '../models/Vehicle';

const vehicleString: string = 'vehicle';
const poiString: string = 'poi';
const parkingString: string = 'parking';

export function addCustomMarkers(
  markers: Array<{ lat: number; lng: number }>,
  map: L.Map
): void {
  markers.forEach((item) => {
    L.marker([item.lat, item.lng])
      .addTo(map)
      .bindPopup(`Lat ${item.lat}, lng ${item.lng}`);
  });
}

export function addVehicleMarkersToClusterGroup(
  veh: ReadonlyArray<Vehicle>,
  map: L.Map
) {
  addCustomMarkersToClusterGroup(
    veh.map((v) => {
      return {
        lat: v.location.latitude,
        lng: v.location.longitude,
        discriminator: v.discriminator,
        status: v.status,
        name: v.name,
        sideNumber: v.sideNumber,
        description: '',
        address: {
          street: '',
          house: '',
        },
        spacesCount: 0,
        availableSpacesCount: 0,
      };
    }),
    map
  );
}

export function addPOIMarkersToClusterGroup(
  pois: ReadonlyArray<Poi>,
  map: L.Map
) {
  addCustomMarkersToClusterGroup(
    pois.map((p) => {
      return {
        lat: p.location.latitude,
        lng: p.location.longitude,
        discriminator: p.discriminator,
        status: '',
        name: p.name,
        sideNumber: '',
        description: p.description,
        address: {
          street: '',
          house: '',
        },
        spacesCount: 0,
        availableSpacesCount: 0,
      };
    }),
    map
  );
}

export function addParkingMarkersToClusterGroup(
  parkings: ReadonlyArray<Parking>,
  map: L.Map
) {
  addCustomMarkersToClusterGroup(
    parkings.map((p) => {
      return {
        lat: p.location.latitude,
        lng: p.location.longitude,
        discriminator: p.discriminator,
        status: '',
        name: '',
        sideNumber: '',
        description: '',
        address: {
          street: p.address.street,
          house: p.address.house,
        },
        spacesCount: p.spacesCount,
        availableSpacesCount: p.availableSpacesCount,
      };
    }),
    map
  );
}

export function addCustomMarkersToClusterGroup(
  markers: Array<{
    lat: number;
    lng: number;
    discriminator: string;
    status: string;
    name: string;
    sideNumber: string;
    description: string;
    address: {
      street: string;
      house: string;
    };
    spacesCount: number;
    availableSpacesCount: number;
  }>,
  map: L.Map
): L.MarkerClusterGroup {
  const markerClusterGroup = L.markerClusterGroup({
    removeOutsideVisibleBounds: true,
  });

  markers.map((item) => {
    const newIcon = L.icon(generateMarkersIcon(item));
    const popup = item.discriminator;
    console.log(popup);
    markerClusterGroup.addLayer(
      L.marker([item.lat, item.lng], { icon: newIcon }).bindPopup(
        generateMarkerPopupsContent(item)
      )
    );
  });

  return markerClusterGroup.addTo(map);
}

function generateMarkerPopupsContent(item: {
  discriminator: string;
  status: string;
  name: string;
  sideNumber: string;
  description: string;
  address: {
    street: string;
    house: string;
  };
  spacesCount: number;
  availableSpacesCount: number;
}): ((layer: L.Layer) => L.Content) | L.Content | L.Popup {
  const firstLine =
    item.discriminator === vehicleString
      ? item.name
      : item.discriminator === poiString
      ? item.description
      : item.discriminator === parkingString
      ? `Parking ${item.address.street} ${item.address.house}`
      : '';

  const secondLine =
    item.discriminator === vehicleString
      ? `${item.sideNumber} ${item.status}`
      : item.discriminator === poiString
      ? ''
      : item.discriminator === parkingString
      ? `Available ${item.availableSpacesCount} of ${item.spacesCount}`
      : '';

  return `${firstLine}<br>${secondLine}`;
}

function generateMarkersIcon(item: {
  lat: number;
  lng: number;
  discriminator: string;
  status: string;
}): L.IconOptions {
  return {
    iconUrl:
      item.discriminator === parkingString
        ? 'assets/parking.png'
        : item.discriminator === poiString
        ? 'assets/poi.png'
        : item.status === 'AVAILABLE'
        ? 'assets/availableVehicle.png'
        : 'assets/unavailableVehicle.png',
    iconSize: [25, 39],
    iconAnchor: [12, 39],
    popupAnchor: [0, -35],
  };
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
