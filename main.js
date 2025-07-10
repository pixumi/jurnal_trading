// Inisialisasi elemen DOM
const form = document.getElementById('tradeForm');
const historyBody = document.getElementById('historyBody');
const modal = document.getElementById('modal');
const modalText = document.getElementById('modalText');
const modalClose = document.getElementById('modalClose');
const darkModeToggle = document.getElementById('darkModeToggle');
const exportJsonBtn = document.getElementById('exportJsonBtn');
const importJsonBtn = document.getElementById('importJsonBtn');
const importFileInput = document.getElementById('importFileInput');
const dynamicHeader = document.getElementById('dynamicHeader');

// Analytics elements
const totalTradesEl = document.getElementById('totalTrades');
const winTradesEl = document.getElementById('winTrades');
const lossTradesEl = document.getElementById('lossTrades');
const winrateEl = document.getElementById('winrate');
const profitFactorEl = document.getElementById('profitFactor');
const winBar = document.getElementById('winBar');
const lossBar = document.getElementById('lossBar');
const winPercentageEl = document.getElementById('winPercentage');
const lossPercentageEl = document.getElementById('lossPercentage');

// Inisialisasi data
let trades = JSON.parse(localStorage.getItem('trades')) || [];
let isDarkMode = localStorage.getItem('darkMode') === 'true';
let lastScrollTop = 0;

function sortTradesByDate() {
  const sessionOrder = { 'New York': 0, 'London': 1, 'Asia': 2 };
  trades.sort((a, b) => {
    const dateDiff = new Date(b.date) - new Date(a.date);
    if (dateDiff !== 0) return dateDiff;
    const sessionDiff = (sessionOrder[a.session] ?? 3) - (sessionOrder[b.session] ?? 3);
    return sessionDiff;
  });
}

// Fungsi untuk memaksa input pair menjadi uppercase
function forceUppercaseInput() {
  const pairInput = document.getElementById('pair');
  pairInput.addEventListener('input', function() {
    const start = this.selectionStart;
    const end = this.selectionEnd;
    this.value = this.value.toUpperCase();
    this.setSelectionRange(start, end);
  });
}

// Function to update analytics UI using computeAnalytics from analytics module
function calculateAnalytics() {
  // computeAnalytics is provided by src/analytics.js
  const {
    totalTrades,
    winTrades,
    lossTrades,
    winrate,
    profitFactor
  } = computeAnalytics(trades);
  
  // Update analytics UI
  totalTradesEl.textContent = totalTrades;
  winTradesEl.textContent = winTrades;
  lossTradesEl.textContent = lossTrades;
  winrateEl.textContent = winrate.toFixed(1) + '%';
  
  if (winrate >= 50) {
    winrateEl.classList.add('winrate-value');
    winrateEl.classList.remove('lossrate-value');
  } else {
    winrateEl.classList.add('lossrate-value');
    winrateEl.classList.remove('winrate-value');
  }
  
  profitFactorEl.textContent = profitFactor === Infinity ? '∞' : profitFactor.toFixed(2);
  
  // Update chart
  const winPercentage = totalTrades > 0 ? (winTrades / totalTrades * 100) : 0;
  const lossPercentage = 100 - winPercentage;
  
  winBar.style.width = winPercentage + '%';
  lossBar.style.width = lossPercentage + '%';
  
  winPercentageEl.textContent = winPercentage.toFixed(1) + '%';
  lossPercentageEl.textContent = lossPercentage.toFixed(1) + '%';
}

function renderTrades() {
    sortTradesByDate();
    historyBody.innerHTML = '';
    if (trades.length === 0) {
    historyBody.innerHTML = '<tr><td colspan="9">Belum ada history.</td></tr>';
    calculateAnalytics();
    return;
    }

    // Untuk pewarnaan berdasarkan tanggal
    let currentDate = null;
    let dateGroupIndex = 0;
    
    trades.forEach((data, index) => {
      if (currentDate !== data.date) {
        currentDate = data.date;
        dateGroupIndex = dateGroupIndex === 0 ? 1 : 0;
      }
      
      const entryClass = data.entry === "Buy" ? "buy-box" : "sell-box";
      const wlClass = data.wl === "Win" ? "win-box" : "loss-box";
      const rowClass = dateGroupIndex === 0 ? "row-even-date" : "row-odd-date";

      const row = document.createElement('tr');
      row.className = rowClass;

      let notePreview = data.note ? data.note : '';
      let noteDisplay = notePreview.length > 10 ? notePreview.substring(0, 10) + '...' : notePreview;

       // Build row using DOM methods to avoid HTML injection
      const noCell = document.createElement('td');
      noCell.textContent = index + 1;
      
      const pairCell = document.createElement('td');
      pairCell.textContent = data.pair;

      const dateCell = document.createElement('td');
      dateCell.textContent = data.date;

      const sessionCell = document.createElement('td');
      sessionCell.textContent = data.session;

      const entryCell = document.createElement('td');
      const entrySpan = document.createElement('span');
      entrySpan.className = entryClass;
      entrySpan.textContent = data.entry;
      entryCell.appendChild(entrySpan);

      const wlCell = document.createElement('td');
      const wlSpan = document.createElement('span');
      wlSpan.className = wlClass;
      wlSpan.textContent = data.wl;
      wlCell.appendChild(wlSpan);

      const rrCell = document.createElement('td');
      rrCell.textContent = data.rr;

      const noteCell = document.createElement('td');
      noteCell.className = 'note-cell';
      noteCell.dataset.index = index;
      noteCell.textContent = noteDisplay;

      const actionCell = document.createElement('td');
      const editBtn = document.createElement('button');
      editBtn.className = 'action-btn';
      editBtn.textContent = '✏️';
      editBtn.addEventListener('click', () => editTrade(index));
      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'action-btn';
      deleteBtn.textContent = '🗑️';
      deleteBtn.addEventListener('click', () => deleteTrade(index));
      actionCell.appendChild(editBtn);
      actionCell.appendChild(deleteBtn);

      row.appendChild(noCell);
      row.appendChild(pairCell);
      row.appendChild(dateCell);
      row.appendChild(sessionCell);
      row.appendChild(entryCell);
      row.appendChild(wlCell);
      row.appendChild(rrCell);
      row.appendChild(noteCell);
      row.appendChild(actionCell);

      historyBody.appendChild(row);

    });

    document.querySelectorAll('.note-cell').forEach(cell => {
      cell.addEventListener('click', function() {
        const idx = this.dataset.index;
        const fullNote = trades[idx].note || '(Tidak ada catatan tambahan)';
        modalText.value = fullNote;
        modal.style.display = 'flex';
      });
    });
    
    calculateAnalytics();
}

function saveTrades() {
  sortTradesByDate();
  localStorage.setItem('trades', JSON.stringify(trades));
  calculateAnalytics();
}

form.addEventListener('submit', function(e) {
  e.preventDefault();
  const data = {
    pair: form.pair.value.toUpperCase(),
    date: form.date.value,
    session: form.session.value,
    entry: form.entry.value,
    wl: form.wl.value,
    rr: form.rr.value,
    note: form.note.value.trim(),
  };

  let currentTrades = trades.slice();
  if (form.dataset.editing) {
    currentTrades.splice(form.dataset.editing, 1);
  }

  if (!tradeLimits.canAddTrade(currentTrades, data.date, data.session)) {
    alert('Limit trade untuk sesi atau hari ini telah tercapai');
    return;
  }

  if (form.dataset.editing) {
    trades[form.dataset.editing] = data;
    form.removeAttribute('data-editing');
  } else {
    trades.unshift(data);
  }

  saveTrades();
  renderTrades();
  form.reset();
});

window.editTrade = function(index) {
  const data = trades[index];
  form.pair.value = data.pair;
  form.date.value = data.date;
  form.session.value = data.session;
  form.entry.value = data.entry;
  form.wl.value = data.wl;
  form.rr.value = data.rr;
  form.note.value = data.note || '';
  form.dataset.editing = index;
  
  form.scrollIntoView({ behavior: 'smooth' });
};

window.deleteTrade = function(index) {
  if (confirm("Yakin ingin menghapus trade ini?")) {
    trades.splice(index, 1);
    saveTrades();
    renderTrades();
  }
};

// Modal close event
modalClose.addEventListener('click', () => {
  modal.style.display = 'none';
});

window.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.style.display = 'none';
  }
});

// Dark mode toggle functionality
function toggleDarkMode() {
  isDarkMode = !isDarkMode;
  document.body.classList.toggle('dark-mode', isDarkMode);
  localStorage.setItem('darkMode', isDarkMode);
  darkModeToggle.checked = isDarkMode;
}

// Initialize dark mode
function initDarkMode() {
  document.body.classList.toggle('dark-mode', isDarkMode);
  darkModeToggle.checked = isDarkMode;
}

// Set up event listeners
darkModeToggle.addEventListener('change', toggleDarkMode);

// Fungsi untuk export ke JSON
function exportToJson() {
  const dataStr = JSON.stringify(trades, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;

  const pad = (n) => String(n).padStart(2, '0');
  const now = new Date();
  const rawDate = `${now.getFullYear()}/${pad(now.getMonth() + 1)}/${pad(now.getDate())}, ${pad(now.getHours())}:${pad(now.getMinutes())}`;

  const safeDate = rawDate
    .replace(/[\\/]/g, '-') // replace / and \ with -
    .replace(/:/g, '-')       // replace : with -
    .replace(/,\s*/, '_');   // replace comma and space with _

  a.download = `jurnal_trading_${safeDate}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Fungsi untuk import dari JSON
function importFromJson(file) {
  const reader = new FileReader();
  
  reader.onload = function(e) {
    try {
      const importedTrades = JSON.parse(e.target.result);
      
      if (!Array.isArray(importedTrades)) {
        throw new Error('Format file tidak valid');
      }
      
      const isValid = importedTrades.every(trade => 
        trade.pair && trade.date && trade.session && 
        trade.entry && trade.wl && trade.rr
      );
      
      if (!isValid) {
        throw new Error('Data dalam file tidak valid');
      }
      
      trades = importedTrades;
      saveTrades();
      renderTrades();
      alert('Data berhasil diimpor!');
    } catch (error) {
      alert('Terjadi kesalahan saat mengimpor data: ' + error.message);
    }
  };
  
  reader.readAsText(file);
}

// Event listener untuk tombol export JSON
exportJsonBtn.addEventListener('click', exportToJson);

// Event listener untuk tombol import JSON
importJsonBtn.addEventListener('click', () => {
  importFileInput.click();
});

// Event listener untuk file input
importFileInput.addEventListener('change', (e) => {
  if (e.target.files.length > 0) {
    importFromJson(e.target.files[0]);
    importFileInput.value = '';
  }
});

// Fungsi untuk mengontrol header saat scroll
function handleScroll() {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  
  if (scrollTop > lastScrollTop && scrollTop > 50) {
    dynamicHeader.classList.add('hidden');
  } else {
    dynamicHeader.classList.remove('hidden');
  }
  
  lastScrollTop = scrollTop;
}

window.addEventListener('scroll', handleScroll);

document.addEventListener('DOMContentLoaded', () => {
  const setTodayDate = () => {
      const today = new Date().toISOString().split('T')[0];
      const dateInput = document.getElementById('date');
      if (dateInput) dateInput.value = today;
  };

  setTodayDate();
  forceUppercaseInput();
  renderTrades();
  initDarkMode();

  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
      form.addEventListener('submit', () => {
          setTimeout(setTodayDate, 0);
      });
  });

  window.addEventListener('pageshow', (event) => {
      if (event.persisted) {
          setTodayDate();
      }
  });
});

const rrInput = document.getElementById('rr');
rrInput.addEventListener('input', () => {
  const regex = /^\d+(\.\d{1,2})?:1$/;
  if (!regex.test(rrInput.value)) {
    rrInput.setCustomValidity('Format RR harus "X:1", contoh 2:1 / 2.5:1');
  } else {
    rrInput.setCustomValidity('');
  }
});

renderTrades();
