import { Building, FrequencyType, HKItemDefinition, HKSubmission } from '../types';
import {
  getItemsForBuilding,
  getCategoriesForBuilding,
  isKelas5Building,
  isKelas2Building,
  isKelas3Building,
} from '../data/defaultData';

export interface BuildingCategoryStats {
  id: FrequencyType;
  label: string;
  totalItems: number;
  completedCount: number;
  percentage: number;
  isCompleted: boolean;
}

export interface BuildingDateDetailedStats {
  buildingId: string;
  dateStr: string;
  dayNum: number;
  isHoliday: boolean;
  holidayName?: string;

  // 1. Acuan Utama: Persentase Harian
  harianPercentage: number;
  harianCompletedCount: number;
  harianTotalItems: number;
  hasHarian: boolean;

  // 2. Persentase Gabungan (Rata-rata / Total Komposit Harian, Mingguan, Bulanan)
  compositePercentage: number;

  // Breakdown per kategori (Harian, Mingguan, Bulanan)
  categoryStats: Record<FrequencyType, BuildingCategoryStats>;
  activeCategories: BuildingCategoryStats[];

  // Item status mapping per itemId
  itemsMap: Record<
    string,
    {
      item: HKItemDefinition;
      isCompleted: boolean;
      photoUrl?: string;
      submission?: HKSubmission;
    }
  >;

  totalItems: number;
  totalCompletedCount: number;
  statusLabel: string;
}

/**
 * Calculates comprehensive date-specific progress for a building,
 * returning both the primary Persentase Harian and the composite Persentase Gabungan (Harian + Mingguan + Bulanan),
 * plus category-level and item-level completion stats.
 */
export function getBuildingStatsForDate(
  building: Building,
  allItems: HKItemDefinition[],
  submissions: HKSubmission[],
  dateStr: string // YYYY-MM-DD
): BuildingDateDetailedStats {
  const buildingItems = getItemsForBuilding(building, allItems);
  const buildingCategories = getCategoriesForBuilding(building);
  const isK5 = isKelas5Building(building);

  const dateParts = dateStr.split('-');
  const year = parseInt(dateParts[0], 10) || 2026;
  const month = parseInt(dateParts[1], 10) - 1 || 7; // 0-indexed (7 = August)
  const dayNum = parseInt(dateParts[2], 10) || 20;

  const d = new Date(year, month, dayNum);
  const dayOfWeek = d.getDay();
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
  const isHoliday = isWeekend || (month === 7 && (dayNum === 17 || dayNum === 25));
  let holidayName: string | undefined;

  if (isWeekend) {
    holidayName = dayOfWeek === 0 ? 'Hari Minggu' : 'Hari Sabtu';
  } else if (month === 7 && dayNum === 17) {
    holidayName = 'Hari Kemerdekaan RI';
  } else if (month === 7 && dayNum === 25) {
    holidayName = 'Cuti Bersama';
  }

  // 1. Real user submissions on this exact date (or matching dateOnly)
  const realSubsOnDate = submissions.filter(
    (s) =>
      s.buildingId === building.id &&
      (s.dateOnly === dateStr || (s.timestamp && s.timestamp.startsWith(dateStr)))
  );

  // Group items by category
  const itemsByCategory: Record<FrequencyType, HKItemDefinition[]> = {
    harian: buildingItems.filter((i) => i.frequency === 'harian'),
    '1x_seminggu': buildingItems.filter((i) => i.frequency === '1x_seminggu'),
    '2x_seminggu': buildingItems.filter((i) => i.frequency === '2x_seminggu'),
    '1x_sebulan': buildingItems.filter((i) => i.frequency === '1x_sebulan'),
  };

  const categoryStats: Record<FrequencyType, BuildingCategoryStats> = {
    harian: {
      id: 'harian',
      label: 'Kegiatan Harian',
      totalItems: itemsByCategory.harian.length,
      completedCount: 0,
      percentage: 0,
      isCompleted: false,
    },
    '1x_seminggu': {
      id: '1x_seminggu',
      label: isK5 ? 'Kegiatan Mingguan' : 'Mingguan (1x Seminggu)',
      totalItems: itemsByCategory['1x_seminggu'].length,
      completedCount: 0,
      percentage: 0,
      isCompleted: false,
    },
    '2x_seminggu': {
      id: '2x_seminggu',
      label: '2 Mingguan (2x Seminggu)',
      totalItems: itemsByCategory['2x_seminggu'].length,
      completedCount: 0,
      percentage: 0,
      isCompleted: false,
    },
    '1x_sebulan': {
      id: '1x_sebulan',
      label: isK5 ? 'Kegiatan Bulanan' : 'Kegiatan Bulanan',
      totalItems: itemsByCategory['1x_sebulan'].length,
      completedCount: 0,
      percentage: 0,
      isCompleted: false,
    },
  };

  const itemsMap: Record<
    string,
    {
      item: HKItemDefinition;
      isCompleted: boolean;
      photoUrl?: string;
      submission?: HKSubmission;
    }
  > = {};

  // Find matching submission for each item on this date
  buildingItems.forEach((item) => {
    // Check if there is a real submission for this building and item on the selected date (or fallback if date matches or dateOnly is present)
    const sub = submissions.find(
      (s) =>
        s.buildingId === building.id &&
        (s.itemId === item.id ||
          (s.itemId && item.id && (s.itemId.endsWith(item.id) || item.id.endsWith(s.itemId)))) &&
        Boolean(s.photoUrl) &&
        (s.dateOnly === dateStr ||
          (s.timestamp && s.timestamp.startsWith(dateStr)) ||
          (!s.dateOnly && !s.timestamp))
    );

    const isCompleted = Boolean(sub && sub.photoUrl);
    itemsMap[item.id] = {
      item,
      isCompleted,
      photoUrl: sub?.photoUrl,
      submission: sub,
    };

    if (isCompleted && categoryStats[item.frequency]) {
      categoryStats[item.frequency].completedCount++;
    }
  });

  // Calculate percentages for each active category in this building
  buildingCategories.forEach((cat) => {
    const stat = categoryStats[cat.id];
    stat.percentage =
      stat.totalItems > 0 ? Math.min(100, Math.round((stat.completedCount / stat.totalItems) * 100)) : 0;
    stat.isCompleted = stat.percentage === 100 && stat.totalItems > 0;
  });

  // Calculate Persentase Harian (Acuan Utama)
  const hasHarian = itemsByCategory.harian.length > 0;
  const harianPercentage = hasHarian
    ? categoryStats.harian.percentage
    : categoryStats['1x_seminggu']?.percentage || 0;
  const harianCompletedCount = itemsByCategory.harian.length > 0
    ? categoryStats.harian.completedCount
    : categoryStats['1x_seminggu']?.completedCount || 0;
  const harianTotalItems = itemsByCategory.harian.length > 0
    ? categoryStats.harian.totalItems
    : categoryStats['1x_seminggu']?.totalItems || 0;

  // Calculate Persentase Gabungan (Rata-rata persentase dari kategori yang ada di gedung ini: Harian, Mingguan, Bulanan)
  const activeCats = buildingCategories.map((c) => categoryStats[c.id]);
  const activePercentages = activeCats.map((c) => c.percentage);
  const compositePercentage =
    activePercentages.length > 0
      ? Math.round(activePercentages.reduce((a, b) => a + b, 0) / activePercentages.length)
      : 0;

  const totalCompletedCount = activeCats.reduce((acc, c) => acc + c.completedCount, 0);
  const totalItems = buildingItems.length;

  const isAllDone = compositePercentage === 100 && totalItems > 0;
  const statusLabel = isHoliday && totalCompletedCount === 0
    ? 'Hari Libur'
    : isAllDone
    ? 'Selesai 100%'
    : compositePercentage > 0
    ? `${compositePercentage}% Selesai`
    : 'Belum Mulai';

  return {
    buildingId: building.id,
    dateStr,
    dayNum,
    isHoliday: isHoliday && totalCompletedCount === 0,
    holidayName,
    harianPercentage,
    harianCompletedCount,
    harianTotalItems,
    hasHarian,
    compositePercentage,
    categoryStats,
    activeCategories: activeCats,
    itemsMap,
    totalItems,
    totalCompletedCount,
    statusLabel,
  };
}
