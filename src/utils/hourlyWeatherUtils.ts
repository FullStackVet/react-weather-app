// extract desired hourly data from API for 24-hour [0-23 index]
import type { HourlyForecast, WeatherApiResponse } from "../types/weatherTypes";

export const HourlyWeatherUtils = {
  // get hourly data from current hour to same hour tomorrow via Types
  getHourlyData: (weatherData: WeatherApiResponse): HourlyForecast[] => {
    const { forecast, location } = weatherData;
    const currentTime = new Date(location.localtime);
    const currentHour = currentTime.getHours();

    // get today and tomorrow's hourly data
    const todayHours = forecast.forecastday[0].hour;
    const tomorrowHours = forecast.forecastday[1]?.hour || [];

    // filter reminaing hours in today
    const remainingHoursToday = todayHours.filter((hour) => {
      const hourTime = new Date(hour.time).getHours();
      return hourTime >= currentHour;
    });

    // get hours from tomorrow up to same current time
    const tomorrowSameTimeHours = tomorrowHours.filter((hour) => {
      const hourTime = new Date(hour.time).getHours();
      return hourTime <= currentHour;
    });

    // combine them
    return [...remainingHoursToday, ...tomorrowSameTimeHours];
  },

  // check if it will rain or snow for each hour
  getChanceOfPrecipitation: (hour: HourlyForecast): number => {
    if (hour.will_it_rain === 1) {
      return hour.chance_of_rain;
    } else if (hour.will_it_snow === 1) {
      return hour.chance_of_snow;
    }
    return 0;
  },

  // format time to display on cards in 12-hour (2pm, 10am, etc)
  formatTime: (timeString: string): string => {
    const date = new Date(timeString);
    return date.toLocaleTimeString([], { hour: "numeric", hour12: true });
  },
};
