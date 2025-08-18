export type Location = {
  coordinates: [number, number] | string;
  slug: string;
  name: string;
  distance: number;
  formattedDistance: string;
};
