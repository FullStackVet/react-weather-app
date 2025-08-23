// handle unit symbols based on UnitSystem type

import type { UnitSystem } from "../types/weatherTypes";

export const UnitUtils = {
  getTemperature: (
    data: {
      temp_c?: number;
      temp_f?: number;
      maxtemp_c?: number;
      maxtemp_f?: number;
      mintemp_c?: number;
      mintemp_f?: number;
    },
    unit: UnitSystem,
    type: "current" | "max" | "min" = "current"
  ): number => {
    if (type === "max") {
      return unit === "metric" ? data.maxtemp_c ?? 0 : data.maxtemp_f ?? 0;
    } else if (type === "min") {
      return unit === "metric" ? data.mintemp_c ?? 0 : data.mintemp_f ?? 0;
    } else {
      return unit === "metric" ? data.temp_c ?? 0 : data.temp_f ?? 0;
    }
  },
  getFeelsLike: (
    data: { feelslike_c?: number; feelslike_f?: number },
    unit: UnitSystem
  ): number => {
    return unit === "metric" ? data.feelslike_c ?? 0 : data.feelslike_f ?? 0;
  },
  getWindSpeed: (
    data: { wind_kph: number; wind_mph: number },
    unit: UnitSystem
  ): number => {
    return unit === "metric" ? data.wind_kph : data.wind_mph;
  },
  getGustSpeed: (
    data: { gust_kph: number; gust_mph: number },
    unit: UnitSystem
  ): number => {
    return unit === "metric" ? data.gust_kph : data.gust_mph;
  },
  getPrecipitation: (
    data: { precip_mm: number; precip_in: number },
    unit: UnitSystem
  ): number => {
    return unit === "metric" ? data.precip_mm : data.precip_in;
  },
  getVisibility: (
    data: { vis_km: number; vis_miles: number },
    unit: UnitSystem
  ): number => {
    return unit === "metric" ? data.vis_km : data.vis_miles;
  },

  // conversion symbols
  getTemperatureSymbol: (unit: UnitSystem): string => {
    return unit === "metric" ? "°C" : "°F";
  },
  getWindSpeedSymbol: (unit: UnitSystem): string => {
    return unit === "metric" ? "km/h" : "mph";
  },
  getPrecipitationSymbol: (unit: UnitSystem): string => {
    return unit === "metric" ? "mm" : "in";
  },
  getVisibilitySymbol: (unit: UnitSystem): string => {
    return unit === "metric" ? "km" : "miles";
  },

  // converting between metric and imperial
  convertTemperature: (value: number, unit: UnitSystem): number => {
    if (unit === "imperial") {
      return (value * 9) / 5 + 32;
    }
    return ((value - 32) * 5) / 9;
  },
};
