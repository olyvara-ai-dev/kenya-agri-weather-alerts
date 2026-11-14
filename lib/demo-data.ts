export const demoFarms = [
  { id: 'farm-001', name: 'Mwea Maize Plot', owner: 'Amina Wanjiku', county: 'Kirinyaga', latitude: -0.8, longitude: 37.3, crop: 'maize', risk: 'moderate' },
  { id: 'farm-002', name: 'Kericho Coffee Block', owner: 'Daniel Koech', county: 'Kericho', latitude: -0.37, longitude: 35.28, crop: 'coffee', risk: 'light' },
  { id: 'farm-003', name: 'Nakuru Horticulture', owner: 'Grace Okoth', county: 'Nakuru', latitude: -0.3, longitude: 36.08, crop: 'horticulture', risk: 'heavy' },
  { id: 'farm-004', name: 'Uasin Gishu Mixed Crops', owner: 'Peter Rotich', county: 'Uasin Gishu', latitude: 0.52, longitude: 35.28, crop: 'maize', risk: 'light' },
];

export const demoOrganizations = [
  { id: 'org-001', name: 'Nandi Farmers Cooperative', members: 160, counties: ['Nandi', 'Uasin Gishu'], riskZones: 3 },
  { id: 'org-002', name: 'Bomet Agribusiness Network', members: 325, counties: ['Bomet', 'Kericho'], riskZones: 5 },
];

export const demoAlerts = [
  { id: 'alert-001', timestamp: '2026-11-13T06:00:00Z', severity: 'high', title: 'Heavy rainfall warning', action: 'Delay fertilizer and inspect drainage.' },
  { id: 'alert-002', timestamp: '2026-11-12T17:30:00Z', severity: 'moderate', title: 'Spraying risk', action: 'Avoid pesticide spraying after 18:00.' },
  { id: 'alert-003', timestamp: '2026-11-12T10:20:00Z', severity: 'low', title: 'Planting window open', action: 'Continue soil checks and plant in the afternoon.' },
];

export const demoWeather = {
  currentTemp: 24,
  humidity: 82,
  rainProbability: 68,
  rainfall24h: 18.4,
  wind: 18,
  riskLevel: 'moderate',
  confidence: 0.82,
  hourly: [
    { time: '2026-11-13T00:00', precipitation: 2.4, probability: 50, temp: 22 },
    { time: '2026-11-13T01:00', precipitation: 3.5, probability: 58, temp: 22 },
    { time: '2026-11-13T02:00', precipitation: 5.8, probability: 68, temp: 21 },
    { time: '2026-11-13T03:00', precipitation: 15.2, probability: 85, temp: 20 },
    { time: '2026-11-13T04:00', precipitation: 12.8, probability: 74, temp: 21 },
    { time: '2026-11-13T05:00', precipitation: 8.1, probability: 68, temp: 22 },
  ],
};

export const demoAdminMetrics = [
  { label: 'Registered farmers', value: '12,820' },
  { label: 'Active farms', value: '8,710' },
  { label: 'Organizations', value: '128' },
  { label: 'Alerts sent', value: '42,600' },
];
