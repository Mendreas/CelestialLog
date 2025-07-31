
export enum ObjectType {
  Star = "Star",
  Galaxy = "Galaxy",
  Cluster = "Cluster",
  Nebula = "Nebula",
  Planet = "Planet",
  Other = "Other"
}

export enum DistanceUnit {
  LightYears = "Light Years",
  MillionLightYears = "Million Light Years",
  Parsecs = "Parsecs",
  AU = "AU",
  Km = "Km"
}

export interface Observation {
  id: string;
  objectName: string;
  type: ObjectType;
  observationDate: string; // DDMMYYYY
  location: string;
  ra: string;
  dec: string;
  magnitude: string;
  distanceValue: string;
  distanceUnit: DistanceUnit;
  description: string;
  imageUrl?: string;
  imageFile?: string; // a base64 string
  isFavorite: boolean;
}

export enum Tab {
  Home = "Home",
  Objects = "Objects",
  Resources = "Resources",
  Calendar = "Calendar",
  Settings = "Settings"
}

export interface AstroEvent {
    date: string; // YYYY-MM-DD
    name: string;
    description: string;
}

export interface VisibleObject {
  name: string;
  type: string;
  distance: string;
  description: string;
  imageUrl: string;
  wikiUrl: string;
}
