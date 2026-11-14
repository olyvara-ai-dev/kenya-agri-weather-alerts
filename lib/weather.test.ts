import test from 'node:test';
import assert from 'node:assert/strict';

import { buildWeatherApiSnapshot, calculateNext24HourRainfall, classifyRainfall, getWeatherWindows } from './weather';
import { generateAdvisory } from './advisory';

test('classifyRainfall returns the correct risk categories', () => {
  assert.equal(classifyRainfall(0), 'none');
  assert.equal(classifyRainfall(5), 'light');
  assert.equal(classifyRainfall(12), 'moderate');
  assert.equal(classifyRainfall(35), 'heavy');
});

test('calculateNext24HourRainfall sums rainfall for the next 24 hours', () => {
  const rainfall = [
    { precipitation: 1.2 },
    { precipitation: 2.1 },
    { precipitation: 4.6 },
    { precipitation: 0.8 },
  ];

  assert.equal(calculateNext24HourRainfall(rainfall), 8.7);
});

test('getWeatherWindows finds only consecutive forecast hours that meet activity conditions', () => {
  const hours = [
    { time: '2026-11-13T10:00', temperature: 20, precipitation: 4, precipitationProbability: 80, humidity: 70, windSpeed: 10, weatherCode: 0 },
    { time: '2026-11-13T11:00', temperature: 20, precipitation: 0, precipitationProbability: 10, humidity: 70, windSpeed: 8, weatherCode: 0 },
    { time: '2026-11-13T12:00', temperature: 21, precipitation: 0, precipitationProbability: 10, humidity: 68, windSpeed: 9, weatherCode: 0 },
    { time: '2026-11-13T13:00', temperature: 22, precipitation: 0.5, precipitationProbability: 50, humidity: 65, windSpeed: 10, weatherCode: 0 },
    { time: '2026-11-13T14:00', temperature: 22, precipitation: 0, precipitationProbability: 10, humidity: 64, windSpeed: 10, weatherCode: 0 },
    { time: '2026-11-13T15:00', temperature: 22, precipitation: 0, precipitationProbability: 10, humidity: 64, windSpeed: 11, weatherCode: 0 },
    { time: '2026-11-13T16:00', temperature: 22, precipitation: 0, precipitationProbability: 10, humidity: 64, windSpeed: 12, weatherCode: 0 },
  ];

  assert.deepEqual(getWeatherWindows(hours), {
    planting: { start: '2026-11-13T11:00', end: '2026-11-13T14:00' },
    spraying: { start: '2026-11-13T14:00', end: '2026-11-13T17:00' },
  });
});

test('buildWeatherApiSnapshot uses the current hour and maps forecast values', () => {
  const currentEpoch = Math.floor(Date.now() / 3600) * 3600;
  const hours = [
    { time_epoch: currentEpoch - 3600, time: '2026-11-13 10:00', temp_c: 16, precip_mm: 100, chance_of_rain: 100, humidity: 90, wind_kph: 10, condition: { code: 1 } },
    { time_epoch: currentEpoch, time: '2026-11-13 11:00', temp_c: 18, precip_mm: 2, chance_of_rain: 40, humidity: 80, wind_kph: 12, condition: { code: 2 } },
    { time_epoch: currentEpoch + 3600, time: '2026-11-13 12:00', temp_c: 19, precip_mm: 3, chance_of_rain: 60, humidity: 75, wind_kph: 14, condition: { code: 3 } },
  ];

  const snapshot = buildWeatherApiSnapshot({
    location: { lat: -1.29, lon: 36.82 },
    current: { last_updated_epoch: currentEpoch, temp_c: 18, precip_mm: 1, humidity: 80, wind_kph: 12, condition: { code: 2 } },
    forecast: {
      forecastday: [{
        date: '2026-11-13',
        hour: hours,
        day: { totalprecip_mm: 5, maxtemp_c: 22, mintemp_c: 15 },
      }],
    },
  });

  assert.equal(snapshot.source, 'weatherapi');
  assert.equal(snapshot.latitude, -1.29);
  assert.equal(snapshot.current.temperature, 18);
  assert.equal(snapshot.next24HourRainfall, 5);
  assert.equal(snapshot.hourly.length, 2);
  assert.equal(snapshot.hourly[0].time, '2026-11-13T11:00');
  assert.equal(snapshot.daily[0].temperatureMax, 22);
});

test('generateAdvisory returns crop-specific recommendations', () => {
  const advisory = generateAdvisory({ rainfallMm: 35, probability: 88, crop: 'maize', activity: 'general', language: 'en' });

  assert.equal(advisory.severity, 'high');
  assert.match(advisory.title, /Heavy rain/i);
  assert.match(advisory.message, /drainage/i);
});

test('generateAdvisory does not label light maize rainfall as heavy rain', () => {
  const advisory = generateAdvisory({ rainfallMm: 5, probability: 40, crop: 'maize', activity: 'general', language: 'en' });

  assert.equal(advisory.severity, 'low');
  assert.doesNotMatch(advisory.title, /Heavy rain/i);
});

test('generateAdvisory warns about spray washout risk', () => {
  const advisory = generateAdvisory({ rainfallMm: 8, probability: 70, crop: 'horticulture', activity: 'spraying', language: 'en' });
  assert.equal(advisory.severity, 'high');
  assert.match(advisory.title, /Spray/i);
});
