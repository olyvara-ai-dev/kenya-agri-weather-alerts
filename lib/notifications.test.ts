import test from 'node:test';
import assert from 'node:assert/strict';

import { routeAlert } from './notifications';

test('notification delivery is never reported as live without a provider', () => {
  const previousNodeEnv = process.env.NODE_ENV;
  const previousProductionMode = process.env.AGRO_SHIELD_PRODUCTION_MODE;
  process.env.NODE_ENV = 'production';
  process.env.AGRO_SHIELD_PRODUCTION_MODE = 'true';

  try {
    const result = routeAlert({ mode: 'sms', phone: '+254700000000', message: 'Rain warning' });

    assert.equal(result.status, 'failed');
    assert.match(result.summary, /not configured/);
    assert.match(result.summary, /no message was sent/i);
  } finally {
    if (previousNodeEnv === undefined) delete process.env.NODE_ENV;
    else process.env.NODE_ENV = previousNodeEnv;
    if (previousProductionMode === undefined) delete process.env.AGRO_SHIELD_PRODUCTION_MODE;
    else process.env.AGRO_SHIELD_PRODUCTION_MODE = previousProductionMode;
  }
});
