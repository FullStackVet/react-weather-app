import type { UnitSystem, WeatherApiResponse } from "../types/weatherTypes";
import { UnitUtils } from "../utils/unitUtils";
import { WeeklyWeatherUtils } from "../utils/weeklyWeatherUtils";

interface WeatherForecastCardProps {
  weatherData: WeatherApiResponse;
  unitSystem: UnitSystem;
}

export default function WeeklyForecastCard({
  weatherData,
  unitSystem,
}: WeatherForecastCardProps) {
  const weeklyData = WeeklyWeatherUtils.getWeeklyData(weatherData);
  // TEMPORARY TESTING LOGS TO GATHER DAYS
  console.log(
    "All forecast days:",
    weatherData.forecast.forecastday.map((d) => d.date)
  );
  console.log(
    "Today's date:",
    new Date(weatherData.location.localtime).toISOString().split("T")[0]
  );
  console.log(
    "Filtered weekly data:",
    weeklyData.map((d) => d.date)
  );
  return (
    <section className="w-full px-4 py-6">
      {/* Container */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-6 max-w-4xl mx-auto border border-white/20">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl md:text-3xl font-semibold text-white drop-shadow-md">
            5-Day Outlook
          </h1>
        </div>

        {/* 5-Day Forecast Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {weeklyData.map((day, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 text-center"
            >
              <p className="text-white font-semibold">
                {new Date(day.date + "T12:00:00").toLocaleDateString("en-US", {
                  weekday: "short",
                })}
              </p>
              <p className="text-white/80 text-sm mb-2">
                {new Date(day.date + "T12:00:00").toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </p>
              <img
                src={day.day.condition.icon}
                alt={day.day.condition.text}
                className="w-12 h-12 mx-auto mb-2"
              />
              <p className="text-white font-bold text-lg mb-1">
                {day.day.condition.text}
              </p>
              <div className="flex justify-center items-center space-x-2 mb-2">
                <p className="text-white font-bold">
                  High:{" "}
                  {unitSystem === "metric"
                    ? Math.floor(day.day.maxtemp_c)
                    : Math.floor(day.day.maxtemp_f)}{" "}
                  {UnitUtils.getTemperatureSymbol(unitSystem)}
                </p>
              </div>
              <div className="flex justify-center items-center space-x-2 mb-2">
                <p className="text-white font-bold">
                  Low:{" "}
                  {unitSystem === "metric"
                    ? Math.floor(day.day.mintemp_c)
                    : Math.floor(day.day.mintemp_f)}{" "}
                  {UnitUtils.getTemperatureSymbol(unitSystem)}
                </p>
              </div>
              <div className="mt-2">
                <p className="text-white font-bold">
                  P.O.P:{" "}
                  {Math.round(WeeklyWeatherUtils.getPrecipitationChance(day))}%
                </p>
              </div>
            </div>
          ))}
          <div></div>
        </div>
      </div>
    </section>
  );
}
