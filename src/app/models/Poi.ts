export interface Poi {
  discriminator: string;
  location: {
    latitude: number;
    longitude: number;
  };
  description: string;
  name: string;
}
