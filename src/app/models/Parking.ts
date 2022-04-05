export interface Parking {
  discriminator: string;
  location: {
    latitude: number;
    longitude: number;
  };
  address: {
    street: string;
    house: string;
  };
  spacesCount: number;
  availableSpacesCount: number;
}
