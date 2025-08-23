import { UnitUtils } from "../utils/unitUtils";
import type { UnitSystem, WeatherApiResponse } from "../types/weatherTypes";

interface CurrentWeatherCardProps {
  weatherData: WeatherApiResponse;
  unitSystem: UnitSystem;
}

export default function CurrentWeatherCard({
  weatherData,
  unitSystem,
}: CurrentWeatherCardProps) {
  const { location, current } = weatherData;

  // get values in correct units
  const temperature = UnitUtils.getTemperature(current, unitSystem);
  const feelsLike = UnitUtils.getFeelsLike(current, unitSystem);
  const windSpeed = UnitUtils.getWindSpeed(current, unitSystem);
  const precipitation = UnitUtils.getPrecipitation(current, unitSystem);
  const visibility = UnitUtils.getVisibility(current, unitSystem);
  const wind_gust = UnitUtils.getGustSpeed(current, unitSystem);

  // reformat time object
  const formatLocalTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  // reformat coords to 2 decimal places
  const formatCoordinates = (coord: string | number) => {
    const num = typeof coord === "string" ? parseFloat(coord) : coord;
    return isNaN(num) ? coord : num.toFixed(2);
  };

  return (
    <section className="w-full px-4 py-6">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-6 max-w-4xl mx-auto border border-white/20">
        {/* Header Section */}
        <div className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-md mb-2">
            Current Weather
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-white drop-shadow-md">
            {location.name}, {location.country}
          </h2>
        </div>

        {/* Location and Time Details */}
        <div className="flex justify-center mb-6">
          <div className="bg-black/30 rounded-xl p-3 text-center">
            <p className="text-white">
              <span className="font-medium">Local Time: </span>{" "}
              {formatLocalTime(location.localtime)}
            </p>
            <p className="text-white mt-1">
              <span className="font-medium">Coordinates: </span> Lat:{" "}
              {formatCoordinates(location.lat)}, Long:{" "}
              {formatCoordinates(location.lon)}
            </p>
          </div>
        </div>

        {/* Main Weather Content */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-6">
          {/* Temperature Condition & Feels Like */}
          <div className="flex items-center justify-center">
            <img
              src={current.condition.icon}
              alt={current.condition.text}
              className="w-24 h-24 drop-shadow-md"
            />
            <div className="ml-4">
              <p className="text-5xl md:text-6xl font-bold text-white drop-shadow-md">
                {Math.floor(temperature)}
                <span className="text-2xl md:text-3xl">
                  {UnitUtils.getTemperatureSymbol(unitSystem)}
                </span>
              </p>
              <p className="text-xl text-white/90 mt-1">
                {current.condition.text}
              </p>
              <p className="text-xl text-white/90 mt-1">
                <span>Feels Like: </span>
                {Math.floor(feelsLike)}
                {UnitUtils.getTemperatureSymbol(unitSystem)}
              </p>
            </div>
          </div>
        </div>

        {/* Weather Details Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {/* Wind */}
          <div className="bg-black/30 rounded-xl p-4 text-center">
            <p className="text-white/80 mb-1">Wind</p>
            <p className="text-white text-xl font-semibold">
              {Math.floor(windSpeed)} {UnitUtils.getWindSpeedSymbol(unitSystem)}
            </p>
          </div>

          {/* Gust */}
          <div className="bg-black/30 rounded-xl p-4 text-center">
            <p className="text-white/80 mb-1">Gust</p>
            <p className="text-white text-xl font-semibold">
              {Math.floor(wind_gust)} {UnitUtils.getWindSpeedSymbol(unitSystem)}
            </p>
          </div>

          {/* Humidity */}
          <div className="bg-black/30 rounded-xl p-4 text-center">
            <p className="text-white/80 mb-1">Humidity</p>
            <p className="text-white text-xl font-semibold">
              {current.humidity}%
            </p>
          </div>

          {/* Humidity */}
          <div className="bg-black/30 rounded-xl p-4 text-center">
            <p className="text-white/80 mb-1">Precipitation</p>
            <p className="text-white text-xl font-semibold">
              {precipitation} {UnitUtils.getPrecipitationSymbol(unitSystem)}
            </p>
          </div>

          {/* UV Index */}
          <div className="bg-black/30 rounded-xl p-4 text-center">
            <p className="text-white/80 mb-1">UV Index</p>
            <p className="text-white text-xl font-semibold">{current.uv}</p>
          </div>

          {/* Visibility */}
          <div className="bg-black/30 rounded-xl p-4 text-center">
            <p className="text-white/80 mb-1">Visibility</p>
            <p className="text-white text-xl font-semibold">
              {visibility} {UnitUtils.getVisibilitySymbol(unitSystem)}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
