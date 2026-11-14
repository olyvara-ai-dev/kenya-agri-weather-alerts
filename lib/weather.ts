export type RainfallRiskLevel = 'none' | 'light' | 'moderate' | 'heavy';

export type WeatherSnapshot = {
  source: 'open-meteo' | 'weatherapi';
  latitude: number;
  longitude: number;
  current: {
    temperature: number;
    humidity: number;
    windSpeed: number;
    weatherCode: number;
    precipitation: number;
  };
  next24HourRainfall: number;
  probability: number;
  highestRainfallPeriod: {
    hour: string;
    rainfall: number;
    probability: number;
  };
  riskLevel: RainfallRiskLevel;
  confidence: number;
  hourly: Array<{
    time: string;
    temperature: number;
    precipitation: number;
    precipitationProbability: number;
    humidity: number;
    windSpeed: number;
    weatherCode: number;
  }>;
  daily: Array<{
    date: string;
    precipitation: number;
    temperatureMax: number;
    temperatureMin: number;
  }>;
};

export type WeatherWindow = {
  start: string;
  end: string;
};

function addOneForecastHour(time: string) {
  const timestamp = Date.parse(`${time}:00Z`);
  return Number.isNaN(timestamp) ? time : new Date(timestamp + 60 * 60 * 1000).toISOString().slice(0, 16);
}

export const rainfallThresholds = {
  none: 1,
  light: 10,
  moderate: 30,
};

export function classifyRainfall(mm: number): RainfallRiskLevel {
  if (mm < rainfallThresholds.none) return 'none';
  if (mm >= rainfallThresholds.none && mm <= rainfallThresholds.light) return 'light';
  if (mm > rainfallThresholds.light && mm <= rainfallThresholds.moderate) return 'moderate';
  return 'heavy';
}

export function calculateNext24HourRainfall(hourly: Array<{ precipitation: number }>) {
  return hourly.slice(0, 24).reduce((sum, item) => sum + (Number(item.precipitation) || 0), 0);
}

export function calculateForecastConfidence(hourly: Array<{ precipitationProbability: number; precipitation: number }>) {
  if (!hourly.length) return 0.5;
  const avgProbability = hourly.reduce((sum, item) => sum + (Number(item.precipitationProbability) || 0), 0) / hourly.length;
  const rainIntensity = hourly.reduce((sum, item) => sum + (Number(item.precipitation) || 0), 0) / hourly.length;
  return Math.min(0.96, Math.max(0.4, (avgProbability + rainIntensity * 2.5) / 100));
}

export function getHighestRainfallPeriod(hourly: Array<{ time: string; precipitation: number; precipitationProbability: number }>) {
  const sorted = [...hourly].sort((a, b) => Number(b.precipitation) - Number(a.precipitation));
  const top = sorted[0] ?? { time: 'N/A', precipitation: 0, precipitationProbability: 0 };
  return {
    hour: top.time,
    rainfall: Number(top.precipitation) || 0,
    probability: Number(top.precipitationProbability) || 0,
  };
}

export function getWeatherWindows(hourly: WeatherSnapshot['hourly']) {
  function findWindow(qualifies: (hour: WeatherSnapshot['hourly'][number]) => boolean): WeatherWindow | null {
    for (let index = 0; index <= hourly.length - 3; index += 1) {
      const period = hourly.slice(index, index + 3);
      if (period.every(qualifies)) {
        return { start: period[0].time, end: addOneForecastHour(period[2].time) };
      }
    }

    return null;
  }

  return {
    planting: findWindow((hour) => hour.precipitation <= 1 && hour.precipitationProbability <= 60),
    spraying: findWindow((hour) => hour.precipitation <= 0.1 && hour.precipitationProbability <= 20 && hour.windSpeed <= 15),
  };
}

export function buildWeatherSnapshot(raw: any, source: WeatherSnapshot['source'] = 'open-meteo'): WeatherSnapshot {
  const hourlyData = (raw?.hourly ?? {}) as Record<string, any[]>;
  const dailyData = (raw?.daily ?? {}) as Record<string, any[]>;

  const hourly = (hourlyData.time ?? []).map((time: string, index: number) => ({
    time,
    temperature: Number(hourlyData.temperature_2m?.[index] ?? 0),
    precipitation: Number(hourlyData.precipitation?.[index] ?? 0),
    precipitationProbability: Number(hourlyData.precipitation_probability?.[index] ?? 0),
    humidity: Number(hourlyData.relative_humidity_2m?.[index] ?? 0),
    windSpeed: Number(hourlyData.wind_speed_10m?.[index] ?? 0),
    weatherCode: Number(hourlyData.weather_code?.[index] ?? 0),
  }));

  const daily = (dailyData.time ?? []).map((time: string, index: number) => ({
    date: time,
    precipitation: Number(dailyData.precipitation_sum?.[index] ?? 0),
    temperatureMax: Number(dailyData.temperature_2m_max?.[index] ?? 0),
    temperatureMin: Number(dailyData.temperature_2m_min?.[index] ?? 0),
  }));

  const next24HourRainfall = calculateNext24HourRainfall(
    hourly.slice(0, 24).map((entry) => ({ precipitation: entry.precipitation }))
  );

  const riskLevel = classifyRainfall(next24HourRainfall);
  const next24Hours = hourly.slice(0, 24);
  const probability = next24Hours.reduce((sum, item) => sum + (Number(item.precipitationProbability) || 0), 0) / Math.max(1, next24Hours.length);
  const confidence = calculateForecastConfidence(
    next24Hours.map((entry) => ({ precipitation: entry.precipitation, precipitationProbability: entry.precipitationProbability }))
  );

  const currentSource = raw?.current ?? hourly[0] ?? {
    temperature_2m: 0,
    temperature: 0,
    precipitation: 0,
    precipitationProbability: 0,
    relative_humidity_2m: 0,
    humidity: 0,
    wind_speed_10m: 0,
    windSpeed: 0,
    weather_code: 0,
    weatherCode: 0,
  };

  return {
    source,
    latitude: Number(raw?.latitude ?? 0),
    longitude: Number(raw?.longitude ?? 0),
    current: {
      temperature: Number(currentSource.temperature_2m ?? currentSource.temperature ?? 0),
      humidity: Number(currentSource.relative_humidity_2m ?? currentSource.humidity ?? 0),
      windSpeed: Number(currentSource.wind_speed_10m ?? currentSource.windSpeed ?? 0),
      weatherCode: Number(currentSource.weather_code ?? currentSource.weatherCode ?? 0),
      precipitation: Number(currentSource.precipitation ?? currentSource.precip_mm ?? 0),
    },
    next24HourRainfall,
    probability: Number(probability.toFixed(1)),
    highestRainfallPeriod: getHighestRainfallPeriod(
      hourly.map((entry) => ({
        time: entry.time,
        precipitation: entry.precipitation,
        precipitationProbability: entry.precipitationProbability,
      }))
    ),
    riskLevel,
    confidence: Number(confidence.toFixed(2)),
    hourly,
    daily,
  };
}

export function buildWeatherApiSnapshot(raw: any): WeatherSnapshot {
  const forecastDays = raw?.forecast?.forecastday ?? [];
  const currentEpoch = Number(raw?.current?.last_updated_epoch);
  const next24Hours = forecastDays
    .flatMap((day: any) => day.hour ?? [])
    .filter((hour: any) => Number(hour.time_epoch) >= currentEpoch);

  const snapshotData = {
    latitude: raw?.location?.lat,
    longitude: raw?.location?.lon,
    current: {
      temperature: raw?.current?.temp_c,
      humidity: raw?.current?.humidity,
      windSpeed: raw?.current?.wind_kph,
      weatherCode: raw?.current?.condition?.code,
      precipitation: raw?.current?.precip_mm,
    },
    hourly: {
      time: next24Hours.map((hour: any) => String(hour.time).replace(' ', 'T')),
      temperature_2m: next24Hours.map((hour: any) => hour.temp_c),
      precipitation: next24Hours.map((hour: any) => hour.precip_mm),
      precipitation_probability: next24Hours.map((hour: any) => hour.chance_of_rain),
      relative_humidity_2m: next24Hours.map((hour: any) => hour.humidity),
      wind_speed_10m: next24Hours.map((hour: any) => hour.wind_kph),
      weather_code: next24Hours.map((hour: any) => hour.condition?.code),
    },
    daily: {
      time: forecastDays.map((day: any) => day.date),
      precipitation_sum: forecastDays.map((day: any) => day.day?.totalprecip_mm),
      temperature_2m_max: forecastDays.map((day: any) => day.day?.maxtemp_c),
      temperature_2m_min: forecastDays.map((day: any) => day.day?.mintemp_c),
    },
  };

  return buildWeatherSnapshot(snapshotData, 'weatherapi');
}

export async function fetchFarmWeather(latitude: number, longitude: number) {
  const weatherApiKey = process.env.WEATHER_API_KEY;

  if (weatherApiKey) {
    const params = new URLSearchParams({
      key: weatherApiKey,
      q: `${latitude},${longitude}`,
      days: '7',
      aqi: 'no',
      alerts: 'no',
    });
    const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?${params.toString()}`, {
      next: { revalidate: 1800 },
    });

    if (!response.ok) {
      throw new Error('Weather source temporarily unavailable.');
    }

    const payload = await response.json();
    if (payload?.error) {
      throw new Error('Weather provider rejected the forecast request.');
    }

    return buildWeatherApiSnapshot(payload);
  }

  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    hourly: 'precipitation,precipitation_probability,temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code',
    daily: 'precipitation_sum,temperature_2m_max,temperature_2m_min,weather_code',
    timezone: 'auto',
    forecast_days: '7',
  });

  const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params.toString()}`, {
    next: { revalidate: 1800 },
  });

  if (!response.ok) {
    throw new Error('Weather source temporarily unavailable.');
  }

  const payload = await response.json();
  return buildWeatherSnapshot(payload);
}
