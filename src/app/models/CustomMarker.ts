export interface CustomMarker {
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
}
