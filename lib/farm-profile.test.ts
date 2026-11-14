import test from 'node:test';
import assert from 'node:assert/strict';

import { defaultFarmProfile, isFarmProfile } from './farm-profile';

test('farm profiles accept valid coordinates and supported crops', () => {
  assert.equal(isFarmProfile(defaultFarmProfile), true);
  assert.equal(isFarmProfile({ ...defaultFarmProfile, latitude: 91 }), false);
  assert.equal(isFarmProfile({ ...defaultFarmProfile, longitude: Number.NaN }), false);
  assert.equal(isFarmProfile({ ...defaultFarmProfile, crop: 'sorghum' }), false);
});
