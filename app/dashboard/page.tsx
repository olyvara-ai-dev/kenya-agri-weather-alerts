'use client';

import { useEffect, useMemo, useState } from 'react';
import { Activity, CloudRain, Droplets, Gauge, MapPin, ShieldAlert, SunMedium, Wind } from 'lucide-react';
import { DashboardShell } from '@/components/dashboard-shell';
import { FarmProfileForm } from '@/components/farm-profile-form';
import { MapFrame } from '@/components/map-frame';
import { demoAlerts, demoFarms, demoWeather } from '@/lib/demo-data';
import { generateAdvisory } from '@/lib/advisory';
import { defaultFarmProfile, type FarmProfile } from '@/lib/farm-profile';
import { createClient } from '@/lib/supabase/client';
import { classifyRainfall, getWeatherWindows } from '@/lib/weather';

function formatForecastTime(value: string) {
  const [date, time] = value.split('T');
  return `${date} ${time?.slice(0, 5) ?? ''}`;
}

function formatAlertTimestamp(value: string) {
  return new Intl.DateTimeFormat('en-KE', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Africa/Nairobi',
  }).format(new Date(value));
}

export default function DashboardPage() {
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [profileError, setProfileError] = useState('');
  const [farmProfile, setFarmProfile] = useState<FarmProfile | null>(null);
  const [hasSavedFarmProfile, setHasSavedFarmProfile] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadFarmProfile() {
      try {
        const supabase = createClient();
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError) throw userError;
        if (!user) throw new Error('You must sign in to load a farm profile.');

        const { data, error: loadError } = await supabase
          .from('farm_profiles')
          .select('farm_name, county, latitude, longitude, crop, activity')
          .eq('user_id', user.id)
          .maybeSingle();
        if (loadError) throw loadError;

        if (active) {
          setHasSavedFarmProfile(Boolean(data));
          setFarmProfile(data ? {
            farmName: data.farm_name,
            county: data.county,
            latitude: data.latitude,
            longitude: data.longitude,
            crop: data.crop,
            activity: data.activity,
          } : defaultFarmProfile);
        }
      } catch {
        if (active) {
          setHasSavedFarmProfile(false);
          setFarmProfile(defaultFarmProfile);
          setProfileError('Could not load your saved farm profile. Confirm the Supabase database migration is applied.');
        }
      }
    }

    loadFarmProfile();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!farmProfile) return;
    const profile = farmProfile;
    const controller = new AbortController();

    async function loadWeather() {
      setLoading(true);
      setError('');
      try {
        const params = new URLSearchParams({
          lat: String(profile.latitude),
          lon: String(profile.longitude),
        });
        const response = await fetch(`/api/weather?${params.toString()}`, { signal: controller.signal });
        const payload = await response.json();
        if (!response.ok || payload.error) {
          throw new Error('Weather source unavailable.');
        }
        if (!payload.weather) {
          throw new Error('Weather source returned no forecast.');
        }
        setWeather(payload.weather);
      } catch {
        if (controller.signal.aborted) return;
        setWeather({ ...demoWeather, source: 'demo', riskLevel: classifyRainfall(demoWeather.rainfall24h) });
        setError(`Live forecast unavailable for ${profile.county}; demo values are shown.`);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    loadWeather();
    return () => controller.abort();
  }, [farmProfile]);

  const riskClass = useMemo(() => {
    const totalRain = weather?.next24HourRainfall ?? demoWeather.rainfall24h;
    return classifyRainfall(totalRain);
  }, [weather]);

  const advisory = generateAdvisory({
    rainfallMm: weather?.next24HourRainfall ?? demoWeather.rainfall24h,
    probability: weather?.probability ?? demoWeather.rainProbability,
    crop: farmProfile?.crop ?? defaultFarmProfile.crop,
    activity: farmProfile?.activity ?? defaultFarmProfile.activity,
    language: 'en',
  });
  const weatherWindows = useMemo(
    () => getWeatherWindows(weather?.source === 'weatherapi' || weather?.source === 'open-meteo' ? weather.hourly : []),
    [weather]
  );
  const mapFarms = farmProfile
    ? [{ id: 'my-farm', name: farmProfile.farmName, latitude: farmProfile.latitude, longitude: farmProfile.longitude, risk: riskClass }]
    : demoFarms;
  const activityLabel = farmProfile?.activity.replace(/^\w/, (letter) => letter.toUpperCase()) ?? 'Fertilizer';

  const forecastCards = [
    { label: 'Current temp', value: `${weather?.current?.temperature ?? demoWeather.currentTemp}°C`, icon: SunMedium },
    { label: 'Humidity', value: `${weather?.current?.humidity ?? demoWeather.humidity}%`, icon: Droplets },
    { label: 'Rainfall 24h', value: `${(weather?.next24HourRainfall ?? demoWeather.rainfall24h).toFixed(1)} mm`, icon: CloudRain },
    { label: 'Wind speed', value: `${weather?.current?.windSpeed ?? demoWeather.wind} km/h`, icon: Wind },
  ];

  return (
    <DashboardShell title="Farmer dashboard">
      <div className="space-y-8">
        {farmProfile ? (
          <FarmProfileForm
            profile={farmProfile}
            isNewProfile={!hasSavedFarmProfile}
            onSaved={(profile) => {
              setFarmProfile(profile);
              setHasSavedFarmProfile(true);
            }}
          />
        ) : null}

        {profileError ? <div role="alert" className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">{profileError}</div> : null}
        {error ? <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">{error}</div> : null}

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {forecastCards.map(({ label, value, icon: Icon }) => (
            <div key={label} className="card-surface rounded-3xl p-5">
              <div className="flex items-center justify-between">
                <div className="text-sm text-slate-500">{label}</div>
                <div className="rounded-xl bg-emerald-50 p-2 text-emerald-700"><Icon className="h-4 w-4" /></div>
              </div>
              <div className="mt-4 text-3xl font-black text-slate-900">{value}</div>
            </div>
          ))}
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
          <div className="card-surface rounded-3xl p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">Weather overview</div>
                <h2 className="mt-2 text-2xl font-black text-slate-900">Next 24-hour rainfall forecast</h2>
              </div>
              <span className={`badge status-${riskClass}`}>{riskClass.toUpperCase()}</span>
            </div>

            {loading ? <div className="rounded-2xl bg-slate-100 p-10 text-center text-slate-600">Loading forecast…</div> : (
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <div className="text-sm text-slate-500">Rainfall probability</div>
                    <div className="mt-2 text-3xl font-black text-slate-900">{(weather?.probability ?? demoWeather.rainProbability).toFixed(0)}%</div>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <div className="text-sm text-slate-500">Highest rainfall period</div>
                    <div className="mt-2 text-lg font-bold text-slate-900">{weather?.highestRainfallPeriod?.hour ?? '2026-11-13T03:00'}</div>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <div className="text-sm text-slate-500">Confidence</div>
                    <div className="mt-2 text-3xl font-black text-slate-900">{(weather?.confidence ?? demoWeather.confidence).toFixed(2)}</div>
                  </div>
                </div>

                <div className="overflow-hidden rounded-2xl border border-slate-200">
                  <div className="grid grid-cols-6 gap-3 bg-slate-50 p-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                    <div>Time</div>
                    <div>Rain</div>
                    <div>Prob</div>
                    <div>Temp</div>
                    <div>Hum</div>
                    <div>Wind</div>
                  </div>
                  {(weather?.hourly ?? demoWeather.hourly).slice(0, 6).map((entry: any) => (
                    <div key={entry.time} className="grid grid-cols-6 gap-3 border-t border-slate-200 p-4 text-sm text-slate-700">
                      <div>{entry.time.slice(11, 16)}</div>
                      <div>{(entry.precipitation ?? entry.rain).toFixed(1)} mm</div>
                      <div>{Math.round(entry.precipitationProbability ?? entry.probability)}%</div>
                      <div>{(entry.temperature ?? entry.temp).toFixed(0)}°C</div>
                      <div>{entry.humidity ?? 82}%</div>
                      <div>{entry.windSpeed ?? 18} km/h</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="card-surface rounded-3xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">Action center</div>
                <h2 className="mt-2 text-2xl font-black text-slate-900">Farm action plan</h2>
              </div>
              <ShieldAlert className="h-6 w-6 text-amber-500" />
            </div>

            <div className="mt-5 rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
              <div className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">Recommendation</div>
              <div className="mt-2 text-xl font-black text-slate-900">{advisory.title}</div>
              <p className="mt-2 text-sm text-slate-600">{advisory.message}</p>
              <div className="mt-4 rounded-xl bg-white p-3 text-sm text-slate-700">{advisory.recommendation}</div>
            </div>

            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-3">
                <span className="text-sm text-slate-500">Rainfall risk</span>
                <span className={`badge status-${riskClass}`}>{riskClass}</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-3">
                <span className="text-sm text-slate-500">Farming activity</span>
                <span className="font-semibold text-slate-700">{activityLabel}</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-3">
                <span className="text-sm text-slate-500">Alert channel</span>
                <span className="font-semibold text-slate-700">SMS + WhatsApp</span>
              </div>
            </div>
          </div>
        </div>

        <section className="space-y-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">Plan the work</p>
            <h2 className="mt-1 text-2xl font-black text-slate-900">Weather-aware work windows</h2>
            <p className="mt-1 text-sm text-slate-600">Based on consecutive forecast hours; check field conditions and local guidance before acting.</p>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {[
              { label: 'Planting window', detail: 'Three hours with light expected rainfall and a lower chance of rain.', window: weatherWindows.planting },
              { label: 'Spraying window', detail: 'Three dry hours with lower rain chance and wind at or below 15 km/h.', window: weatherWindows.spraying },
            ].map((item) => (
              <div key={item.label} className="card-surface rounded-3xl p-5">
                <h3 className="text-lg font-bold text-slate-900">{item.label}</h3>
                <p className="mt-1 text-sm text-slate-500">{item.detail}</p>
                {loading ? (
                  <div className="mt-4 rounded-xl bg-slate-50 p-3 text-sm text-slate-500">Checking forecast…</div>
                ) : item.window ? (
                  <div className="mt-4 rounded-xl border border-emerald-100 bg-emerald-50 p-3 text-sm font-semibold text-emerald-900">
                    {formatForecastTime(item.window.start)} - {formatForecastTime(item.window.end)}
                  </div>
                ) : (
                  <div className="mt-4 rounded-xl bg-slate-50 p-3 text-sm text-slate-600">
                    No suitable window in the current forecast. Check again later.
                  </div>
                )}
              </div>
            ))}
          </div>
          <p className="text-xs leading-5 text-slate-500">Weather windows are guidance, not a guarantee. For spraying, follow the product label and local agronomist advice.</p>
        </section>

        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="card-surface rounded-3xl p-6">
            <div className="mb-5 flex items-center gap-3">
              <MapPin className="h-5 w-5 text-emerald-700" />
              <h2 className="text-2xl font-black text-slate-900">Farm map</h2>
            </div>
            <MapFrame farms={mapFarms} />
          </div>

          <div className="card-surface rounded-3xl p-6">
            <div className="mb-5 flex items-center gap-3">
              <Activity className="h-5 w-5 text-emerald-700" />
              <h2 className="text-2xl font-black text-slate-900">Alert history</h2>
            </div>
            <div className="space-y-4">
              {demoAlerts.map((alert) => (
                <div key={alert.id} className="rounded-2xl border border-slate-200 p-4">
                  <div className="flex items-center justify-between gap-2">
                    <div className="font-bold text-slate-900">{alert.title}</div>
                    <span className={`badge ${alert.severity === 'high' ? 'status-heavy' : alert.severity === 'moderate' ? 'status-moderate' : 'status-light'}`}>{alert.severity}</span>
                  </div>
                  <div className="mt-2 text-sm text-slate-500">{formatAlertTimestamp(alert.timestamp)}</div>
                  <div className="mt-2 text-sm text-slate-700">{alert.action}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
