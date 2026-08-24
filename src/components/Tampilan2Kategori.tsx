import React, { useState } from 'react';
import { Building, FrequencyType, HKSubmission, HKItemDefinition } from '../types';
import { getCategoriesForBuilding, isKelas5Building, isKelas2Building, isKelas3Building, getCategoryMonthlyPhotoQuotaInfo } from '../data/defaultData';
import { getBuildingStatsForDate } from '../utils/dateProgressHelper';
import {
  ArrowLeft,
  ChevronRight,
  Search,
  CheckCircle2,
  AlertCircle,
  Building2,
  Layers,
  Sparkles,
  Check,
  Calendar
} from 'lucide-react';

interface Tampilan2KategoriProps {
  building: Building;
  onSelectFrequency: (freq: FrequencyType) => void;
  onBackToStep1: () => void;
  submissions: HKSubmission[];
  items: HKItemDefinition[];
  selectedDateStr?: string;
}

export const Tampilan2Kategori: React.FC<Tampilan2KategoriProps> = ({
  building,
  onSelectFrequency,
  onBackToStep1,
  submissions,
  items,
  selectedDateStr = '2026-08-20',
}) => {
  const [filterType, setFilterType] = useState<string>('all');
  const detailedStats = getBuildingStatsForDate(building, items, submissions, selectedDateStr);
  const buildingCategories = getCategoriesForBuilding(building);
  const isK5 = isKelas5Building(building);
  const isK2 = isKelas2Building(building);
  const isK3 = isKelas3Building(building);

  const selectedDayNum = parseInt(selectedDateStr.split('-')[2], 10) || 20;

  const filteredCategories = buildingCategories.filter((cat) => {
    if (filterType === 'all') return true;
    return cat.id === filterType;
  });

  return (
    <div className="space-y-4 animate-in fade-in duration-300 pb-12" id="tampilan-2-root">
      {/* 1. TOP RED BAR */}
      <div className="bg-gradient-to-r from-rose-600 to-rose-700 -mx-4 sm:-mx-6 lg:-mx-8 -mt-6 p-4 sm:p-5 text-white shadow-md flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToStep1}
            className="p-1.5 rounded-full hover:bg-white/20 transition text-white cursor-pointer"
            title="Kembali ke Daftar Gedung (Tampilan 1)"
            id="back-to-step1-btn"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg sm:text-xl font-black text-white tracking-tight uppercase">
              Checklist
            </h1>
            <div className="text-[11px] text-rose-100 flex items-center gap-1 font-medium">
              <Building2 className="w-3 h-3" />
              <span>Lokasi: <strong>{building.name}</strong> ({building.code})</span>
              {building.buildingClass && (
                <span className="ml-1 px-1.5 py-0.2 bg-white/20 rounded text-[10px] font-bold">
                  {building.buildingClass}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Step Badge */}
        <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/20 text-white text-[11px] font-mono font-bold tracking-wider uppercase backdrop-blur-sm">
          <span>Tampilan 2</span>
        </div>
      </div>

      {/* Date & Dual Percentage Summary Banner */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-mono font-bold flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-rose-600" />
              <span>Tgl {selectedDayNum} Agustus 2026</span>
            </span>
            {detailedStats.isHoliday && (
              <span className="px-2.5 py-1 rounded-full bg-rose-100 border border-rose-200 text-rose-800 text-xs font-bold">
                Hari Libur ({detailedStats.holidayName})
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Progres kegiatan kebersihan gedung <strong className="text-slate-800">{building.name}</strong> pada tanggal {selectedDayNum}.
          </p>
        </div>

        {/* Dual Percentage Display in Header */}
        <div className="flex items-center gap-3 bg-slate-50 border border-slate-200/80 rounded-2xl p-2.5 sm:px-4 shrink-0">
          {/* Persentase Harian */}
          <div className="text-center px-2">
            <div className="text-[10px] font-bold text-rose-600 uppercase tracking-tight">
              Progres Harian
            </div>
            <div className="text-lg sm:text-xl font-mono font-black text-rose-700">
              {detailedStats.isHoliday ? 'LIBUR' : `${detailedStats.harianPercentage}%`}
            </div>
          </div>

          <div className="h-8 w-px bg-slate-200" />

          {/* Persentase Gabungan */}
          <div className="text-center px-2">
            <div className="text-[10px] font-bold text-slate-600 uppercase tracking-tight">
              Gabungan (Total)
            </div>
            <div className={`text-lg sm:text-xl font-mono font-black ${
              detailedStats.compositePercentage === 100
                ? 'text-emerald-600'
                : detailedStats.isHoliday
                ? 'text-rose-600'
                : 'text-slate-900'
            }`}>
              {detailedStats.isHoliday ? 'LIBUR' : `${detailedStats.compositePercentage}%`}
            </div>
          </div>
        </div>
      </div>

      {/* Info banner khusus Kelas 5 */}
      {isK5 && (
        <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-4 text-xs text-amber-950 space-y-1.5 shadow-xs">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-amber-200/90 font-mono font-black text-[11px] text-amber-900">
              KELAS 5
            </span>
            <span className="font-bold text-slate-900">
              Ketentuan Kuota Foto Checklist Bulanan (2 Kategori)
            </span>
          </div>
          <div className="text-[11.5px] text-slate-700 leading-relaxed pl-1 space-y-0.5">
            <p>• <strong>Kegiatan Mingguan (3 Item):</strong> 1x seminggu = 1 foto/minggu per item. <strong>Total 4 foto/bulan per item (Total 12 Foto/Bulan)</strong>.</p>
            <p>• <strong>Kegiatan Bulanan (3 Item):</strong> Dinding (1x/bln), Plafon (1x 3 bln / triwulan), Saluran air (1x/bln). <strong>Total 3 Foto/Bulan</strong>.</p>
          </div>
        </div>
      )}

      {/* Info banner khusus Kelas 2 */}
      {isK2 && (
        <div className="bg-blue-50 border border-blue-200/80 rounded-2xl p-4 text-xs text-blue-950 space-y-1.5 shadow-xs">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-blue-200/90 font-mono font-black text-[11px] text-blue-900">
              KELAS 2
            </span>
            <span className="font-bold text-slate-900">
              Ketentuan Kuota Foto Checklist Bulanan (3 Kategori)
            </span>
          </div>
          <div className="text-[11.5px] text-slate-700 leading-relaxed pl-1 space-y-0.5">
            <p>• <strong>Kegiatan Harian (5 Item):</strong> Kirim 5 foto setiap hari (1 foto/hari per pekerjaan). <strong>Target 20 foto/bulan per item (Total 100 Foto/Bulan)</strong>.</p>
            <p>• <strong>Kegiatan Mingguan (1 Item):</strong> Sampah TPS (2x seminggu) = 2 foto setiap minggu. <strong>Total 8 Foto/Bulan</strong>.</p>
            <p>• <strong>Kegiatan Bulanan (9 Item):</strong> 1x, 2x, 4x sebulan &amp; triwulan (1 foto/bln). <strong>Total 19 Foto/Bulan</strong>.</p>
          </div>
        </div>
      )}

      {/* Info banner khusus Kelas 3 */}
      {isK3 && (
        <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-4 text-xs text-emerald-950 space-y-1.5 shadow-xs">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-emerald-200/90 font-mono font-black text-[11px] text-emerald-900">
              KELAS 3
            </span>
            <span className="font-bold text-slate-900">
              Ketentuan Kuota Foto Checklist Bulanan (3 Kategori)
            </span>
          </div>
          <div className="text-[11.5px] text-slate-700 leading-relaxed pl-1 space-y-0.5">
            <p>• <strong>Kegiatan Harian (4 Item):</strong> Kirim 4 foto setiap hari (1 foto/hari per pekerjaan). <strong>Target 20 foto/bulan per item (Total 80 Foto/Bulan)</strong>.</p>
            <p>• <strong>Kegiatan Mingguan (2 Item):</strong> Perawatan Lantai &amp; Sampah TPS (2x seminggu) = 2 foto/minggu per item. <strong>Total 8 foto/bulan per item (Total 16 Foto/Bulan)</strong>.</p>
            <p>• <strong>Kegiatan Bulanan (9 Item):</strong> 1x, 2x sebulan &amp; triwulan (1 foto/bln). <strong>Total 10 Foto/Bulan</strong>.</p>
          </div>
        </div>
      )}

      {/* 2. FILTER PILLS */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
        <button
          onClick={() => setFilterType('all')}
          className={`px-4 py-1.5 rounded-full text-xs font-bold transition whitespace-nowrap cursor-pointer ${
            filterType === 'all'
              ? 'bg-rose-600 text-white shadow-sm'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Semua ({buildingCategories.length})
        </button>

        {buildingCategories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setFilterType(cat.id)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              filterType === cat.id
                ? 'bg-rose-600 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {cat.shortCode}
          </button>
        ))}
      </div>

      {/* 3. CATEGORY CARDS */}
      <div className="space-y-4" id="frequency-cards-container">
        {filteredCategories.map((cat) => {
          const catStat = detailedStats.categoryStats[cat.id] || {
            id: cat.id,
            label: cat.label,
            totalItems: 0,
            completedCount: 0,
            percentage: 0,
            isCompleted: false,
          };

          const quotaInfo = getCategoryMonthlyPhotoQuotaInfo(cat.id, building, items);
          const isFinished = catStat.percentage === 100 && catStat.totalItems > 0;
          const statusBadgeText = isFinished ? 'Selesai 100%' : catStat.percentage > 0 ? `${catStat.percentage}% Selesai` : 'Belum Mulai';
          const pendingCount = Math.max(0, catStat.totalItems - catStat.completedCount);

          return (
            <div
              key={cat.id}
              onClick={() => onSelectFrequency(cat.id)}
              className="bg-white border border-slate-200/90 hover:border-rose-400 rounded-3xl p-5 sm:p-6 shadow-sm hover:shadow-md transition cursor-pointer space-y-4 group relative overflow-hidden"
              id={`category-card-${cat.id}`}
            >
              {/* Card Header: Category Name & Status Badge */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-rose-600 transition">
                      {cat.label}
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-slate-900 text-white shadow-xs">
                      Target: {quotaInfo.totalTargetPhotos} Foto/Bulan
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium mt-1">
                    {cat.subLabel}
                  </p>
                </div>

                {/* Status Badge */}
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shrink-0 ${
                    isFinished
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      : catStat.percentage > 0
                      ? 'bg-amber-100 text-amber-800 border border-amber-200'
                      : 'bg-slate-100 text-slate-600 border border-slate-200'
                  }`}
                >
                  {isFinished && <Check className="w-3 h-3 stroke-[3]" />}
                  <span>{statusBadgeText}</span>
                </span>
              </div>

              {/* Photo Requirement Callout Tag */}
              <div className="bg-slate-50/90 border border-slate-200/80 rounded-xl px-3 py-2 text-[11.5px] text-slate-700 flex items-center justify-between gap-2">
                <span className="font-semibold text-rose-700">
                  📸 Aturan Foto:
                </span>
                <span className="font-medium text-slate-600 text-right">
                  {quotaInfo.ruleExplanation || cat.subLabel}
                </span>
              </div>

              {/* Progress & Percentage Display */}
              <div className="space-y-1.5">
                <div className="flex items-baseline justify-between">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-black text-slate-900 font-sans tracking-tight">
                      {catStat.percentage}%
                    </span>
                    <span className="text-xs font-semibold text-slate-400">
                      Tingkat penyelesaian Tgl {selectedDayNum}
                    </span>
                  </div>

                  <span className="text-xs font-bold text-slate-500 font-mono">
                    {catStat.completedCount}/{catStat.totalItems} Item Selesai
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isFinished
                        ? 'bg-emerald-500'
                        : 'bg-gradient-to-r from-amber-500 to-rose-500'
                    }`}
                    style={{ width: `${catStat.percentage}%` }}
                  />
                </div>
              </div>

              {/* 3-Column Stats Box */}
              <div className="grid grid-cols-3 bg-slate-50 border border-slate-200/80 rounded-2xl p-3 text-center divide-x divide-slate-200">
                {/* 1. Belum */}
                <div className="px-2">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Belum
                  </div>
                  <div className="text-lg sm:text-xl font-black text-rose-600 mt-0.5">
                    {pendingCount}
                  </div>
                </div>

                {/* 2. Butuh approval */}
                <div className="px-2">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Butuh approval
                  </div>
                  <div className="text-lg sm:text-xl font-black text-slate-700 mt-0.5">
                    0
                  </div>
                </div>

                {/* 3. Selesai */}
                <div className="px-2">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Selesai
                  </div>
                  <div className="text-lg sm:text-xl font-black text-emerald-600 mt-0.5">
                    {catStat.completedCount}
                  </div>
                </div>
              </div>

              {/* Click to Next Step */}
              <div className="flex items-center justify-between pt-1 text-xs text-rose-600 font-bold group-hover:translate-x-0.5 transition">
                <span>Klik untuk periksa item ({catStat.totalItems} Item Pekerjaan)</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
