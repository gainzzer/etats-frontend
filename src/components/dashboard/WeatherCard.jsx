import { useEffect, useState } from "react";
import { fetchCurrentWeather } from "../../services/WeatherApi.js";

function getErrorMessage(err, fallback) {
  try {
    const msg = err?.response?.data?.message || err?.message || "";
    return String(msg).trim() || fallback;
  } catch {
    return fallback;
  }
}

export default function WeatherCard() {
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadWeather() {
    try {
      setError("");
      setLoading(true);
      const data = await fetchCurrentWeather();
      setWeather(data || null);
    } catch (err) {
      setWeather(null);
      setError(getErrorMessage(err, "Failed to load weather"));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadWeather();
  }, []);

  return (
    <div className="card p-3">
      <h5 className="mb-2">Today's Weather (Amman)</h5>

      {error ? <div className="text-danger">{error}</div> : null}

      {loading && !error ? <div className="text-muted">Loading...</div> : null}

      {weather && !loading ? (
        <>
          <div>
            Temperature: <strong>{weather.temperature}°C</strong>
          </div>
          <div>
            Wind Speed: <strong>{weather.windspeed} km/h</strong>
          </div>

          <button className="btn btn-sm btn-outline-secondary mt-2" type="button" onClick={loadWeather}>
            Refresh
          </button>
        </>
      ) : null}
    </div>
  );
}
