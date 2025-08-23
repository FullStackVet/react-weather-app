import React, { useState, useRef, useEffect, useCallback } from "react";
import { WeatherService, type UnitSystem } from "../services";
import type {
  WeatherApiResponse,
  LocationSuggestion,
} from "../types/weatherTypes";

interface SearchCardProps {
  onWeatherData: (data: WeatherApiResponse) => void;
  unitSystem: UnitSystem;
  onUnitChange: () => void;
}

// Debounce hook for API calls
function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default function SearchCard({
  onWeatherData,
  unitSystem,
  onUnitChange,
}: SearchCardProps) {
  const [location, setLocation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const debouncedLocation = useDebounce(location, 300);

  // selecting location from dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch city suggestions from WeatherAPI.com
  const fetchSuggestions = useCallback(async (query: string) => {
    if (!query.trim() || query.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setSearchLoading(true);
    try {
      const suggestions = await WeatherService.getLocationSuggestions(query);
      setSuggestions(suggestions);
      setShowSuggestions(suggestions.length > 0);
    } catch (err) {
      console.error("Error fetching location suggestions:", err);
      setSuggestions([]);
    } finally {
      setSearchLoading(false);
    }
  }, []);

  // populate suggestions list
  useEffect(() => {
    fetchSuggestions(debouncedLocation);
  }, [debouncedLocation, fetchSuggestions]);

  // clear input and suggestions list
  const clearField = () => {
    setLocation("");
    setSuggestions([]);
    setShowSuggestions(false);
  };

  // handle user selecting suggested location from dropdown
  const selectSuggestion = (suggestion: LocationSuggestion) => {
    // Format the location name with country
    const locationName = `${suggestion.name}, ${suggestion.country}`;
    setLocation(locationName);

    // Close dropdown and trigger search automatically
    setTimeout(() => {
      setShowSuggestions(false);
      handleSuggestionSearch(suggestion);
    }, 100);
  };

  // clicking suggested location causes auto-search and clears inputs
  const handleSuggestionSearch = async (suggestion: LocationSuggestion) => {
    setIsLoading(true);
    setError(null);

    try {
      // Use the specific location data from the suggestion for more accurate results
      const data = await WeatherService.getForecast(
        `${suggestion.name}, ${suggestion.country}`,
        7,
        { airQuality: true, alerts: true }
      );
      onWeatherData(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Unknown Error Occurred";
      setError(errorMessage);
      console.error("Error Fetching Weather Data", err);
    } finally {
      setIsLoading(false);
      setLocation(""); // Clear the input field
    }
  };

  // manually pressing the search button
  const locationSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!location.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const data = await WeatherService.getForecast(location, 7, {
        airQuality: true,
        alerts: true,
      });
      onWeatherData(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Unknown Error Occurred";
      setError(errorMessage);
      console.error("Error Fetching Weather Data", err);
    } finally {
      setIsLoading(false);
      setLocation("");
    }
  };

  return (
    <section className="w-full px-4 py-6">
      <h1 className="text-3xl md:text-5xl font-bold text-center mb-6 text-white drop-shadow-md">
        FullStack <span className="text-orange-400">Weather</span> App
      </h1>

      <form
        className="flex flex-col md:flex-row items-center justify-center gap-4 mb-4"
        onSubmit={locationSearch}
      >
        <div className="relative w-full md:w-96" ref={searchRef}>
          <div className="relative">
            <input
              type="text"
              value={location}
              placeholder="Search for a city..."
              onChange={(e) => setLocation(e.target.value)}
              onFocus={() => setShowSuggestions(suggestions.length > 0)}
              className="w-full px-4 py-3 pr-10 rounded-xl border border-purple-300 bg-white/90 
                         text-purple-900 placeholder-purple-400 focus:outline-none 
                         focus:ring-2 focus:ring-purple-500 focus:border-transparent
                         shadow-lg transition-all duration-200"
            />
            {location && (
              <button
                type="button"
                onClick={clearField}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-500 
                           hover:text-purple-700 transition-colors duration-200"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>

          {showSuggestions && (
            <div
              className="absolute z-10 w-full mt-1 bg-white/95 backdrop-blur-sm 
                          rounded-xl shadow-lg border border-purple-200 max-h-60 overflow-y-auto"
            >
              {searchLoading ? (
                <div className="px-4 py-3 text-purple-800 flex items-center justify-center">
                  <svg
                    className="animate-spin h-5 w-5 mr-2 text-purple-600"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Searching...
                </div>
              ) : suggestions.length > 0 ? (
                suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    onClick={() => selectSuggestion(suggestion)}
                    className="px-4 py-3 cursor-pointer hover:bg-purple-100/50 transition-colors duration-150
                             border-b border-purple-100 last:border-b-0"
                  >
                    <p className="text-purple-800 font-medium">
                      {suggestion.name}
                    </p>
                    <p className="text-purple-600 text-sm">
                      {suggestion.region && `${suggestion.region}, `}
                      {suggestion.country}
                    </p>
                  </div>
                ))
              ) : debouncedLocation.length > 1 ? (
                <div className="px-4 py-3 text-purple-600">
                  No locations found
                </div>
              ) : null}
            </div>
          )}
        </div>

        <div className="flex gap-3 w-full md:w-auto justify-center">
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400
                     text-white font-semibold rounded-xl shadow-lg transition-all duration-200
                     hover:shadow-purple-500/25 hover:-translate-y-0.5 disabled:translate-y-0
                     flex items-center justify-center min-w-[120px] hover:cursor-pointer"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Searching...
              </>
            ) : (
              "Search"
            )}
          </button>

          <button
            type="button"
            title={`Convert to ${
              unitSystem === "metric" ? "Imperial" : "Metric"
            }`}
            onClick={onUnitChange}
            className="px-4 py-3 bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 
                     hover:to-orange-600 text-white font-semibold rounded-xl shadow-lg 
                     transition-all duration-200 hover:shadow-orange-500/25 hover:-translate-y-0.5 hover:cursor-pointer"
          >
            Convert To {unitSystem === "metric" ? "°F" : "°C"}
          </button>
        </div>
      </form>

      {error && (
        <div className="text-center">
          <p className="text-red-200 bg-red-500/20 inline-block px-4 py-2 rounded-lg mt-2">
            {error}
          </p>
        </div>
      )}
    </section>
  );
}
