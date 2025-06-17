function computeAnalytics(trades) {
  const totalTrades = trades.length;
  const winTrades = trades.filter(trade => trade.wl === "Win").length;
  const lossTrades = totalTrades - winTrades;

  const winrate = totalTrades > 0 ? (winTrades / totalTrades * 100) : 0;

  let totalWinRR = 0;
  let totalLossRR = 0;

  trades.forEach(trade => {
    if (trade.wl === "Win" && trade.rr) {
      const rrParts = trade.rr.split(':');
      if (rrParts.length === 2) {
        totalWinRR += parseFloat(rrParts[0]);
      }
    } else if (trade.wl === "Loss") {
      totalLossRR += 1;
    }
  });

  const profitFactor = totalLossRR > 0 ? (totalWinRR / totalLossRR)
    : totalWinRR > 0 ? Infinity : 0;

  return { totalTrades, winTrades, lossTrades, winrate, profitFactor };
}

if (typeof module !== 'undefined') {
  module.exports = { computeAnalytics };
}

if (typeof window !== 'undefined') {
  window.computeAnalytics = computeAnalytics;
}
