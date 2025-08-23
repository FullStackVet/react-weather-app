// weather condition
export interface WeatherCondtion {
  text: string;
  icon: string;
  code: number;
}

// for dynamically populating the search dropdown suggestions
export interface LocationSuggestion {
  id: number;
  name: string;
  region: string;
  country: string;
  lat: number;
  lon: number;
  url: string;
}

// weather location
export interface WeatherLocation {
  name: string;
  region: string;
  country: string;
  lat: string;
  lon: string;
  tz_id: string;
  localtime_epoch: number;
  localtime: string;
}

// union type for unit conversion (metric or imperial)
export type UnitSystem = "metric" | "imperial";

// astrological data
export interface Astro {
  sunrise: string;
  sunset: string;
  moonrise: string;
  moonset: string;
  moon_phase: string;
  moon_illumination: number;
  is_moon_up: number;
  is_sun_up: number;
}

// optional air quality data
export interface AirQuality {
  co?: number;
  no2?: number;
  o3?: number;
  so2?: number;
  pm2_5?: number;
  pm10?: number;
  "us-epa-index"?: number;
  "gb-defra-index"?: number;
}

// current weather
export interface CurrentWeather {
  last_updated: string;
  last_updated_epoch: number;
  is_day: number;
  condition: WeatherCondtion;
  temp_c: number;
  temp_f: number;
  feelslike_c: number;
  feelslike_f: number;
  wind_kph: number;
  wind_mph: number;
  wind_dir: string;
  gust_kph: number;
  gust_mph: number;
  precip_mm: number;
  precip_in: number;
  humidity: number;
  uv: number;
  vis_km: number;
  vis_miles: number;
  // optional fields
  air_quality?: AirQuality;
  short_rad?: number;
  diff_rad?: number;
  dni?: number;
  gti?: number;
}

// day forecast
export interface DayForecast {
  maxtemp_c: number;
  maxtemp_f: number;
  mintemp_c: number;
  mintemp_f: number;
  maxwind_mph: number;
  maxwind_kph: number;
  daily_will_it_rain: number;
  daily_chance_of_rain: number;
  daily_will_it_snow: number;
  daily_chance_of_snow: number;
  totalprecip_in: number;
  totalprecip_mm: number;
  totalsnow_cm: number;
  avghumidity: number;
  condition: WeatherCondtion;
  uv: number;
}

// hourly forecast
export interface HourlyForecast {
  time_epoch: number;
  time: string;
  temp_c: number;
  temp_f: number;
  feelslike_c: number;
  feelslike_f: number;
  is_day: number;
  condition: WeatherCondtion;
  wind_mph: number;
  wind_kph: number;
  wind_dir: string;
  gust_kph: number;
  gust_mph: number;
  will_it_rain: number;
  chance_of_rain: number;
  will_it_snow: number;
  chance_of_snow: number;
  snow_cm: number;
  precip_mm: number;
  precip_in: number;
  humidity: number;
  windchill_c: number;
  windchill_f: number;
  vis_km: number;
  vis_miles: number;
  uv: number;
  // optional fields
  air_quality?: AirQuality;
  short_rad?: number;
  diff_rad?: number;
  dni?: number;
  gti?: number;
}

// forecast Day (with Hourly array to populate with multiple hours)
export interface ForecastDay {
  date: string;
  date_epoch: number;
  day: DayForecast;
  astro: Astro;
  hour: HourlyForecast[];
}

// forecast
export interface Forecast {
  forecastday: ForecastDay[];
}

// main response
export interface WeatherApiResponse {
  location: WeatherLocation;
  current: CurrentWeather;
  forecast: Forecast;
}
