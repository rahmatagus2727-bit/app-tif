# My Birawa HK - Proyek HK TIF (Telkom Property Housekeeping)

Aplikasi Web Monitoring & Checklist Housekeeping (HK) Telkom Property My Birawa dengan alur 4 tampilan, upload foto bukti sebelum/sesudah, integrasi kalender timeline bulanan, dan export rekap laporan Excel real-time.

---

## 🚀 Fitur Utama

1. **Dashboard & Timeline Laporan Bulanan**:
   - Timeline interaktif tanggal 01 s/d 31 setiap bulan.
   - Deteksi otomatis hari kerja, hari libur (Sabtu & Minggu), dan hari libur nasional (contoh: 17 Agustus Hari Kemerdekaan).
   - Status indikator penyelesaian (100% Lengkap 4/4 Foto, Parsial 1-3 Foto, atau Libur).
   - Navigasi cepat tanggal dan bulan.

2. **Checklist Kebersihan & Bukti Foto**:
   - Pemilihan gedung/lokasi kerja (contoh: Gedung Lea Injoko, Gudang Kalibrasi).
   - Alur 4 checklist area kerja (Pembersihan Lantai, Kaca/Jendela, Toilet, Pengelolaan Sampah).
   - Upload & capture foto bukti sebelum dan sesudah pekerjaan.
   - Status verifikasi pekerjaan real-time.

3. **Autentikasi & Multi-Role**:
   - Halaman Sign In / Login interaktif.
   - Fitur Quick Demo Login:
     - **Rudik Setiyawan** (HK Officer)
     - **Budi Santoso** (HK Supervisor)
     - **Administrator TIF** (Area Manager)
   - Konfirmasi Logout in-app di Tab Profil, Top Navbar, dan Dashboard.

4. **Rekapitulasi & Export Excel**:
   - Download laporan dalam format `.xlsx` (Excel) terstruktur.
   - Filter berdasarkan tanggal, gedung, dan status penyelesaian.

---

## 🛠️ Panduan Instalasi & Menjalankan di Lokal / GitHub

### 1. Prasyarat
- **Node.js**: versi 18 atau lebih baru.
- **npm** atau **yarn** atau **pnpm**.

### 2. Clone Repositori
```bash
git clone https://github.com/username/project-tif.git
cd project-tif
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Menjalankan Server Development
```bash
npm run dev
```
Buka browser di `http://localhost:3000` (atau port yang tertera pada terminal).

### 5. Build untuk Produksi
```bash
npm run build
```
Hasil build siap saji akan dibuat di folder `dist/`.

---

## 📦 Tech Stack
- **Framework**: [React 19](https://react.dev/) + [Vite 6](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Export Data**: [SheetJS (xlsx)](https://sheetjs.com/)
- **Interactive FX**: [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)

---

## 📄 Lisensi
Hak Cipta © 2026 Telkom Property - My Birawa HK.
