const { canAddTrade } = require('../src/tradeLimits');

describe('trade limit logic', () => {
  test('allows up to 3 London trades when no Asia trade', () => {
    const trades = [];
    expect(canAddTrade(trades, '2023-01-01', 'London')).toBe(true);
    trades.push({ date: '2023-01-01', session: 'London' });
    trades.push({ date: '2023-01-01', session: 'London' });
    expect(canAddTrade(trades, '2023-01-01', 'London')).toBe(true);
    trades.push({ date: '2023-01-01', session: 'London' });
    expect(canAddTrade(trades, '2023-01-01', 'London')).toBe(false);
  });

  test('new york gets extra slot when London underused', () => {
    const trades = [
      { date: '2023-01-02', session: 'Asia' },
      { date: '2023-01-02', session: 'London' }
    ];
    trades.push({ date: '2023-01-02', session: 'New York' });
    trades.push({ date: '2023-01-02', session: 'New York' });
    expect(canAddTrade(trades, '2023-01-02', 'New York')).toBe(true);
    trades.push({ date: '2023-01-02', session: 'New York' });
    expect(canAddTrade(trades, '2023-01-02', 'New York')).toBe(false);
  });

  test('daily limit of five trades', () => {
    const trades = [];
    for (let i = 0; i < 5; i++) {
      trades.push({ date: '2023-01-03', session: 'Asia' });
    }
    expect(canAddTrade(trades, '2023-01-03', 'Asia')).toBe(false);
  });
});
