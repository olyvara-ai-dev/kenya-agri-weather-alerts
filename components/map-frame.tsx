'use client';

import dynamic from 'next/dynamic';

const WeatherMap = dynamic(() => import('@/components/weather-map').then((mod) => mod.WeatherMap), {
  ssr: false,
  loading: () => <div className="flex h-[360px] items-center justify-center rounded-3xl border border-slate-200 bg-slate-50 text-slate-600">Loading map…</div>,
});

export function MapFrame({ farms }: { farms: Array<{ id: string; name: string; latitude: number; longitude: number; risk: string }> }) {
  return <WeatherMap farms={farms} />;
}
