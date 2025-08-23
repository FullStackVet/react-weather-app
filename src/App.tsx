import CurrentWeatherCard from "./components/CurrentWeatherCard";
import SearchCard from "./components/SearchCard";
import HourlyWeather from "./components/HourlyWeather";
import WeeklyForecastCard from "./components/WeeklyForecastCard";
import { useWeatherData } from "./hooks/useWeatherData";

function App() {
  const { weatherData, unitSystem, setWeatherData, toggleUnitSystem } =
    useWeatherData();

  return (
    <div className="h-dvh w-full overflow-auto bg-gradient-to-br from-purple-400 to-purple-50">
      <SearchCard
        onWeatherData={setWeatherData}
        unitSystem={unitSystem}
        onUnitChange={toggleUnitSystem}
      />
      {weatherData && (
        <CurrentWeatherCard weatherData={weatherData} unitSystem={unitSystem} />
      )}
      {weatherData && (
        <HourlyWeather weatherData={weatherData} unitSystem={unitSystem} />
      )}
      {weatherData && (
        <WeeklyForecastCard weatherData={weatherData} unitSystem={unitSystem} />
      )}
    </div>
  );
}

export default App;
