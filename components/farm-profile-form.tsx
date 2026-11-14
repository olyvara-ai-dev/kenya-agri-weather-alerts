'use client';

import { useEffect, useState } from 'react';
import { LocateFixed } from 'lucide-react';
import type { ActivityType } from '@/lib/advisory';
import { isFarmProfile, type FarmProfile } from '@/lib/farm-profile';
import { createClient } from '@/lib/supabase/client';

const crops: Array<{ value: FarmProfile['crop']; label: string }> = [
  { value: 'maize', label: 'Maize' },
  { value: 'coffee', label: 'Coffee' },
  { value: 'horticulture', label: 'Horticulture' },
  { value: 'general', label: 'Other / mixed crops' },
];

const activities: Array<{ value: ActivityType; label: string }> = [
  { value: 'planting', label: 'Planting' },
  { value: 'fertilizer', label: 'Applying fertilizer' },
  { value: 'spraying', label: 'Spraying' },
  { value: 'harvest', label: 'Harvesting' },
  { value: 'drying', label: 'Drying crops' },
  { value: 'general', label: 'General farm work' },
];

type FarmProfileDraft = Omit<FarmProfile, 'crop' | 'activity'> & {
  crop: FarmProfile['crop'] | '';
  activity: ActivityType | '';
};

export function FarmProfileForm({
  profile,
  isNewProfile,
  onSaved,
}: {
  profile: FarmProfile;
  isNewProfile: boolean;
  onSaved: (profile: FarmProfile) => void;
}) {
  const [draft, setDraft] = useState<FarmProfileDraft>(() => isNewProfile ? {
    ...profile,
    farmName: '',
    county: '',
    latitude: Number.NaN,
    longitude: Number.NaN,
    crop: '',
    activity: '',
  } : profile);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const [locating, setLocating] = useState(false);

  useEffect(() => {
    setDraft(isNewProfile ? {
      ...profile,
      farmName: '',
      county: '',
      latitude: Number.NaN,
      longitude: Number.NaN,
      crop: '',
      activity: '',
    } : profile);
  }, [profile, isNewProfile]);

  function updateDraft<K extends keyof FarmProfileDraft>(key: K, value: FarmProfileDraft[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
    setSaved(false);
  }

  function useDeviceLocation() {
    if (!navigator.geolocation) {
      setError('Location access is not available in this browser.');
      return;
    }

    setLocating(true);
    setError('');
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setDraft((current) => ({
          ...current,
          latitude: Number(coords.latitude.toFixed(5)),
          longitude: Number(coords.longitude.toFixed(5)),
        }));
        setLocating(false);
      },
      () => {
        setError('Could not access your location. Allow location access or enter coordinates.');
        setLocating(false);
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 }
    );
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setSaved(false);

    try {
      if (!isFarmProfile(draft)) {
        throw new Error('Enter a valid farm name, county and set of coordinates.');
      }

      const supabase = createClient();
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error('Sign in again before saving your farm profile.');

      const { error: saveError } = await supabase.from('farm_profiles').upsert({
        user_id: user.id,
        farm_name: draft.farmName.trim(),
        county: draft.county.trim(),
        latitude: draft.latitude,
        longitude: draft.longitude,
        crop: draft.crop,
        activity: draft.activity,
      }, { onConflict: 'user_id' });
      if (saveError) throw saveError;

      onSaved({ ...draft, farmName: draft.farmName.trim(), county: draft.county.trim() });
      setSaved(true);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Unable to save this farm profile.');
    }
  }

  const inputClassName = 'mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100';

  return (
    <section className="card-surface rounded-3xl p-5 sm:p-6">
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">Personalized forecast</p>
        <h2 className="mt-1 text-xl font-black text-slate-900">Your farm profile</h2>
        <p className="mt-1 text-sm text-slate-500">Save a location and crop to tailor your weather and farm guidance.</p>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <label className="text-sm font-semibold text-slate-700">
          Farm name
          <input value={draft.farmName} onChange={(event) => updateDraft('farmName', event.target.value)} className={inputClassName} placeholder="Enter farm name" maxLength={60} required />
        </label>

        <label className="text-sm font-semibold text-slate-700">
          County or nearby town
          <input value={draft.county} onChange={(event) => updateDraft('county', event.target.value)} className={inputClassName} placeholder="Enter county or nearby town" maxLength={80} required />
        </label>

        <label className="text-sm font-semibold text-slate-700">
          Main crop
          <select value={draft.crop} onChange={(event) => updateDraft('crop', event.target.value as FarmProfileDraft['crop'])} className={inputClassName} required>
            <option value="">Select a crop</option>
            {crops.map((crop) => <option key={crop.value} value={crop.value}>{crop.label}</option>)}
          </select>
        </label>

        <label className="text-sm font-semibold text-slate-700">
          Farming activity
          <select value={draft.activity} onChange={(event) => updateDraft('activity', event.target.value as FarmProfileDraft['activity'])} className={inputClassName} required>
            <option value="">Select an activity</option>
            {activities.map((activity) => <option key={activity.value} value={activity.value}>{activity.label}</option>)}
          </select>
        </label>

        <label className="text-sm font-semibold text-slate-700">
          Latitude
          <input
            type="number"
            step="any"
            min="-90"
            max="90"
            value={Number.isFinite(draft.latitude) ? draft.latitude : ''}
            onChange={(event) => updateDraft('latitude', event.target.value === '' ? Number.NaN : Number(event.target.value))}
            className={inputClassName}
            required
          />
        </label>

        <label className="text-sm font-semibold text-slate-700">
          Longitude
          <input
            type="number"
            step="any"
            min="-180"
            max="180"
            value={Number.isFinite(draft.longitude) ? draft.longitude : ''}
            onChange={(event) => updateDraft('longitude', event.target.value === '' ? Number.NaN : Number(event.target.value))}
            className={inputClassName}
            required
          />
        </label>

        <div className="flex flex-wrap items-center gap-3 sm:col-span-2 xl:col-span-3">
          <button type="button" onClick={useDeviceLocation} disabled={locating} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-emerald-700 hover:text-forest disabled:opacity-60">
            <LocateFixed className="h-4 w-4" />
            {locating ? 'Finding location…' : 'Use my location'}
          </button>
          <button type="submit" disabled={saved} className="rounded-xl bg-forest px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-70">
            Save farm profile
          </button>
          {saved ? <span role="status" className="text-sm font-medium text-emerald-700">Saved. Your forecast is updating.</span> : null}
          {error ? <span role="alert" className="text-sm font-medium text-red-700">{error}</span> : null}
        </div>
      </form>
    </section>
  );
}
