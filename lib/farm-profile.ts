import type { ActivityType, CropType } from './advisory';

export type FarmProfile = {
  farmName: string;
  county: string;
  latitude: number;
  longitude: number;
  crop: Exclude<CropType, 'fertilizer'>;
  activity: ActivityType;
};

export const defaultFarmProfile: FarmProfile = {
  farmName: 'My farm',
  county: 'Kirinyaga',
  latitude: -0.8,
  longitude: 37.3,
  crop: 'maize',
  activity: 'fertilizer',
};

const validCrops = ['maize', 'coffee', 'horticulture', 'general'];
const validActivities = ['planting', 'fertilizer', 'spraying', 'harvest', 'drying', 'general'];

export function isFarmProfile(value: unknown): value is FarmProfile {
  if (!value || typeof value !== 'object') return false;

  const profile = value as Record<string, unknown>;
  return (
    typeof profile.farmName === 'string' &&
    profile.farmName.trim().length > 0 &&
    profile.farmName.length <= 60 &&
    typeof profile.county === 'string' &&
    profile.county.trim().length > 0 &&
    profile.county.length <= 80 &&
    typeof profile.latitude === 'number' &&
    Number.isFinite(profile.latitude) &&
    profile.latitude >= -90 &&
    profile.latitude <= 90 &&
    typeof profile.longitude === 'number' &&
    Number.isFinite(profile.longitude) &&
    profile.longitude >= -180 &&
    profile.longitude <= 180 &&
    typeof profile.crop === 'string' &&
    validCrops.includes(profile.crop) &&
    typeof profile.activity === 'string' &&
    validActivities.includes(profile.activity)
  );
}
