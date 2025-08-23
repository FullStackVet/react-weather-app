import { useState } from "react";
import type { UnitSystem, WeatherApiResponse } from "../types/weatherTypes";

export function useWeatherData() {
  const [weatherData, setWeatherData] = useState<WeatherApiResponse | null>(
    null
  );
  const [unitSystem, setUnitSystem] = useState<UnitSystem>("metric");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleUnitSystem = () => {
    setUnitSystem((prev) => (prev === "metric" ? "imperial" : "metric"));
  };

  return {
    weatherData,
    unitSystem,
    loading,
    error,
    setWeatherData,
    setUnitSystem,
    setLoading,
    setError,
    toggleUnitSystem,
  };
}
