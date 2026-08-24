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

// KATEGORI KHUSUS GEDUNG KELAS 5 (GUDANG KALIBRASI, GUDANG MELAWAI, GDG REFURBISH)
export const KELAS_5_CATEGORIES: { id: FrequencyType; label: string; subLabel: string; shortCode: string }[] = [
  { id: '1x_seminggu', label: 'Kegiatan Mingguan', subLabel: '1 foto/minggu • 4 foto/bulan per item (Total 12 foto/bulan)', shortCode: 'MINGGUAN' },
  { id: '1x_sebulan', label: 'Kegiatan Bulanan', subLabel: '1 foto/bulan & triwulan (Total 3 foto/bulan)', shortCode: 'BULANAN' },
];

// KATEGORI KHUSUS GEDUNG KELAS 2 (KANTOR WITEL SURABAYA SLTN, STO INJOKO)
export const KELAS_2_CATEGORIES: { id: FrequencyType; label: string; subLabel: string; shortCode: string }[] = [
  { id: 'harian', label: 'Kegiatan Harian', subLabel: '1 foto/hari per item • 20 foto/bulan per item (Total 100 foto/bulan)', shortCode: 'HARIAN' },
  { id: '1x_seminggu', label: 'Kegiatan Mingguan', subLabel: '2x seminggu (2 foto/minggu) • 8 foto/bulan (Total 8 foto/bulan)', shortCode: 'MINGGUAN' },
  { id: '1x_sebulan', label: 'Kegiatan Bulanan', subLabel: '1x, 2x, 4x sebulan & triwulan (Total 19 foto/bulan)', shortCode: 'BULANAN' },
];

// DAFTAR ITEM PEKERJAAN KHUSUS KELAS 2 (PERSIS SESUAI SPESIFIKASI USER)
export const KELAS_2_HK_ITEMS: HKItemDefinition[] = [
  // 1. Kegiatan Harian (5 items)
  {
    id: 'k2-h-lantai',
    name: 'Lantai',
    frequency: 'harian',
    description: '5 x seminggu - Pembersihan & perawatan lantai ruangan kerja, koridor & lobi'
  },
  {
    id: 'k2-h-sampah-ruangan',
    name: 'Sampah ruangan',
    frequency: 'harian',
    description: '2 x sehari - Pengosongan dan pembersihan tempat sampah ruangan gedung'
  },
  {
    id: 'k2-h-meubelair',
    name: 'Pembersihan meubelair',
    frequency: 'harian',
    description: 'Kursi, meja, dan lemari, TV, telephone, kulkas 1 x sehari'
  },
  {
    id: 'k2-h-tissue-roll',
    name: 'Tissue roll',
    frequency: 'harian',
    description: '3 x sehari - Pengecekan, penyediaan dan penggantian tissue roll toilet'
  },
  {
    id: 'k2-h-kebersihan-toilet',
    name: 'Kebersihan toilet',
    frequency: 'harian',
    description: 'Dinding, kaca, wastafel, closet, pintu, urinoir 4 x sehari'
  },

  // 2. Kegiatan Mingguan (1 item)
  {
    id: 'k2-w-sampah-tps',
    name: 'Sampah TPS',
    frequency: '1x_seminggu',
    description: '2 x seminggu - Pengangkutan dan pembuangan sampah ke TPS gedung'
  },

  // 3. Kegiatan Bulanan (9 items)
  {
    id: 'k2-m-dinding',
    name: 'Pembersihan dinding',
    frequency: '1x_sebulan',
    description: 'Dinding 2 x sebulan - Pembersihan debu, sarang laba-laba & noda dinding'
  },
  {
    id: 'k2-m-lantai-triwulan',
    name: 'Lantai',
    frequency: '1x_sebulan',
    description: '1 x setiap triwulan - General cleaning & perawatan berkala lantai menyeluruh'
  },
  {
    id: 'k2-m-lantai-keramik',
    name: 'Lantai keramik/granit/marmer',
    frequency: '1x_sebulan',
    description: '4 x sebulan - Buffing, scrubbing & pembersihan khusus lantai keramik/granit/marmer'
  },
  {
    id: 'k2-m-plafon',
    name: 'Pembersihan plafon',
    frequency: '1x_sebulan',
    description: 'Plafon 4 x sebulan - Pembersihan debu, sarang laba-laba & plafon gedung'
  },
  {
    id: 'k2-m-saluran-air',
    name: 'Pembersihan indoor bangunan',
    frequency: '1x_sebulan',
    description: 'Saluran air 2 x sebulan - Pembersihan saluran air dan drainase indoor'
  },
  {
    id: 'k2-m-gordyn-blind',
    name: 'Gordyn dan vertical blind',
    frequency: '1x_sebulan',
    description: '1 x sebulan - Pembersihan dan penyedotan debu gordyn & vertical blind'
  },
  {
    id: 'k2-m-pest-control',
    name: 'Pekerjaan pest and rodent control',
    frequency: '1x_sebulan',
    description: 'Lingkungan di dalam dan luar gedung 2 x sebulan'
  },
  {
    id: 'k2-m-hygiene-service',
    name: 'Pekerjaan hygiene service',
    frequency: '1x_sebulan',
    description: 'Pengharum ruangan 1 x sebulan - Pengecekan & isi ulang pengharum ruangan'
  },
  {
    id: 'k2-m-hygiene-unit',
    name: 'Hygiene unit',
    frequency: '1x_sebulan',
    description: '2 x sebulan - Perawatan, sanitasi & pergantian refill unit hygiene'
  },
];

// KATEGORI KHUSUS GEDUNG KELAS 3 (STO KAPUAS, DARMO, DINOYO, RUNGKUT, WARU, MSC KALIBRASI, MSC MELAWAI, DLL)
export const KELAS_3_CATEGORIES: { id: FrequencyType; label: string; subLabel: string; shortCode: string }[] = [
  { id: 'harian', label: 'Kegiatan Harian', subLabel: '1 foto/hari per item • 20 foto/bulan per item (Total 80 foto/bulan)', shortCode: 'HARIAN' },
  { id: '1x_seminggu', label: 'Kegiatan Mingguan', subLabel: '2x seminggu (2 foto/minggu) • 8 foto/bulan per item (Total 16 foto/bulan)', shortCode: 'MINGGUAN' },
  { id: '1x_sebulan', label: 'Kegiatan Bulanan', subLabel: '1x, 2x sebulan & triwulan (Total 10 foto/bulan)', shortCode: 'BULANAN' },
];

// DAFTAR ITEM PEKERJAAN KHUSUS KELAS 3 (PERSIS SESUAI SPESIFIKASI USER)
export const KELAS_3_HK_ITEMS: HKItemDefinition[] = [
  // 1. Kegiatan Harian (4 items)
  {
    id: 'k3-h-sampah-ruangan',
    name: 'Sampah ruangan',
    frequency: 'harian',
    description: '1 x sehari - Pengosongan dan pembersihan tempat sampah ruangan gedung'
  },
  {
    id: 'k3-h-meubelair',
    name: 'Pembersihan meubelair',
    frequency: 'harian',
    description: 'Kursi, meja, dan lemari, TV, telephone, kulkas 1 x sehari'
  },
  {
    id: 'k3-h-tissue-roll',
    name: 'Tissue roll',
    frequency: 'harian',
    description: '3 x sehari - Pengecekan, penyediaan dan penggantian tissue roll toilet'
  },
  {
    id: 'k3-h-kebersihan-toilet',
    name: 'Kebersihan toilet',
    frequency: 'harian',
    description: 'Dinding, kaca, wastafel, closet, pintu, urinoir 3 x sehari'
  },

  // 2. Kegiatan Mingguan (2 items)
  {
    id: 'k3-w-lantai-perawatan',
    name: 'Pembersihan dan perawatan lantai',
    frequency: '1x_seminggu',
    description: 'Lantai 2 x seminggu - Penyapuan, pengepelan & perawatan lantai ruangan'
  },
  {
    id: 'k3-w-sampah-tps',
    name: 'Sampah TPS',
    frequency: '1x_seminggu',
    description: '2 x seminggu - Pengangkutan dan pembuangan sampah ke TPS gedung'
  },

  // 3. Kegiatan Bulanan (9 items)
  {
    id: 'k3-m-dinding',
    name: 'Pembersihan dinding',
    frequency: '1x_sebulan',
    description: 'Dinding 1 x sebulan - Pembersihan debu, sarang laba-laba & noda dinding'
  },
  {
    id: 'k3-m-lantai-triwulan',
    name: 'Lantai',
    frequency: '1x_sebulan',
    description: '1 x setiap triwulan - General cleaning & perawatan berkala lantai menyeluruh'
  },
  {
    id: 'k3-m-lantai-keramik',
    name: 'Lantai keramik/granit/marmer',
    frequency: '1x_sebulan',
    description: '1 x sebulan - Buffing, scrubbing & pembersihan lantai keramik/granit/marmer'
  },
  {
    id: 'k3-m-plafon',
    name: 'Pembersihan plafon',
    frequency: '1x_sebulan',
    description: 'Plafon 1 x sebulan - Pembersihan debu, sarang laba-laba & plafon gedung'
  },
  {
    id: 'k3-m-saluran-air',
    name: 'Pembersihan indoor bangunan',
    frequency: '1x_sebulan',
    description: 'Saluran air 2 x sebulan - Pembersihan saluran air dan drainase indoor'
  },
  {
    id: 'k3-m-gordyn-blind',
    name: 'Gordyn dan vertical blind',
    frequency: '1x_sebulan',
    description: '1 x sebulan - Pembersihan dan penyedotan debu gordyn & vertical blind'
  },
  {
    id: 'k3-m-pest-control',
    name: 'Pekerjaan pest and rodent control',
    frequency: '1x_sebulan',
    description: 'Lingkungan di dalam dan luar gedung 1 x sebulan'
  },
  {
    id: 'k3-m-hygiene-service',
    name: 'Pekerjaan hygiene service',
    frequency: '1x_sebulan',
    description: 'Pengharum ruangan 1 x sebulan - Pengecekan & isi ulang pengharum ruangan'
  },
  {
    id: 'k3-m-hygiene-unit',
    name: 'Hygiene unit',
    frequency: '1x_sebulan',
    description: '1 x sebulan - Perawatan, sanitasi & pergantian refill unit hygiene'
  },
];

// DAFTAR ITEM PEKERJAAN KHUSUS KELAS 5 (PERSIS SESUAI SPESIFIKASI USER)
export const KELAS_5_HK_ITEMS: HKItemDefinition[] = [
  // 1. Kegiatan Mingguan
  {
    id: 'k5-w-lantai',
    name: 'Lantai',
    frequency: '1x_seminggu',
    description: '1 x seminggu - Pembersihan & pengepelan lantai area gudang'
  },
  {
    id: 'k5-w-sampah-ruangan',
    name: 'Sampah Ruangan',
    frequency: '1x_seminggu',
    description: '1 x seminggu - Pengosongan dan pembersihan tempat sampah ruangan gudang'
  },
  {
    id: 'k5-w-sampah-tps',
    name: 'Sampah TPS',
    frequency: '1x_seminggu',
    description: '1 x seminggu - Pengangkutan dan pembuangan sampah ke TPS gudang'
  },

  // 2. Kegiatan Bulanan
  {
    id: 'k5-m-dinding',
    name: 'Dinding',
    frequency: '1x_sebulan',
    description: '1 x sebulan - Pembersihan debu, sarang laba-laba & noda dinding'
  },
  {
    id: 'k5-m-plafon',
    name: 'Plafon',
    frequency: '1x_sebulan',
    description: '1 x 3 bulan - Pembersihan plafon dan sudut-sudut atap gedung'
  },
  {
    id: 'k5-m-saluran-air',
    name: 'Saluran air',
    frequency: '1x_sebulan',
    description: '1 x sebulan - Pembersihan saluran air dan drainase luar/dalam'
  },
];

// Helper: Cek apakah gedung merupakan Kelas 5
export function isKelas5Building(building?: Building | { id?: string; buildingClass?: string; name?: string } | null): boolean {
  if (!building) return false;
  if (building.buildingClass === 'Kelas 5') return true;
  if (building.id && ['bld-gud-03', 'bld-mlw-04', 'bld-rfb-07'].includes(building.id)) return true;
  const name = (building.name || '').toUpperCase();
  if (name.includes('GUDANG KALIBRASI') || name.includes('GUDANG MELAWAI') || name.includes('GDG REFURBISH')) return true;
  return false;
}

// Helper: Cek apakah gedung merupakan Kelas 2 (KANTOR WITEL SURABAYA SLTN, STO INJOKO)
export function isKelas2Building(building?: Building | { id?: string; buildingClass?: string; name?: string } | null): boolean {
  if (!building) return false;
  if (isKelas5Building(building)) return false;
  if (building.buildingClass === 'Kelas 2') return true;
  if (building.id && ['bld-lea-01', 'bld-sto-06'].includes(building.id)) return true;
  const name = (building.name || '').toUpperCase();
  if (name.includes('WITEL SURABAYA SLTN') || (name.includes('STO INJOKO') && !name.includes('REFURBISH') && !name.includes('KALIBRASI'))) return true;
  return false;
}

// Helper: Cek apakah gedung merupakan Kelas 3 (MSC KALIBRASI, MSC MELAWAI, STO KAPUAS, DARMO, DINOYO, RUNGKUT, WARU, DLL)
export function isKelas3Building(building?: Building | { id?: string; buildingClass?: string; name?: string } | null): boolean {
  if (!building) return false;
  if (isKelas5Building(building)) return false;
  if (isKelas2Building(building)) return false;
  if (building.buildingClass === 'Kelas 3') return true;
  return true; // Default standard buildings in Witel Surabaya Selatan matrix belong to Kelas 3
}

// Helper: Ambil kategori frekuensi sesuai kelas gedung
export function getCategoriesForBuilding(building?: Building | null) {
  if (isKelas5Building(building)) {
    return KELAS_5_CATEGORIES;
  }
  if (isKelas2Building(building)) {
    return KELAS_2_CATEGORIES;
  }
  if (isKelas3Building(building)) {
    return KELAS_3_CATEGORIES;
  }
  return FREQUENCY_CATEGORIES;
}

// Helper: Ambil item pekerjaan sesuai kelas gedung
export function getItemsForBuilding(building?: Building | null, customItems: HKItemDefinition[] = []): HKItemDefinition[] {
  if (isKelas5Building(building)) {
    const customForK5 = customItems.filter(
      (ci) => !DEFAULT_HK_ITEMS.some((di) => di.id === ci.id) &&
              !KELAS_5_HK_ITEMS.some((ki) => ki.id === ci.id) &&
              !KELAS_2_HK_ITEMS.some((k2) => k2.id === ci.id) &&
              !KELAS_3_HK_ITEMS.some((k3) => k3.id === ci.id)
    );
    return [...KELAS_5_HK_ITEMS, ...customForK5];
  }

  if (isKelas2Building(building)) {
    const customForK2 = customItems.filter(
      (ci) => !DEFAULT_HK_ITEMS.some((di) => di.id === ci.id) &&
              !KELAS_5_HK_ITEMS.some((ki) => ki.id === ci.id) &&
              !KELAS_2_HK_ITEMS.some((k2) => k2.id === ci.id) &&
              !KELAS_3_HK_ITEMS.some((k3) => k3.id === ci.id)
    );
    return [...KELAS_2_HK_ITEMS, ...customForK2];
  }

  if (isKelas3Building(building)) {
    const customForK3 = customItems.filter(
      (ci) => !DEFAULT_HK_ITEMS.some((di) => di.id === ci.id) &&
              !KELAS_5_HK_ITEMS.some((ki) => ki.id === ci.id) &&
              !KELAS_2_HK_ITEMS.some((k2) => k2.id === ci.id) &&
              !KELAS_3_HK_ITEMS.some((k3) => k3.id === ci.id)
    );
    return [...KELAS_3_HK_ITEMS, ...customForK3];
  }

  const customForStandard = customItems.filter(
    (ci) => !KELAS_5_HK_ITEMS.some((ki) => ki.id === ci.id) &&
            !KELAS_2_HK_ITEMS.some((k2) => k2.id === ci.id) &&
            !KELAS_3_HK_ITEMS.some((k3) => k3.id === ci.id)
  );
  return customForStandard.length > 0 ? customForStandard : DEFAULT_HK_ITEMS;
}

export interface ItemPhotoQuota {
  perPeriodText: string;
  monthlyPhotos: number;
  explanation: string;
  periodLabel: string;
}

export function getItemMonthlyPhotoQuota(item: HKItemDefinition, building?: Building | null): ItemPhotoQuota {
  const isK5 = isKelas5Building(building);
  const isK2 = isKelas2Building(building);
  const isK3 = isKelas3Building(building);

  // 1. HARIAN: 1 foto setiap hari per pekerjaan = 20 foto per bulan
  if (item.frequency === 'harian') {
    return {
      perPeriodText: '1 foto / hari',
      monthlyPhotos: 20,
      periodLabel: 'Harian (1x/hari)',
      explanation: 'Wajib 1 foto setiap hari per pekerjaan (Target 20 foto/bulan).',
    };
  }

  // 2. MINGGUAN:
  // - Kelas 5: 1x seminggu = 1 foto setiap minggu = 4 foto/bulan per pekerjaan
  // - Kelas 2 & 3: 2x seminggu = 2 foto setiap minggu = 8 foto/bulan per pekerjaan
  if (item.frequency === '1x_seminggu' || item.frequency === '2x_seminggu') {
    if (isK5) {
      return {
        perPeriodText: '1 foto / minggu',
        monthlyPhotos: 4,
        periodLabel: 'Mingguan (1x/minggu)',
        explanation: '1x seminggu: 1 foto setiap minggu (Target 4 foto/bulan per pekerjaan).',
      };
    }
    return {
      perPeriodText: '2 foto / minggu',
      monthlyPhotos: 8,
      periodLabel: 'Mingguan (2x/minggu)',
      explanation: '2x seminggu: 2 foto setiap minggu (Target 8 foto/bulan per pekerjaan).',
    };
  }

  // 3. BULANAN:
  const desc = (item.description || '').toLowerCase();
  const name = (item.name || '').toLowerCase();

  if (desc.includes('4 x sebulan') || desc.includes('4x sebulan')) {
    return {
      perPeriodText: '4 foto / bulan',
      monthlyPhotos: 4,
      periodLabel: 'Bulanan (4x/bulan)',
      explanation: '4 x sebulan = Target 4 foto per bulan.',
    };
  }

  if (desc.includes('2 x sebulan') || desc.includes('2x sebulan')) {
    return {
      perPeriodText: '2 foto / bulan',
      monthlyPhotos: 2,
      periodLabel: 'Bulanan (2x/bulan)',
      explanation: '2 x sebulan = Target 2 foto per bulan.',
    };
  }

  if (desc.includes('triwulan') || desc.includes('3 bulan') || name.includes('triwulan')) {
    return {
      perPeriodText: '1 foto / bulan (Triwulan)',
      monthlyPhotos: 1,
      periodLabel: 'Triwulan (1x/3 bln)',
      explanation: '1 x setiap triwulan / 3 bulan = Target 1 foto setiap bulan.',
    };
  }

  return {
    perPeriodText: '1 foto / bulan',
    monthlyPhotos: 1,
    periodLabel: 'Bulanan (1x/bulan)',
    explanation: '1 x sebulan = Target 1 foto per bulan.',
  };
}

export interface CategoryPhotoQuotaInfo {
  totalTargetPhotos: number;
  totalItems: number;
  ruleExplanation: string;
  perItemRule: string;
}

export function getCategoryMonthlyPhotoQuotaInfo(
  frequency: FrequencyType,
  building?: Building | null,
  customItems: HKItemDefinition[] = []
): CategoryPhotoQuotaInfo {
  const items = getItemsForBuilding(building, customItems).filter((it) => it.frequency === frequency);
  const totalItems = items.length;
  let totalTargetPhotos = 0;

  items.forEach((it) => {
    const q = getItemMonthlyPhotoQuota(it, building);
    totalTargetPhotos += q.monthlyPhotos;
  });

  const isK5 = isKelas5Building(building);
  const isK2 = isKelas2Building(building);
  const isK3 = isKelas3Building(building);

  let ruleExplanation = '';
  let perItemRule = '';

  if (frequency === 'harian') {
    if (isK2) {
      perItemRule = '5 foto/hari (1 foto/pekerjaan)';
      ruleExplanation = '5 kegiatan harian • Kirim 5 foto setiap hari (1 per pekerjaan) • Total target 100 foto/bulan (20 foto/pekerjaan)';
    } else if (isK3) {
      perItemRule = '4 foto/hari (1 foto/pekerjaan)';
      ruleExplanation = '4 kegiatan harian • Kirim 4 foto setiap hari (1 per pekerjaan) • Total target 80 foto/bulan (20 foto/pekerjaan)';
    } else {
      perItemRule = '1 foto/hari per pekerjaan';
      ruleExplanation = `${totalItems} kegiatan harian • Wajib kirim 1 foto setiap hari per pekerjaan • Target ${totalTargetPhotos} foto/bulan (20 foto/pekerjaan)`;
    }
  } else if (frequency === '1x_seminggu' || frequency === '2x_seminggu') {
    if (isK5) {
      perItemRule = '1 foto/minggu per pekerjaan';
      ruleExplanation = '3 kegiatan 1x seminggu • 1 foto setiap minggu • Target 4 foto/bulan per pekerjaan (Total 12 foto/bulan)';
    } else if (isK2) {
      perItemRule = '2 foto/minggu (2x seminggu)';
      ruleExplanation = '1 kegiatan 2x seminggu (Sampah TPS) • 2 foto setiap minggu • Total target 8 foto/bulan';
    } else if (isK3) {
      perItemRule = '2 foto/minggu per pekerjaan (2x seminggu)';
      ruleExplanation = '2 kegiatan 2x seminggu • 2 foto setiap minggu • Target 8 foto/bulan per pekerjaan (Total 16 foto/bulan)';
    } else {
      perItemRule = '2 foto/minggu per pekerjaan';
      ruleExplanation = `${totalItems} kegiatan mingguan • Target ${totalTargetPhotos} foto/bulan`;
    }
  } else {
    // Bulanan
    if (isK5) {
      ruleExplanation = '3 kegiatan bulanan (Dinding 1x/bln, Plafon triwulan, Saluran air 1x/bln) • Total target 3 foto/bulan';
    } else if (isK2) {
      ruleExplanation = '9 kegiatan bulanan (1x, 2x, 4x sebulan & triwulan) • Total target 19 foto/bulan';
    } else if (isK3) {
      ruleExplanation = '9 kegiatan bulanan (1x, 2x sebulan & triwulan) • Total target 10 foto/bulan';
    } else {
      ruleExplanation = `${totalItems} kegiatan bulanan • Total target ${totalTargetPhotos} foto/bulan`;
    }
    perItemRule = 'Sesuai jadwal bulanan (1x, 2x, 4x, triwulan)';
  }

  return {
    totalTargetPhotos,
    totalItems,
    ruleExplanation,
    perItemRule,
  };
}

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
    itemId: 'k2-h-sampah-ruangan',
    itemName: 'Sampah ruangan',
    conditionGood: true,
    photoUrl: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=600&auto=format&fit=crop&q=80',
    photoFileName: 'sampah_ruangan_lea.jpg',
    notes: 'Tempat sampah sudah dikosongkan dan plastik sampah diganti baru.',
    officerName: 'Rudik Setiyawan',
    timestamp: '2026-08-20T08:30:00.000Z',
    dateOnly: '2026-08-20',
  },
  {
    id: 'sub-2',
    buildingId: 'bld-lea-01',
    buildingName: 'KANTOR WITEL SURABAYA SLTN LEA',
    frequency: 'harian',
    frequencyLabel: 'Kegiatan Harian',
    itemId: 'k2-h-meubelair',
    itemName: 'Pembersihan meubelair',
    conditionGood: true,
    photoUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&auto=format&fit=crop&q=80',
    photoFileName: 'meubelair_clean.jpg',
    notes: 'Meja dan kursi kerja sudah dilap dan disemprot disinfektan.',
    officerName: 'Rudik Setiyawan',
    timestamp: '2026-08-20T09:15:00.000Z',
    dateOnly: '2026-08-20',
  },
  {
    id: 'sub-3',
    buildingId: 'bld-lea-01',
    buildingName: 'KANTOR WITEL SURABAYA SLTN LEA',
    frequency: '1x_seminggu',
    frequencyLabel: 'Mingguan (1x Seminggu)',
    itemId: 'k2-w-sampah-tps',
    itemName: 'Sampah TPS',
    conditionGood: true,
    photoUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80',
    photoFileName: 'sampah_tps_lea.jpg',
    notes: 'Pengangkutan sampah ke TPS luar gedung selesai dikerjakan.',
    officerName: 'Rudik Setiyawan',
    timestamp: '2026-08-20T10:00:00.000Z',
    dateOnly: '2026-08-20',
  },
  {
    id: 'sub-4',
    buildingId: 'bld-msc-02',
    buildingName: 'MSC SURABAYA KALIBRASI INJOKO',
    frequency: 'harian',
    frequencyLabel: 'Kegiatan Harian',
    itemId: 'k3-h-sampah-ruangan',
    itemName: 'Sampah ruangan',
    conditionGood: true,
    photoUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&auto=format&fit=crop&q=80',
    photoFileName: 'sampah_kalibrasi.jpg',
    notes: 'Sampah ruangan kantor MSC sudah dibuang ke tempat pembuangan.',
    officerName: 'Rudik Setiyawan',
    timestamp: '2026-08-20T08:45:00.000Z',
    dateOnly: '2026-08-20',
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
