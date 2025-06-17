## Struktur File

- `index.html`: Struktur utama halaman
- `style.css`: Semua styling dan tema, termasuk dark mode
- `main.js`: Semua logic aplikasi, penyimpanan lokal, export/import, dsb

Fitur tambahan: riwayat selalu disusun berdasarkan tanggal terbaru. Setiap trade baru ditambahkan ke urutan pertama bila tanggalnya paling baru. Pada tanggal yang sama, urutan sesi mengikuti prioritas **New York**, kemudian **London**, dan terakhir **Asia**.

> Setelah pemisahan file, mudah di-maintain dan scalable!
