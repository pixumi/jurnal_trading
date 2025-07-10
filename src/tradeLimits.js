function getSessionCounts(trades) {
  const counts = { Asia: 0, London: 0, 'New York': 0 };
  trades.forEach(trade => {
    if (counts.hasOwnProperty(trade.session)) {
      counts[trade.session]++;
    }
  });
  return counts;
}

function getSessionLimits(counts) {
  const base = { Asia: 2, London: 2, 'New York': 2 };
  const limits = { ...base };

  const asiaLeft = Math.max(0, base.Asia - counts.Asia);
  limits.London += Math.min(asiaLeft, 1);

  const londonLeft = Math.max(0, limits.London - counts.London);
  limits['New York'] += Math.min(londonLeft, 1);

  return limits;
}

function canAddTrade(trades, date, session) {
  const tradesOfDay = trades.filter(t => t.date === date);
  if (tradesOfDay.length >= 5) {
    return false;
  }

  const counts = getSessionCounts(tradesOfDay);
  const limits = getSessionLimits(counts);

  return counts[session] < (limits[session] || 0);
}

if (typeof module !== 'undefined') {
  module.exports = { getSessionCounts, getSessionLimits, canAddTrade };
}

if (typeof window !== 'undefined') {
  window.tradeLimits = { getSessionCounts, getSessionLimits, canAddTrade };
}
