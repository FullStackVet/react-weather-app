import { useEffect, useRef, useState } from "react";
import type { UnitSystem, WeatherApiResponse } from "../types/weatherTypes";
import { HourlyWeatherUtils } from "../utils/hourlyWeatherUtils";
import { UnitUtils } from "../utils/unitUtils";

interface HourlyWeatherCardProps {
  weatherData: WeatherApiResponse;
  unitSystem: UnitSystem;
}

export default function HourlyWeather({
  weatherData,
  unitSystem,
}: HourlyWeatherCardProps) {
  // states for horizontal scroll arrows.
  // right === true as there's more hours. left === false as we start at index 0
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  // ref for horizontal scroll container
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollIntervalRef = useRef<number | null>(null);

  // extract hourly data from the hourlyWeatherUtils
  const hourlyData = HourlyWeatherUtils.getHourlyData(weatherData);

  // validate need for arrows on scroll position
  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      // use a 10 px buffer
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  // hold-to-scroll function
  const startScrolling = (direction: "left" | "right") => {
    // clear any existing interval
    if (scrollIntervalRef.current !== null) {
      window.clearInterval(scrollIntervalRef.current);
    }
    // create new interval for continuous scroll IF inside the scrollable container with smooth scroll
    scrollIntervalRef.current = window.setInterval(() => {
      if (scrollContainerRef.current) {
        const scrollAmount = direction === "left" ? -300 : 300;
        scrollContainerRef.current.scrollBy({
          left: scrollAmount,
          behavior: "smooth",
        });
      }
    }, 100); // adjust for scroll speed in testing
  };

  // stop continuous scroll
  const stopScrolling = () => {
    if (scrollIntervalRef.current !== null) {
      window.clearInterval(scrollIntervalRef.current);
      scrollIntervalRef.current = null;
    }
  };

  // single-click scroll function
  const scroll = (direction: "left" | "right") => {
    // validate scrollable container
    if (scrollContainerRef.current) {
      const scrollAmount = direction === "left" ? -525 : 525;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (scrollIntervalRef.current !== null) {
        window.clearInterval(scrollIntervalRef.current);
      }
    };
  }, []);

  // check scroll position on mount and when data changes
  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [weatherData]);

  return (
    <section className="w-full px-4 py-6">
      {/* Container */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-6 max-w-4xl mx-auto border border-white/20">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl md:text-3xl font-semibold text-white drop-shadow-md">
            24-Hour Forecast
          </h1>
        </div>

        {/* Scrollable Cards Container w/Arrows  */}
        <div className="relative">
          {/* Left Arrow */}
          {showLeftArrow && (
            <button
              onClick={() => scroll("left")}
              onMouseDown={() => startScrolling("left")}
              onMouseUp={stopScrolling}
              onTouchStart={() => startScrolling("left")}
              onTouchEnd={stopScrolling}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-black/30 rounded-full p-2 hover:bg-black/50 transition-all"
              aria-label="Scroll Left"
            >
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
          )}

          {/* Hourly Cards Container */}
          <div
            ref={scrollContainerRef}
            onScroll={checkScroll}
            className="flex overflow-x-auto scrollbar-hide space-x-4 py-4"
          >
            {hourlyData.map((hour, index) => (
              <div
                key={index}
                className="flex-none w-40 bg-white/05 backdrop-blur-sm rounded-xl p-4 border border-white/20"
              >
                <p className="text-white font-semibold text-center mb-2">
                  {HourlyWeatherUtils.formatTime(hour.time)}
                </p>
                <img
                  src={hour.condition.icon}
                  alt={hour.condition.text}
                  className="w-12 h-12 mx-auto mb-2"
                />
                <p className="text-white text-center text-xl font-bold">
                  {Math.floor(UnitUtils.getTemperature(hour, unitSystem))}{" "}
                  {UnitUtils.getTemperatureSymbol(unitSystem)}
                </p>
                <p className="text-white/90 text-center font-semibold text-md mt-1">
                  {hour.condition.text}
                </p>
                {/* Feels Like */}
                <div className="mb-2 text-center">
                  <p className="text-white/90 font-semibold text-lg">
                    Feels Like
                  </p>
                  <p className="text-white text-md">
                    {Math.floor(UnitUtils.getFeelsLike(hour, unitSystem))}{" "}
                    {UnitUtils.getTemperatureSymbol(unitSystem)}
                  </p>
                </div>

                {/* Chance of Precip */}
                <div className="mt-2 text-center">
                  <p className="text-white/90 font-semibold text-lg">P.O.P</p>
                  <p className="text-white text-md">
                    {HourlyWeatherUtils.getChanceOfPrecipitation(hour)}%
                  </p>
                </div>

                {/* Wind */}
                <div className="mt-2 text-center">
                  <p className="text-white/90 font-semibold text-lg">Wind</p>
                  <p className="text-white text-md">
                    {Math.floor(UnitUtils.getWindSpeed(hour, unitSystem))}{" "}
                    {UnitUtils.getWindSpeedSymbol(unitSystem)}
                  </p>
                </div>
              </div>
            ))}
            ;
          </div>
          {/* Right Arrow */}
          {showRightArrow && (
            <button
              onClick={() => scroll("right")}
              onMouseDown={() => startScrolling("right")}
              onMouseUp={stopScrolling}
              onTouchStart={() => startScrolling("right")}
              onTouchEnd={stopScrolling}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-black/30 rounded-full p-2 hover:bg-black/50 transition-all"
              aria-label="Scroll Right"
            >
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
