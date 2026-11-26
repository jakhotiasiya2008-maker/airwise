export type CpcbCategory =
  | "Good"
  | "Satisfactory"
  | "Moderate"
  | "Poor"
  | "Very Poor"
  | "Severe";

export interface CpcbCategoryInfo {
  category: CpcbCategory;
  min: number;
  max: number;
  colorClass: string;
  bgClass: string;
  borderClass: string;
  hexColor: string;
  textColor: string;
  shortDescription: string;
  healthImplication: string;
}

export interface AirQualityReading {
  aqi: number;
  cpcbCategory: CpcbCategory;
  pm25: number;
  pm10: number;
  usAqi?: number;
  europeanAqi?: number;
  source: string;
  stationOrLocation: string;
  latitude: number;
  longitude: number;
  timestampUtc: string;
  timestampIst: string;
  isModelled: boolean;
}

export interface AirQualityProvider {
  name: string;
  fetchCurrentAirQuality(
    lat: number,
    lon: number,
    locationName?: string
  ): Promise<AirQualityReading>;
}

export interface CityLocation {
  id: number | string;
  name: string;
  state?: string;
  country: string;
  latitude: number;
  longitude: number;
}
