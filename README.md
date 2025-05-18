# Penyelesaian Puzzle Rush Hour

<div align="center">
  <img src="doc/app.png" alt="Aplikasi solver" width="700"/>
  <h3>Penyelesai Puzzle menggunakan Algoritma Pencarian</h3>
  <p>Tugas Kecil 3 IF2211 Strategi Algoritma</p>
</div>

## 🔗 Deploy

Aplikasi dapat dicoba secara online melalui link berikut:  
[https://rushhour-solver.vercel.app/](https://rushhour-solver.vercel.app/)

## 🔍 Gambaran Umum

Penyelesaian Puzzle Rush Hour adalah aplikasi web yang menyelesaikan permainan puzzle Rush Hour klasik menggunakan berbagai algoritma pencarian. Puzzle terdiri dari grid dengan kendaraan berbagai ukuran. Tujuannya adalah memindahkan mobil merah (kendaraan target) ke pintu keluar dengan menggeser kendaraan lain agar tidak menghalangi jalan.

Aplikasi ini dikembangkan sebagai bagian dari tugas kecil mata kuliah Strategi Algoritma di Institut Teknologi Bandung.

## ✨ Fitur-Fitur

- Visualisasi puzzle interaktif
- Implementasi beberapa algoritma pencarian:
  - Greedy Best-First Search
  - A\* Search
  - Uniform Cost Search (UCS)
  - Algoritma Dijkstra
  - Fringe Search
- Berbagai fungsi heuristik
  - Manhattan Distance
  - Blocking Vehicles
  - Combined (weighted combination)
- Pemutaran solusi langkah demi langkah
- Statistik kinerja (waktu eksekusi, jumlah simpul yang dikunjungi)
- Unggah file untuk puzzle kustom
- Ekspor solusi ke file teks
- Mode Gelap/Terang

## 🧠 Algoritma

1. **Greedy Best-First Search**

   - Selalu memilih state dengan nilai heuristik terendah
   - Cepat tetapi tidak menjamin solusi optimal

2. **A\* Search**

   - Menggabungkan biaya jalur aktual (g) dan estimasi biaya ke tujuan (h)
   - Menyeimbangkan eksplorasi dan eksploitasi untuk pencarian yang efisien

3. **Uniform Cost Search (UCS)**

   - Memperluas simpul berdasarkan biaya jalur dari awal
   - Menjamin solusi optimal

4. **Algoritma Dijkstra**
   - Mirip dengan UCS tetapi menggunakan pendekatan berbeda untuk melacak simpul yang dikunjungi
   - Menemukan jalur terpendek dengan memprioritaskan simpul dengan biaya terendah

5. **Fringe Search**
   - Menggabungkan efisiensi memori dari iterative deepening dengan strategi pencarian A*
   - Menggunakan struktur dua daftar ("now" dan "later") untuk efisiensi
   - Bekerja efektif dengan heuristik yang admissible

## 🔢 Fungsi Heuristik

1. **Manhattan Distance**
   - Mengukur jarak terpendek dari posisi saat ini ke tujuan tanpa memperhitungkan hambatan
   - Konsisten dan admissible, menjamin solusi optimal dengan A* dan Fringe Search

2. **Blocking Vehicles**
   - Menghitung jumlah kendaraan yang menghalangi jalur langsung ke tujuan
   - Lebih informatif untuk kondisi tertentu tetapi bisa menjadi non-admissible

3. **Combined**
   - Kombinasi tertimbang antara Manhattan Distance dan Blocking Vehicles
   - Dirancang untuk meningkatkan performa dengan menyeimbangkan kedua metrik

## 📦 Persyaratan

- Node.js (>= v22.0.0)
- npm atau yarn
- Browser web modern (Chrome, Firefox, Safari, Edge)

## 🚀 Instalasi & Menjalankan Aplikasi

### Mode Pengembangan

```bash
# Mengkloning repositori
git clone https://github.com/yonatan-nyo/Tucil3_13523008_13523036.git

# Pindah ke direktori sumber
cd src

# Instalasi dependensi
npm install

# Menjalankan server pengembangan
npm run dev
```

Aplikasi dapat diakses di http://localhost:4000

### Mode Production

```bash
# Pindah ke direktori bin
cd bin

# Menyajikan file statis (menggunakan server HTTP sederhana)
npx serve -s

# Alternatif, jika serve diinstal secara global
serve -s
```

Build produksi dapat diakses di http://localhost:3000

## 📝 Panduan Penggunaan

### Mengunggah file puzzle

1. Klik tombol "Upload File"
2. Pilih file konfigurasi puzzle yang valid
3. Puzzle akan ditampilkan di papan

### Memilih algoritma dan heuristik

1. Pilih dari Greedy, A*, UCS, Dijkstra, atau Fringe Search
2. Pilih fungsi heuristik (untuk A\*, Greedy, dan Fringe Search)

### Menyelesaikan puzzle

1. Klik tombol "Solve Puzzle"
2. Tunggu algoritma menemukan solusi

### Melihat dan mengontrol solusi

1. Gunakan kontrol pemutaran untuk melihat solusi langkah demi langkah
2. Sesuaikan kecepatan pemutaran menggunakan slider
3. Lihat statistik tentang proses penyelesaian (waktu eksekusi, simpul yang dieksplorasi, panjang solusi)
4. Simpan solusi ke file dengan tombol "Simpan Solusi ke File"

## 📁 Struktur Proyek

```
src/src/
├──── lib/
│     ├── algorithms/        # Implementasi algoritma pencarian
│     ├── helpers/           # Fungsi utilitas
│     ├── heuristics.ts      # Fungsi heuristik
│     ├── types.ts           # Definisi tipe TypeScript
│     └── ...
├──── pages/                 # Komponen React untuk halaman
│     └── sections/          # Komponen bagian halaman
├──── public/                # Aset statis
└──── App.tsx                # Komponen aplikasi utama
```

## 👨‍💻 Anggota Tim

| Nama                 | NIM      |
| -------------------- | -------- |
| Varel Tiara          | 13523008 |
| Yonatan Edward Njoto | 13523036 |
