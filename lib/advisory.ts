import { classifyRainfall } from './weather';
import { swahiliStrings, englishStrings } from './translations';

export type CropType = 'maize' | 'coffee' | 'horticulture' | 'fertilizer' | 'general';
export type ActivityType = 'planting' | 'fertilizer' | 'spraying' | 'harvest' | 'drying' | 'general';

export type Advisory = {
  title: string;
  message: string;
  severity: 'low' | 'moderate' | 'high';
  recommendation: string;
  riskLevel: string;
  language: 'en' | 'sw';
};

export function generateAdvisory({
  rainfallMm,
  probability,
  crop,
  activity,
  language = 'en',
}: {
  rainfallMm: number;
  probability: number;
  crop: CropType;
  activity: ActivityType;
  language?: 'en' | 'sw';
}): Advisory {
  const riskLevel = classifyRainfall(rainfallMm);
  const dictionary = language === 'sw' ? swahiliStrings : englishStrings;

  if (crop === 'maize' && riskLevel === 'heavy') {
    return {
      title: dictionary.maizeHeavy,
      message: dictionary.maizeHeavyMessage,
      severity: 'high',
      recommendation: dictionary.maizeHeavyRecommendation,
      riskLevel,
      language,
    };
  }

  if (crop === 'coffee' && activity === 'drying' && riskLevel !== 'none') {
    return {
      title: dictionary.coffeeDrying,
      message: dictionary.coffeeDryingMessage,
      severity: 'moderate',
      recommendation: dictionary.coffeeDryingRecommendation,
      riskLevel,
      language,
    };
  }

  if (crop === 'horticulture' && activity === 'spraying' && probability >= 60) {
    return {
      title: dictionary.horticultureSpray,
      message: dictionary.horticultureSprayMessage,
      severity: 'high',
      recommendation: dictionary.horticultureSprayRecommendation,
      riskLevel,
      language,
    };
  }

  if (activity === 'fertilizer' && riskLevel === 'heavy') {
    return {
      title: dictionary.fertilizerHeavy,
      message: dictionary.fertilizerHeavyMessage,
      severity: 'high',
      recommendation: dictionary.fertilizerHeavyRecommendation,
      riskLevel,
      language,
    };
  }

  if (activity === 'planting' && riskLevel === 'none' && probability < 40) {
    return {
      title: dictionary.plantingSuitable,
      message: dictionary.plantingSuitableMessage,
      severity: 'low',
      recommendation: dictionary.plantingSuitableRecommendation,
      riskLevel,
      language,
    };
  }

  return {
    title: dictionary.generalAlert,
    message: dictionary.generalAlertMessage,
    severity: riskLevel === 'heavy' ? 'high' : riskLevel === 'moderate' ? 'moderate' : 'low',
    recommendation: dictionary.generalRecommendation,
    riskLevel,
    language,
  };
}
