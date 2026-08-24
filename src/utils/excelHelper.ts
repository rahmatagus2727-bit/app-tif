import * as XLSX from 'xlsx';
import { HKSubmission, Building, HKItemDefinition, FrequencyType } from '../types';
import {
  DEFAULT_HK_ITEMS,
  FREQUENCY_CATEGORIES,
  KELAS_5_CATEGORIES,
  KELAS_5_HK_ITEMS,
  KELAS_2_CATEGORIES,
  KELAS_2_HK_ITEMS,
  KELAS_3_CATEGORIES,
  KELAS_3_HK_ITEMS,
  isKelas5Building,
  isKelas2Building,
  isKelas3Building,
  getCategoriesForBuilding,
  getItemsForBuilding,
  getCategoryMonthlyPhotoQuotaInfo,
  getItemMonthlyPhotoQuota
} from '../data/defaultData';

export interface FrequencyStats {
  frequency: FrequencyType;
  label: string;
  totalItems: number;
  completedItems: number;
  pendingItems: number;
  percentage: number;
  hasMissingPhoto: boolean;
  totalTargetPhotos: number;
  collectedPhotos: number;
  ruleExplanation: string;
  perItemRule: string;
}

export function calculateBuildingFrequencyStats(
  buildingInput: string | Building,
  submissions: HKSubmission[],
  customItems: HKItemDefinition[] = DEFAULT_HK_ITEMS,
  buildingObj?: Building
): Record<FrequencyType, FrequencyStats> {
  const bId = typeof buildingInput === 'string' ? buildingInput : buildingInput.id;
  const targetBuilding = typeof buildingInput === 'object' ? buildingInput : (buildingObj || { id: bId });
  
  const categories = getCategoriesForBuilding(targetBuilding as Building);
  const buildingItems = getItemsForBuilding(targetBuilding as Building, customItems);
  const isK5 = isKelas5Building(targetBuilding);
  const isK2 = isKelas2Building(targetBuilding);
  const isK3 = isKelas3Building(targetBuilding);

  const result: Record<FrequencyType, FrequencyStats> = {
    harian: {
      frequency: 'harian',
      label: 'Kegiatan Harian',
      totalItems: 0,
      completedItems: 0,
      pendingItems: 0,
      percentage: 0,
      hasMissingPhoto: false,
      totalTargetPhotos: 0,
      collectedPhotos: 0,
      ruleExplanation: '',
      perItemRule: '',
    },
    '1x_seminggu': {
      frequency: '1x_seminggu',
      label: (isK5 || isK2 || isK3) ? 'Kegiatan Mingguan' : 'Mingguan (1x Seminggu)',
      totalItems: 0,
      completedItems: 0,
      pendingItems: 0,
      percentage: 0,
      hasMissingPhoto: false,
      totalTargetPhotos: 0,
      collectedPhotos: 0,
      ruleExplanation: '',
      perItemRule: '',
    },
    '2x_seminggu': {
      frequency: '2x_seminggu',
      label: '2 Mingguan (2x Seminggu)',
      totalItems: 0,
      completedItems: 0,
      pendingItems: 0,
      percentage: 0,
      hasMissingPhoto: false,
      totalTargetPhotos: 0,
      collectedPhotos: 0,
      ruleExplanation: '',
      perItemRule: '',
    },
    '1x_sebulan': {
      frequency: '1x_sebulan',
      label: (isK5 || isK2 || isK3) ? 'Kegiatan Bulanan' : 'Bulanan (1x Sebulan)',
      totalItems: 0,
      completedItems: 0,
      pendingItems: 0,
      percentage: 0,
      hasMissingPhoto: false,
      totalTargetPhotos: 0,
      collectedPhotos: 0,
      ruleExplanation: '',
      perItemRule: '',
    },
  };

  categories.forEach((cat) => {
    const catItems = buildingItems.filter((i) => i.frequency === cat.id);
    const total = catItems.length;
    const quotaInfo = getCategoryMonthlyPhotoQuotaInfo(cat.id, targetBuilding as Building, customItems);
    
    // Find how many items have valid submissions for this building
    const completedCount = catItems.filter((item) => {
      return submissions.some(
        (sub) => sub.buildingId === bId && sub.itemId === item.id && sub.photoUrl && sub.photoUrl.length > 0
      );
    }).length;

    // Count all photo submissions for this category and building
    const allCategorySubmissions = submissions.filter(
      (sub) => sub.buildingId === bId && catItems.some((ci) => ci.id === sub.itemId) && sub.photoUrl && sub.photoUrl.length > 0
    );

    const pendingCount = Math.max(0, total - completedCount);
    const pct = total > 0 ? Math.round((completedCount / total) * 100) : 0;

    result[cat.id] = {
      frequency: cat.id,
      label: cat.label,
      totalItems: total,
      completedItems: completedCount,
      pendingItems: pendingCount,
      percentage: pct,
      hasMissingPhoto: pendingCount > 0,
      totalTargetPhotos: quotaInfo.totalTargetPhotos,
      collectedPhotos: allCategorySubmissions.length,
      ruleExplanation: quotaInfo.ruleExplanation,
      perItemRule: quotaInfo.perItemRule,
    };
  });

  return result;
}

export function exportBuildingToChecklistExcel(
  building: Building,
  submissions: HKSubmission[],
  customItems: HKItemDefinition[] = DEFAULT_HK_ITEMS
) {
  const wb = XLSX.utils.book_new();
  const buildingItems = getItemsForBuilding(building, customItems);
  const buildingCategories = getCategoriesForBuilding(building);

  // Sheet 1: DETAIL SUBMISSION & FOTO
  const buildingSubs = submissions.filter((s) => s.buildingId === building.id);
  const detailData = buildingSubs.map((sub, idx) => ({
    'No': idx + 1,
    'Gedung / Lokasi': sub.buildingName,
    'Kategori Kegiatan': sub.frequencyLabel,
    'Item Pekerjaan': sub.itemName,
    'Kondisi': 'Selesai (Foto Terlampir)',
    'Status Foto': sub.photoUrl ? 'ADA FOTO TERCATAT' : 'BELUM ADA FOTO',
    'Tanggal & Waktu Input': new Date(sub.timestamp).toLocaleString('id-ID'),
    'Petugas HK': sub.officerName || 'Petugas HK TIF',
  }));

  const wsDetails = XLSX.utils.json_to_sheet(detailData.length > 0 ? detailData : [
    { 'Pemberitahuan': 'Belum ada data checklist untuk gedung ini' }
  ]);
  XLSX.utils.book_append_sheet(wb, wsDetails, 'Log Checklist HK');

  // Sheet 2: MATRIKS REKAPITULASI (Format Spreadsheet Standar HK TIF)
  const matrixData: any[] = [];
  const stats = calculateBuildingFrequencyStats(building, submissions, customItems);

  buildingItems.forEach((item, index) => {
    const sub = buildingSubs.find((s) => s.itemId === item.id);
    const cat = buildingCategories.find((c) => c.id === item.frequency) || FREQUENCY_CATEGORIES.find((c) => c.id === item.frequency);
    matrixData.push({
      'No': index + 1,
      'Gedung': building.name,
      'Kelas Gedung': building.buildingClass || '-',
      'Frekuensi': cat?.label || item.frequency,
      'Pekerjaan / Item': item.name,
      'Deskripsi / Jadwal': item.description || '',
      'Status Pengerjaan': sub ? 'SELESAI' : 'BELUM SELESAI',
      'Foto Terlampir': sub?.photoUrl ? 'LENGKAP' : 'FOTO KURANG / BELUM ADA',
      'Waktu Pengecekan': sub ? new Date(sub.timestamp).toLocaleString('id-ID') : '-',
    });
  });

  const wsMatrix = XLSX.utils.json_to_sheet(matrixData);
  XLSX.utils.book_append_sheet(wb, wsMatrix, 'Rekap Realtime Gedung');

  // Sheet 3: RINGKASAN PERSENTASE
  const summaryData = buildingCategories.map((cat) => {
    const s = stats[cat.id];
    return {
      'Gedung': building.name,
      'Kategori': cat.label,
      'Persentase Selesai': `${s.percentage}%`,
      'Selesai': s.completedItems,
      'Belum (Foto Kurang)': s.pendingItems,
      'Total Item': s.totalItems,
    };
  });

  const wsSummary = XLSX.utils.json_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(wb, wsSummary, 'Ringkasan Persentase');

  // Trigger file download
  const cleanBuildingName = building.name.replace(/\s+/g, '_');
  const dateStr = new Date().toISOString().split('T')[0];
  XLSX.writeFile(wb, `Laporan_HK_TIF_${cleanBuildingName}_${dateStr}.xlsx`);
}

