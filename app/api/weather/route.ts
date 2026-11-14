import { NextResponse } from 'next/server';
import { fetchFarmWeather } from '@/lib/weather';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawLatitude = searchParams.get('lat');
  const rawLongitude = searchParams.get('lon');
  const latitude = rawLatitude === null || rawLatitude.trim() === '' ? Number.NaN : Number(rawLatitude);
  const longitude = rawLongitude === null || rawLongitude.trim() === '' ? Number.NaN : Number(rawLongitude);

  if (
    !Number.isFinite(latitude) ||
    latitude < -90 ||
    latitude > 90 ||
    !Number.isFinite(longitude) ||
    longitude < -180 ||
    longitude > 180
  ) {
    return NextResponse.json({ error: 'Valid latitude and longitude values are required.' }, { status: 400 });
  }

  try {
    const weather = await fetchFarmWeather(latitude, longitude);
    return NextResponse.json({ weather });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Unable to load forecast.',
      },
      { status: 502 }
    );
  }
}
