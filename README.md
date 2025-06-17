## Struktur File
# Jurnal Trading

- `index.html`: Struktur utama halaman
- `style.css`: Semua styling dan tema, termasuk dark mode
- `main.js`: Semua logic aplikasi, penyimpanan lokal, export/import, dsb
Aplikasi ini merupakan jurnal trading berbasis web untuk mencatat dan
menganalisis aktivitas trading. Seluruh kode berada di dalam repository ini
tanpa proses build tambahan.

Fitur tambahan: riwayat selalu disusun berdasarkan tanggal terbaru. Setiap trade baru ditambahkan ke urutan pertama bila tanggalnya paling baru. Pada tanggal yang sama, urutan sesi mengikuti prioritas **New York**, kemudian **London**, dan terakhir **Asia**.
## Struktur Proyek

> Setelah pemisahan file, mudah di-maintain dan scalable!
- `index.html` – Halaman utama aplikasi.
- `style.css` – Semua styling dan tema, termasuk dukungan dark mode.
- `main.js` – Logika utama aplikasi: penyimpanan lokal, pengelolaan riwayat,
  validasi form, serta inisialisasi fitur.
- `src/analytics.js` – Fungsi menghitung metrik seperti total trade, winrate,
  dan profit factor.
- `src/tradeLimits.js` – Aturan batas trade per sesi/hari.
- `tests/` – Unit test menggunakan Jest (`analytics.test.js` dan
  `tradeLimits.test.js`).
- `package.json` – Konfigurasi Node.js beserta script `npm test`.

## Menjalankan

Aplikasi bersifat statis, cukup buka `index.html` di browser modern untuk
mulai menggunakan jurnal trading.

## Pengujian

Pastikan Node.js terpasang, lalu jalankan:

```bash
npm install
npm test
```

perintah di atas akan menjalankan seluruh unit test dengan Jest.

## Fitur Utama

- Form pencatatan trade dengan pair, tanggal, sesi, hasil, RR, dan catatan.
- Statistik otomatis (total trade, win, loss, winrate, profit factor).
- Batas jumlah trade per sesi melalui `tradeLimits.js`.
- Dark mode yang dapat diaktifkan melalui toggle.
- Ekspor dan impor data trading dalam format JSON.
- Riwayat trade diurutkan berdasarkan tanggal terbaru dengan prioritas sesi
  **New York**, kemudian **London**, dan terakhir **Asia**.

> Setelah pemisahan file, proyek lebih mudah dipelihara dan dapat dikembangkan
> kembali jika diperlukan.
