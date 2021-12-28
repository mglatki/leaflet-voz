export interface Parking {
  discriminator: string;
  location: {
    latitude: number;
    longitude: number;
  };
}
