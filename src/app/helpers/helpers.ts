import * as L from 'leaflet';
import { CustomMarker } from '../models/CustomMarker';
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
    veh.map((vehicle) => {
      return createCustomMarkerFromVehicle(vehicle);
    }),
    map
  );
}

export function addPOIMarkersToClusterGroup(
  pois: ReadonlyArray<Poi>,
  map: L.Map
) {
  addCustomMarkersToClusterGroup(
    pois.map((poi) => {
      return createCustomMarkerFromPOI(poi);
    }),
    map
  );
}

export function addParkingMarkersToClusterGroup(
  parkings: ReadonlyArray<Parking>,
  map: L.Map
) {
  addCustomMarkersToClusterGroup(
    parkings.map((parking) => {
      return createCustomMarkerFromParking(parking);
    }),
    map
  );
}

export function createCustomMarkerFromParking(parking: Parking): CustomMarker {
      return {
    lat: parking.location.latitude,
    lng: parking.location.longitude,
    discriminator: parking.discriminator,
        status: '',
        name: '',
        sideNumber: '',
        description: '',
        address: {
      street: parking.address.street,
      house: parking.address.house,
        },
    spacesCount: parking.spacesCount,
    availableSpacesCount: parking.availableSpacesCount,
      };
}

export function createCustomMarkerFromPOI(poi: Poi): CustomMarker {
  return {
    lat: poi.location.latitude,
    lng: poi.location.longitude,
    discriminator: poi.discriminator,
    status: '',
    name: poi.name,
    sideNumber: '',
    description: poi.description,
    address: {
      street: '',
      house: '',
    },
    spacesCount: 0,
    availableSpacesCount: 0,
    };
}

export function createCustomMarkerFromVehicle(vehicle: Vehicle): CustomMarker {
  return {
    lat: vehicle.location.latitude,
    lng: vehicle.location.longitude,
    discriminator: vehicle.discriminator,
    status: vehicle.status,
    name: vehicle.name,
    sideNumber: vehicle.sideNumber,
    description: '',
    address: {
      street: '',
      house: '',
    },
    spacesCount: 0,
    availableSpacesCount: 0,
  };
}

export function addCustomMarkersToClusterGroup(
  markers: Array<CustomMarker>,
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

function generateMarkerPopupsContent(
  item: CustomMarker
): ((layer: L.Layer) => L.Content) | L.Content | L.Popup {
  let firstLine = '';

  switch (item.discriminator) {
    case vehicleString:
      firstLine = item.name;
      break;
    case poiString:
      firstLine = item.description;
      break;
    case parkingString:
      firstLine = `Parking ${item.address.street} ${item.address.house}`;
      break;

    default:
      firstLine = '';
      break;
  }

  let secondLine = '';

  switch (item.discriminator) {
    case vehicleString:
      secondLine = `${item.sideNumber} ${item.status}`;
      break;
    case poiString:
      secondLine = '';
      break;
    case parkingString:
      secondLine = `Available ${item.availableSpacesCount} of ${item.spacesCount}`;
      break;

    default:
      secondLine = '';
      break;
  }

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
