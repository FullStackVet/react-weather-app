import type React from "react";
import { useState } from "react";
import type { UnitSystem, WeatherApiResponse } from "../types/weatherTypes";
import { WeatherService, WeatherUtils } from "../services";

// testing API calls and returns
const WeatherTest: React.FC = () => {
  const [location, setLocation] = useState("");
  const [weatherData, setWeatherData] = useState<WeatherApiResponse | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unitSystem, setUnitSystem] = useState<UnitSystem>("metric");

  // helper functions to convert num to boolean (EX: will_it_rain and is it day)
  const formatBoolean = (value: number): string => {
    return value === 1 ? "Yes" : "No";
  };
  const formatDayNight = (value: number): string => {
    return value === 1 ? "Day" : "Night";
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!location.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const data = await WeatherService.getForecast(location, 7, {
        airQuality: true,
        alerts: true,
      });
      setWeatherData(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "unknown error occurred";
      setError(errorMessage);
      console.error("Error fetching weather data", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleUnitSystem = () => {
    setUnitSystem((prev) => (prev === "metric" ? "imperial" : "metric"));
  };

  if (loading) return <div>Loading Weather Data...</div>;

  return (
    <div className="py-20 px-20 font-mono">
      <h1>Weather API Test</h1>
      <form onSubmit={handleSearch} className="mb-20">
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Enter City Name..."
          className="py-8 px-8 mr-10 w-200"
        />
        <button type="submit" className="py-8 px-16">
          Search
        </button>
        <button
          type="button"
          onClick={toggleUnitSystem}
          className="ml-10 py-8 px-16"
        >
          Switch to {unitSystem === "metric" ? "Imperial" : "Metric"}
        </button>
      </form>
      {error && <div className="text-red-400 mb-20">Error: {error}</div>}
      {weatherData && (
        <div>
          <h2>Current Weather</h2>
          <div className="border border-solid py-10 px-10 mb-20">
            <h3>
              {weatherData.location.name}, {weatherData.location.country}
            </h3>
            <p>Local Time: {weatherData.location.localtime}</p>
            <p>
              Temperature:{" "}
              {WeatherUtils.getTemperature(weatherData.current, unitSystem)}°{" "}
              {unitSystem === "metric" ? "C" : "F"}
            </p>
            <p>Condition: {weatherData.current.condition.text}</p>
            <img
              src={weatherData.current.condition.icon}
              alt={weatherData.current.condition.text}
            />
            <p>
              Feels Like:{" "}
              {WeatherUtils.getFeelsLike(weatherData.current, unitSystem)}°{" "}
              {unitSystem === "metric" ? "C" : "F"}
            </p>
            <p>
              Wind: {WeatherUtils.getWindSpeed(weatherData.current, unitSystem)}{" "}
              {WeatherUtils.getWindUnit(unitSystem)}
            </p>
            <p>Humidity: {weatherData.current.humidity}%</p>
            <p>
              Precipitation:{" "}
              {WeatherUtils.getPrecipitation(weatherData.current, unitSystem)}{" "}
              {WeatherUtils.getPrecipitationUnit(unitSystem)}
            </p>
            <p>UV Index: {weatherData.current.uv} </p>
            <p>Is Day: {formatDayNight(weatherData.current.is_day)}</p>
          </div>
          <h2>Next 48 Hours</h2>
          <div className="flex flex-col overflow-auto gap-10 mb-20">
            {weatherData.forecast.forecastday[0].hour
              .slice(0, 24)
              .map((hour, index) => (
                <div
                  key={index}
                  className="border border-solid py-10 px-10 min-w-120"
                >
                  <p>Time: {hour.time.split(" ")[1]}</p>
                  <p>
                    Temp: {WeatherUtils.getTemperature(hour, unitSystem)}°{" "}
                    {unitSystem === "metric" ? "C" : "F"}
                  </p>
                  <p>{hour.condition.text}</p>
                  <img src={hour.condition.icon} alt={hour.condition.text} />
                  <p>
                    Wind: {WeatherUtils.getWindSpeed(hour, unitSystem)}{" "}
                    {WeatherUtils.getWindUnit(unitSystem)}
                  </p>
                  <p>Rain: {hour.chance_of_rain}%</p>
                  <p>Will It Rain: {formatBoolean(hour.will_it_rain)}</p>
                  <p>Is Day: {formatDayNight(hour.is_day)}</p>
                </div>
              ))}
          </div>
          <h2>7-Day Forecast</h2>
          <div className="flex flex-wrap gap-10 mb-20">
            {weatherData.forecast.forecastday.map((day, index) => (
              <div
                key={index}
                className="border border-solid py-10 px-10 min-w-150"
              >
                <h3>{day.date}</h3>
                <p>
                  High:{" "}
                  {WeatherUtils.getTemperature(day.day, unitSystem, "max")}°{" "}
                  {unitSystem === "metric" ? "C" : "F"}
                </p>
                <p>
                  Low: {WeatherUtils.getTemperature(day.day, unitSystem, "min")}
                  ° {unitSystem === "metric" ? "C" : "F"}
                </p>
                <p>{day.day.condition.text}</p>
                <img
                  src={day.day.condition.icon}
                  alt={day.day.condition.text}
                />
                <p>Will It Rain: {formatBoolean(day.day.daily_will_it_rain)}</p>
                <p>Rain: {day.day.daily_chance_of_rain}%</p>
                <p>Will It Snow: {formatBoolean(day.day.daily_will_it_snow)}</p>
              </div>
            ))}
          </div>
          <h2>Raw API Response</h2>
          <pre className="py-10 px-10 overflow-auto max-h-400 border border-solid">
            {JSON.stringify(weatherData, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default WeatherTest;
