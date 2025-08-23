// /src/utils/weeklyWeatherUtils.ts
import type { ForecastDay, WeatherApiResponse } from "../types/weatherTypes";

export const WeeklyWeatherUtils = {
  // Get the next 5 days of forecast data (excluding today)
  getWeeklyData: (weatherData: WeatherApiResponse): ForecastDay[] => {
    const { forecast } = weatherData;

    // The API returns forecast data in order starting from today
    // Simply skip the first day (today) and take the next 5 days
    return forecast.forecastday.slice(1, 6);
  },

  // Rest of your utility functions remain the same...
  formatDayOfWeek: (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { weekday: "short" });
  },

  formatDate: (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  },

  getAverageTemp: (
    day: ForecastDay,
    unitSystem: "metric" | "imperial"
  ): number => {
    if (unitSystem === "metric") {
      return (day.day.maxtemp_c + day.day.mintemp_c) / 2;
    } else {
      return (day.day.maxtemp_f + day.day.mintemp_f) / 2;
    }
  },

  getPrecipitationChance: (day: ForecastDay): number => {
    return Math.max(day.day.daily_chance_of_rain, day.day.daily_chance_of_snow);
  },

  getPrecipitationType: (day: ForecastDay): string => {
    if (day.day.daily_will_it_rain === 1) {
      return "Rain";
    } else if (day.day.daily_will_it_snow === 1) {
      return "Snow";
    } else {
      return "None";
    }
  },
};
