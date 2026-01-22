import axios from "axios";
import { WEATHER_API } from "./api.js";

export async function fetchCurrentWeather() {
  const response = await axios.get(WEATHER_API);
  return response.data.current_weather;
}
