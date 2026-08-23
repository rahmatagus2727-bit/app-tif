import * as XLSX from 'xlsx';
import { HKSubmission, Building, HKItemDefinition, FrequencyType } from '../types';
import { DEFAULT_HK_ITEMS, FREQUENCY_CATEGORIES } from '../data/defaultData';

export interface FrequencyStats {
  frequency: FrequencyType;
  label: string;
  totalItems: number;
  completedItems: number;
  pendingItems: number;
  percentage: number;
  hasMissingPhoto: boolean;
}

export function calculateBuildingFrequencyStats(
  buildingId: string,
  submissions: HKSubmission[],
  items: HKItemDefinition[] = DEFAULT_HK_ITEMS
): Record<FrequencyType, FrequencyStats> {
  const result: Record<FrequencyType, FrequencyStats> = {
    harian: { frequency: 'harian', label: 'Kegiatan Harian', totalItems: 0, completedItems: 0, pendingItems: 0, percentage: 0, hasMissingPhoto: false },
    '1x_seminggu': { frequency: '1x_seminggu', label: 'Kegiatan 1x seminggu', totalItems: 0, completedItems: 0, pendingItems: 0, percentage: 0, hasMissingPhoto: false },
    '2x_seminggu': { frequency: '2x_seminggu', label: 'Kegiatan 2x seminggu', totalItems: 0, completedItems: 0, pendingItems: 0, percentage: 0, hasMissingPhoto: false },
    '1x_sebulan': { frequency: '1x_sebulan', label: 'Kegiatan 1x Sebulan', totalItems: 0, completedItems: 0, pendingItems: 0, percentage: 0, hasMissingPhoto: false },
  };

  FREQUENCY_CATEGORIES.forEach((cat) => {
    const catItems = items.filter((i) => i.frequency === cat.id);
    const total = catItems.length;
    
    // Find how many items have valid submissions for this building
    const completedCount = catItems.filter((item) => {
      return submissions.some(
        (sub) => sub.buildingId === buildingId && sub.itemId === item.id && sub.photoUrl && sub.photoUrl.length > 0
      );
    }).length;

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
    };
  });

  return result;
}

export function exportBuildingToChecklistExcel(
  building: Building,
  submissions: HKSubmission[],
  items: HKItemDefinition[] = DEFAULT_HK_ITEMS
) {
  const wb = XLSX.utils.book_new();

  // Sheet 1: DETAIL SUBMISSION & FOTO
  const buildingSubs = submissions.filter((s) => s.buildingId === building.id);
  const detailData = buildingSubs.map((sub, idx) => ({
    'No': idx + 1,
    'Gedung / Lokasi': sub.buildingName,
    'Kategori Kegiatan': sub.frequencyLabel,
    'Item Pekerjaan': sub.itemName,
    'Kondisi Baik/Bersih': sub.conditionGood ? 'YA (BAIK/BERSIH)' : 'TIDAK (PERLU PERBAIKAN)',
    'Status Foto': sub.photoUrl ? 'ADA FOTO TERCATAT' : 'BELUM ADA FOTO',
    'Tanggal & Waktu Input': new Date(sub.timestamp).toLocaleString('id-ID'),
    'Petugas HK': sub.officerName || 'Petugas HK TIF',
    'Catatan / Keterangan': sub.notes || '-',
  }));

  const wsDetails = XLSX.utils.json_to_sheet(detailData.length > 0 ? detailData : [
    { 'Pemberitahuan': 'Belum ada data checklist untuk gedung ini' }
  ]);
  XLSX.utils.book_append_sheet(wb, wsDetails, 'Log Checklist HK');

  // Sheet 2: MATRIKS REKAPITULASI (Format Spreadsheet Standar HK TIF)
  const matrixData: any[] = [];
  const stats = calculateBuildingFrequencyStats(building.id, submissions, items);

  items.forEach((item, index) => {
    const sub = buildingSubs.find((s) => s.itemId === item.id);
    const cat = FREQUENCY_CATEGORIES.find((c) => c.id === item.frequency);
    matrixData.push({
      'No': index + 1,
      'Gedung': building.name,
      'Frekuensi': cat?.label || item.frequency,
      'Pekerjaan / Item': item.name,
      'Deskripsi Pekerjaan': item.description || '',
      'Status Pengerjaan': sub ? 'SELESAI' : 'BELUM SELESAI',
      'Kondisi': sub ? (sub.conditionGood ? 'YA (Bersih)' : 'TIDAK (Kotor/Rusak)') : 'BELUM DICEK',
      'Foto Terlampir': sub?.photoUrl ? 'LENGKAP' : 'FOTO KURANG / BELUM ADA',
      'Waktu Pengecekan': sub ? new Date(sub.timestamp).toLocaleString('id-ID') : '-',
    });
  });

  const wsMatrix = XLSX.utils.json_to_sheet(matrixData);
  XLSX.utils.book_append_sheet(wb, wsMatrix, 'Rekap Realtime Gedung');

  // Sheet 3: RINGKASAN PERSENTASE
  const summaryData = [
    { 'Gedung': building.name, 'Kategori': 'Kegiatan Harian', 'Persentase Selesai': `${stats.harian.percentage}%`, 'Selesai': stats.harian.completedItems, 'Belum (Foto Kurang)': stats.harian.pendingItems, 'Total Item': stats.harian.totalItems },
    { 'Gedung': building.name, 'Kategori': 'Kegiatan 1x Seminggu', 'Persentase Selesai': `${stats['1x_seminggu'].percentage}%`, 'Selesai': stats['1x_seminggu'].completedItems, 'Belum (Foto Kurang)': stats['1x_seminggu'].pendingItems, 'Total Item': stats['1x_seminggu'].totalItems },
    { 'Gedung': building.name, 'Kategori': 'Kegiatan 2x Seminggu', 'Persentase Selesai': `${stats['2x_seminggu'].percentage}%`, 'Selesai': stats['2x_seminggu'].completedItems, 'Belum (Foto Kurang)': stats['2x_seminggu'].pendingItems, 'Total Item': stats['2x_seminggu'].totalItems },
    { 'Gedung': building.name, 'Kategori': 'Kegiatan 1x Sebulan', 'Persentase Selesai': `${stats['1x_sebulan'].percentage}%`, 'Selesai': stats['1x_sebulan'].completedItems, 'Belum (Foto Kurang)': stats['1x_sebulan'].pendingItems, 'Total Item': stats['1x_sebulan'].totalItems },
  ];
  const wsSummary = XLSX.utils.json_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(wb, wsSummary, 'Ringkasan Persentase');

  // Trigger file download
  const cleanBuildingName = building.name.replace(/\s+/g, '_');
  const dateStr = new Date().toISOString().split('T')[0];
  XLSX.writeFile(wb, `Laporan_HK_TIF_${cleanBuildingName}_${dateStr}.xlsx`);
}
