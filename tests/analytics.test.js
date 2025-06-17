const { computeAnalytics } = require('../src/analytics');

describe('computeAnalytics', () => {
  test('calculates metrics for mixed trades', () => {
    const trades = [
      { wl: 'Win', rr: '2:1' },
      { wl: 'Loss' },
      { wl: 'Win', rr: '1.5:1' }
    ];

    const result = computeAnalytics(trades);

    expect(result.totalTrades).toBe(3);
    expect(result.winTrades).toBe(2);
    expect(result.lossTrades).toBe(1);
    expect(result.winrate).toBeCloseTo(66.6, 1);
    expect(result.profitFactor).toBeCloseTo(3.5, 1);
  });

  test('calculates metrics for all losses', () => {
    const trades = [
      { wl: 'Loss' },
      { wl: 'Loss' }
    ];

    const result = computeAnalytics(trades);

    expect(result.totalTrades).toBe(2);
    expect(result.winTrades).toBe(0);
    expect(result.lossTrades).toBe(2);
    expect(result.winrate).toBe(0);
    expect(result.profitFactor).toBe(0);
  });
});
