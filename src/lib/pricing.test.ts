import { describe, it, expect } from 'vitest';
import { getPaidPrices } from './pricing';

describe('getPaidPrices', () => {
  it('saves the discounted monthly fee when a 50% discount is on (2000 -> 1000)', () => {
    const p = getPaidPrices({ setup_fee: 8000, monthly_fee: 2000, discount_enabled: true, discount_percent: 50 });
    expect(p.monthlyFee).toBe(1000);
    expect(p.setupFee).toBe(4000);
  });

  it('uses the full price when the discount is off', () => {
    const p = getPaidPrices({ setup_fee: 8000, monthly_fee: 2000, discount_enabled: false, discount_percent: 50 });
    expect(p.monthlyFee).toBe(2000);
    expect(p.setupFee).toBe(8000);
  });
});
