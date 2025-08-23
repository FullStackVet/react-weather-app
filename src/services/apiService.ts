import type {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from "axios";
import axios from "axios";

// store the env variables
const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const BASE_URL = import.meta.env.VITE_WEATHER_BASE_URL;

// validate the env variables
if (!API_KEY || !BASE_URL) {
  throw new Error(
    "Missing required env variables: VITE_WEATHER_API_KEY, VITE_WEATHER_BASE_URL"
  );
}

// create and configure axios instance
const createApiClient = (): AxiosInstance => {
  const config: AxiosRequestConfig = {
    baseURL: BASE_URL,
    timeout: 15000, // use 15 seconds to allow for mobile response time
  };
  const instance = axios.create(config);

  // request interceptor to add API Key
  instance.interceptors.request.use((cfg: InternalAxiosRequestConfig) => {
    cfg.params = {
      ...cfg.params,
      key: API_KEY,
    };
    return cfg;
  });

  // reponse interceptor for error handling
  instance.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      const status = error.response?.status;
      const message = error.response?.data || error.message;

      console.error(`API Error [${status}]:`, message);

      // switch to navigate through common errors
      switch (status) {
        case 401:
          throw new Error("Invalid API Key");
        case 403:
          throw new Error("API Access Denied");
        case 429:
          throw new Error("Rate Limit Exceeded");
        case 500:
          throw new Error("Server Error");
        default:
          throw new Error(`Request Failed: ${message}`);
      }
    }
  );
  return instance;
};

// export configured axios instance
export const apiClient = createApiClient();
