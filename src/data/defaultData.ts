import { Building, HKItemDefinition, FrequencyType, HKSubmission, UserProfile, HKOrder, AppNotification } from '../types';

export const DEFAULT_USER: UserProfile = {
  name: 'Rudik Setiyawan',
  email: '92001214@telpro.co.id',
  nik: '92001214',
  role: 'Petugas Housekeeping (HK)',
  department: 'Telkom Property - Facility Management Witel Surabaya Selatan',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
  phoneNumber: '0812-3456-7890',
};

// DAFTAR 15 GEDUNG SESUAI MATRIKS WITEL SURABAYA SELATAN (TELKOM PROPERTY)
export const DEFAULT_BUILDINGS: Building[] = [
  {
    id: 'bld-lea-01',
    name: 'KANTOR WITEL SURABAYA SLTN LEA',
    code: 'LEA-01',
    buildingClass: 'Kelas 2',
    witel: 'Witel Surabaya Selatan',
    address: 'Jl. Injoko / Ketintang No. 156, Surabaya',
    photoUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'bld-msc-02',
    name: 'MSC SURABAYA KALIBRASI INJOKO',
    code: 'MSC-02',
    buildingClass: 'Kelas 3',
    witel: 'Witel Surabaya Selatan',
    address: 'Kompleks Injoko Kalibrasi, Surabaya',
    photoUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'bld-gud-03',
    name: 'MSC SBY GUDANG KALIBRASI',
    code: 'GUD-03',
    buildingClass: 'Kelas 5',
    witel: 'Witel Surabaya Selatan',
    address: 'Kawasan Gudang Kalibrasi Injoko',
    photoUrl: 'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'bld-mlw-04',
    name: 'GUDANG MELAWAI',
    code: 'MLW-04',
    buildingClass: 'Kelas 5',
    witel: 'Witel Surabaya Selatan',
    address: 'Jl. Melawai, Surabaya Selatan',
    photoUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'bld-sto-05',
    name: 'STO MSC MELAWAI',
    code: 'STO-05',
    buildingClass: 'Kelas 3',
    witel: 'Witel Surabaya Selatan',
    address: 'Kompleks STO Melawai, Surabaya',
    photoUrl: 'https://images.unsplash.com/photo-1554469384-e58fac16e23a?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'bld-sto-06',
    name: 'STO INJOKO',
    code: 'STO-06',
    buildingClass: 'Kelas 2',
    witel: 'Witel Surabaya Selatan',
    address: 'Jl. Injoko No. 12, Surabaya',
    photoUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'bld-rfb-07',
    name: 'STO INJOKO GDG REFURBISH',
    code: 'RFB-07',
    buildingClass: 'Kelas 5',
    witel: 'Witel Surabaya Selatan',
    address: 'Area Gedung Refurbish STO Injoko',
    photoUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'bld-kps-08',
    name: 'STO KAPUAS 51',
    code: 'KPS-08',
    buildingClass: 'Kelas 3',
    witel: 'Witel Surabaya Selatan',
    address: 'Jl. Kapuas No. 51, Surabaya',
    photoUrl: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'bld-drm-09',
    name: 'STO KAPUAS (STO DARMO)',
    code: 'DRM-09',
    buildingClass: 'Kelas 3',
    witel: 'Witel Surabaya Selatan',
    address: 'Jl. Kapuas / Darmo, Surabaya',
    photoUrl: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'bld-dny-10',
    name: 'PLASA DINOYO',
    code: 'DNY-10',
    buildingClass: 'Kelas 3',
    witel: 'Witel Surabaya Selatan',
    address: 'Jl. Dinoyo, Surabaya Selatan',
    photoUrl: 'https://images.unsplash.com/photo-1554469384-e58fac16e23a?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'bld-rkt-11',
    name: 'STO RUNGKUT II',
    code: 'RKT-11',
    buildingClass: 'Kelas 3',
    witel: 'Witel Surabaya Selatan',
    address: 'Kawasan Industri SIER / STO Rungkut II, Surabaya',
    photoUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'bld-rkt-12',
    name: 'STO RUNGKUT I',
    code: 'RKT-12',
    buildingClass: 'Kelas 3',
    witel: 'Witel Surabaya Selatan',
    address: 'Jl. Rungkut Asri / STO Rungkut I, Surabaya',
    photoUrl: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'bld-pls-13',
    name: 'PLASA STO RUNGKUT I',
    code: 'PLS-13',
    buildingClass: 'Kelas 3',
    witel: 'Witel Surabaya Selatan',
    address: 'Plasa Pelayanan STO Rungkut I, Surabaya',
    photoUrl: 'https://images.unsplash.com/photo-1554469384-e58fac16e23a?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'bld-wru-14',
    name: 'STO WARU II',
    code: 'WRU-14',
    buildingClass: 'Kelas 3',
    witel: 'Witel Surabaya Selatan',
    address: 'Jl. Raya Waru / STO Waru II, Surabaya Selatan',
    photoUrl: 'https://images.unsplash.com/photo-1497215842964-222b430dc094?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'bld-wru-15',
    name: 'STO WARU I',
    code: 'WRU-15',
    buildingClass: 'Kelas 3',
    witel: 'Witel Surabaya Selatan',
    address: 'Jl. Raya Waru No. 1 / STO Waru I, Surabaya Selatan',
    photoUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&auto=format&fit=crop&q=80'
  },
];

export const FREQUENCY_CATEGORIES: { id: FrequencyType; label: string; subLabel: string; shortCode: string }[] = [
  { id: 'harian', label: 'Kegiatan Harian', subLabel: 'Dilakukan setiap hari kerja / shift', shortCode: 'HARIAN' },
  { id: '1x_seminggu', label: 'Mingguan (1x Seminggu)', subLabel: 'Jadwal rutin mingguan', shortCode: 'MINGGUAN' },
  { id: '2x_seminggu', label: '2 Mingguan (2x Seminggu)', subLabel: 'Selasa & Jumat / 2x sepekan', shortCode: '2 MINGGUAN' },
  { id: '1x_sebulan', label: 'Bulanan (1x Sebulan)', subLabel: 'Deep cleaning & general check bulanan', shortCode: 'BULANAN' },
];

export const DEFAULT_HK_ITEMS: HKItemDefinition[] = [
  // 1. Kegiatan Harian (sesuai matriks tabel: Sampah 1-2x sehari, Meubelair 1x sehari, Toiletries 3x sehari, Kebersihan Toilet 3-4x sehari, Lantai 5x seminggu)
  { id: 'h-sampah', name: 'Sampah Ruangan & Koridor', frequency: 'harian', description: 'Pengosongan tempat sampah ruangan dan penggantian plastik sampah baru' },
  { id: 'h-meubelair', name: 'Meubelair (Kursi, Meja, Lemari, TV, Telp, Kulkas)', frequency: 'harian', description: 'Pembersihan meja kerja, kursi, lemari dari debu, noda dan sanitasi' },
  { id: 'h-toiletries', name: 'Toiletries (Tissue Roll, Sabun Cuci Tangan, Keset)', frequency: 'harian', description: 'Pengecekan ketersediaan tissue roll, sabun cuci tangan, dan keset pintu toilet' },
  { id: 'h-kebersihan-toilet', name: 'Kebersihan Toilet (Dinding, Kaca, Wastafel, Closet, Pintu, Urinoir)', frequency: 'harian', description: 'Pembersihan kloset, wastafel, dinding kaca, urinoir, lantai toilet & pengharum' },
  { id: 'h-lantai', name: 'Pembersihan & Perawatan Lantai (Sapu & Pel)', frequency: 'harian', description: 'Penyapuan dan pengepelan lantai kerja, koridor & lobi utama gedung' },
  { id: 'h-kaca-pintu', name: 'Kaca & Pintu Masuk Bangunan', frequency: 'harian', description: 'Pengelapan kaca pintu utama, handle pintu dan partisi kaca' },

  // 2. Kegiatan 1x Seminggu (sesuai tabel: Lantai Keramik/Granit/Marmer 1-4x sebulan, Plafon 1-4x sebulan, Sampah luar)
  { id: 'w1-lantai-keramik', name: 'Lantai Keramik / Granit / Marmer', frequency: '1x_seminggu', description: 'Pembersihan intensif dan perawatan permukaan lantai keramik/granit' },
  { id: 'w1-plafon', name: 'Pembersihan Plafon & Sudut Atas', frequency: '1x_seminggu', description: 'Pembersihan sarang laba-laba dan debu pada plafon ruangan & selasar' },
  { id: 'w1-kaca-jendela', name: 'Kaca Jendela Luar / Dalam', frequency: '1x_seminggu', description: 'Pembersihan menyeluruh kaca jendela gedung bagian dalam dan luar' },
  { id: 'w1-sampah-luar', name: 'Sampah Area Luar & TPS Gedung', frequency: '1x_seminggu', description: 'Pengangkutan sampah ke TPS dan pembersihan area penampungan luar' },

  // 3. Kegiatan 2x Seminggu / 2x Sebulan (sesuai tabel: Dinding 1-2x sebulan, Saluran air 1-2x sebulan, Pest Control 1-2x sebulan, Hygiene unit)
  { id: 'w2-dinding', name: 'Pembersihan Dinding & Panel Koridor', frequency: '2x_seminggu', description: 'Pembersihan noda dinding, saklar lampu, panel dinding dan list' },
  { id: 'w2-saluran-air', name: 'Saluran Air & Drainase Indoor/Outdoor', frequency: '2x_seminggu', description: 'Pembersihan saluran air, drainase lantai dan grill pembuangan' },
  { id: 'w2-pest-control', name: 'Pekerjaan Pest and Rodent Control', frequency: '2x_seminggu', description: 'Inspeksi & pengendalian hama/vektor di lingkungan dalam dan luar gedung' },
  { id: 'w2-hygiene-unit', name: 'Pekerjaan Hygiene Service (Hygiene Unit)', frequency: '2x_seminggu', description: 'Pengecekan dan sanitasi hygiene unit & tempat pembuangan khusus' },

  // 4. Kegiatan 1x Sebulan / Triwulan (sesuai tabel: Gordyn/Vertical blind 1x sebulan, Pengharum ruangan 1x sebulan, Lantai triwulan)
  { id: 'm1-gordyn-blind', name: 'Gordyn dan Vertical Blind', frequency: '1x_sebulan', description: 'Pembersihan debu dan pencucian berkala tirai jendela/vertical blind' },
  { id: 'm1-pengharum', name: 'Pengharum Ruangan (Hygiene Service)', frequency: '1x_sebulan', description: 'Pengecekan dan penggantian refill aerosol pengharum ruangan otomatis' },
  { id: 'm1-lantai-triwulan', name: 'Perawatan Lantai Berkala (Triwulan)', frequency: '1x_sebulan', description: 'Deep cleaning, scrubbing, stripping & polishing lantai berkala triwulan' },
  { id: 'm1-kerusakan-fisik', name: 'Pemeriksaan Kerusakan Fisik Fasilitas HK', frequency: '1x_sebulan', description: 'Inspeksi berkala kondisi fisik fasilitas kebersihan dan infrastruktur gedung' },
];

export const INITIAL_SUBMISSIONS: HKSubmission[] = [
  {
    id: 'sub-1',
    buildingId: 'bld-lea-01',
    buildingName: 'KANTOR WITEL SURABAYA SLTN LEA',
    frequency: 'harian',
    frequencyLabel: 'Kegiatan Harian',
    itemId: 'h-sampah',
    itemName: 'Sampah Ruangan & Koridor',
    conditionGood: true,
    photoUrl: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=600&auto=format&fit=crop&q=80',
    photoFileName: 'sampah_ruangan_lea.jpg',
    notes: 'Tempat sampah sudah dikosongkan dan plastik sampah diganti baru.',
    officerName: 'Rudik Setiyawan',
    timestamp: new Date().toISOString(),
    dateOnly: new Date().toISOString().split('T')[0],
  },
  {
    id: 'sub-2',
    buildingId: 'bld-lea-01',
    buildingName: 'KANTOR WITEL SURABAYA SLTN LEA',
    frequency: 'harian',
    frequencyLabel: 'Kegiatan Harian',
    itemId: 'h-meubelair',
    itemName: 'Meubelair (Kursi, Meja, Lemari, TV, Telp, Kulkas)',
    conditionGood: true,
    photoUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&auto=format&fit=crop&q=80',
    photoFileName: 'meubelair_clean.jpg',
    notes: 'Meja dan kursi kerja sudah dilap dan disemprot disinfektan.',
    officerName: 'Rudik Setiyawan',
    timestamp: new Date().toISOString(),
    dateOnly: new Date().toISOString().split('T')[0],
  },
  {
    id: 'sub-3',
    buildingId: 'bld-lea-01',
    buildingName: 'KANTOR WITEL SURABAYA SLTN LEA',
    frequency: '1x_seminggu',
    frequencyLabel: 'Mingguan (1x Seminggu)',
    itemId: 'w1-kaca-jendela',
    itemName: 'Kaca Jendela Luar / Dalam',
    conditionGood: true,
    photoUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80',
    photoFileName: 'kaca_jendela_lt1.jpg',
    notes: 'Kaca jendela lt 1 & 2 telah dibersihkan menggunakan squeegee.',
    officerName: 'Rudik Setiyawan',
    timestamp: new Date().toISOString(),
    dateOnly: new Date().toISOString().split('T')[0],
  },
  {
    id: 'sub-4',
    buildingId: 'bld-msc-02',
    buildingName: 'MSC SURABAYA KALIBRASI INJOKO',
    frequency: 'harian',
    frequencyLabel: 'Kegiatan Harian',
    itemId: 'h-lantai',
    itemName: 'Pembersihan & Perawatan Lantai (Sapu & Pel)',
    conditionGood: true,
    photoUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&auto=format&fit=crop&q=80',
    photoFileName: 'lantai_gudang_kalibrasi.jpg',
    notes: 'Lantai utama sudah dipel dengan desinfektan aroma pinus.',
    officerName: 'Rudik Setiyawan',
    timestamp: new Date().toISOString(),
    dateOnly: new Date().toISOString().split('T')[0],
  }
];

export const INITIAL_ORDERS: HKOrder[] = [
  {
    id: 'ord-1',
    code: 'RO-2026-0822-01',
    title: 'Pembersihan Rutin Kantor Witel Sby Sltn Lea',
    buildingName: 'KANTOR WITEL SURABAYA SLTN LEA',
    category: 'Kegiatan Harian HK',
    date: '22 Agu 2026',
    status: 'Dalam Proses',
    assignedTo: 'Rudik Setiyawan',
    progress: 50,
  },
  {
    id: 'ord-2',
    code: 'RO-2026-0822-02',
    title: 'Sanitasi & Refill Tisue MSC Kalibrasi Injoko',
    buildingName: 'MSC SURABAYA KALIBRASI INJOKO',
    category: 'Pengecekan Toilet & Tisue',
    date: '22 Agu 2026',
    status: 'Dalam Proses',
    assignedTo: 'Rudik Setiyawan',
    progress: 33,
  },
  {
    id: 'ord-3',
    code: 'RO-2026-0821-09',
    title: 'General Cleaning Plasa Dinoyo',
    buildingName: 'PLASA DINOYO',
    category: 'Mingguan & Polishing Lantai',
    date: '21 Agu 2026',
    status: 'Selesai',
    assignedTo: 'Rudik Setiyawan',
    progress: 100,
  },
  {
    id: 'ord-4',
    code: 'RO-2026-0820-14',
    title: 'Deep Cleaning STO Rungkut I & II',
    buildingName: 'STO RUNGKUT I',
    category: 'Bulanan / AC Grill',
    date: '20 Agu 2026',
    status: 'Selesai',
    assignedTo: 'Rudik Setiyawan',
    progress: 100,
  }
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    title: 'Daftar Gedung Diperbarui',
    message: '15 Gedung Witel Surabaya Selatan (Kelas 2, Kelas 3, Kelas 5) siap diinspeksi.',
    time: 'Baru saja',
    read: false,
    type: 'system',
  },
  {
    id: 'notif-2',
    title: 'Tugas Baru: Checklist Harian',
    message: 'Silakan lengkapi dokumentasi foto sampah dan toilet untuk KANTOR WITEL SURABAYA SLTN LEA.',
    time: '25 mnt lalu',
    read: false,
    type: 'order',
  },
  {
    id: 'notif-3',
    title: 'Approval Selesai',
    message: 'Checklist mingguan PLASA DINOYO telah diverifikasi oleh Supervisor HK.',
    time: '2 jam lalu',
    read: false,
    type: 'approval',
  },
  {
    id: 'notif-4',
    title: 'Reminder Checklist Bulanan',
    message: 'Jadwal pembersihan gordyn & vertical blind jatuh tempo pekan ini.',
    time: '1 hari lalu',
    read: true,
    type: 'checklist',
  },
  {
    id: 'notif-5',
    title: 'Maintenance Update',
    message: 'Aplikasi My Birawa Housekeeping aktif dengan 15 lokasi gedung Witel Surabaya Selatan.',
    time: '2 hari lalu',
    read: true,
    type: 'system',
  },
];
