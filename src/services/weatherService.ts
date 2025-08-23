import type {
  LocationSuggestion,
  WeatherApiResponse,
} from "../types/weatherTypes";
import { apiClient } from "./apiService";

// weather API service functions
export const WeatherService = {
  // get current weather and forecast
  getForecast: async (
    location: string,
    days: number = 7,
    options: { airQuality?: boolean; alerts?: boolean } = {}
  ): Promise<WeatherApiResponse> => {
    try {
      const response = await apiClient.get<WeatherApiResponse>(
        "/forecast.json",
        {
          params: {
            q: location,
            days,
            aqi: options.airQuality ? "yes" : "no",
            alerts: options.alerts ? "yes" : "no",
          },
        }
      );
      return response.data;
    } catch (error) {
      // error handling w/ unknown type
      let errorMessage = "Failed to fetch weather data";
      if (error instanceof Error) {
        errorMessage = `${errorMessage}: ${error.message}`;
      } else if (typeof error === "string") {
        errorMessage = `${errorMessage}: ${error}`;
      }
      throw new Error(errorMessage);
    }
  },

  // search suggestions for location search
  getLocationSuggestions: async (
    query: string
  ): Promise<LocationSuggestion[]> => {
    try {
      const response = await apiClient.get<LocationSuggestion[]>(
        "/search.json",
        {
          params: { q: query },
        }
      );
      return response.data;
    } catch (error) {
      let errorMessage = "Failed to retrieve location suggestions";
      if (error instanceof Error) {
        errorMessage = `${errorMessage}: ${error.message}`;
      } else if (typeof error === "string") {
        errorMessage = `${errorMessage}: ${error}`;
      }
      throw new Error(errorMessage);
    }
  },

  // search for locations (alias for getLocationSuggestions)
  searchLocations: async (query: string): Promise<LocationSuggestion[]> => {
    return WeatherService.getLocationSuggestions(query);
  },

  // get historical weather data
  getHistory: async (location: string, date: string) => {
    try {
      const response = await apiClient.get("/history.json", {
        params: {
          q: location,
          dt: date,
        },
      });
      return response.data;
    } catch (error) {
      let errorMessage = "Failed to retrieve historical data";

      if (error instanceof Error) {
        errorMessage = `${errorMessage} : ${error.message}`;
      } else if (typeof error === "string") {
        errorMessage = `${errorMessage}: ${error}`;
      }
      throw new Error(errorMessage);
    }
  },
};
