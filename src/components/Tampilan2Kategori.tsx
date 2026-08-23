import React, { useState } from 'react';
import { Building, FrequencyType, HKSubmission, HKItemDefinition } from '../types';
import { calculateBuildingFrequencyStats } from '../utils/excelHelper';
import { FREQUENCY_CATEGORIES } from '../data/defaultData';
import {
  ArrowLeft,
  ChevronRight,
  Search,
  CheckCircle2,
  AlertCircle,
  Building2,
  Layers,
  Sparkles,
  Check
} from 'lucide-react';

interface Tampilan2KategoriProps {
  building: Building;
  onSelectFrequency: (freq: FrequencyType) => void;
  onBackToStep1: () => void;
  submissions: HKSubmission[];
  items: HKItemDefinition[];
}

export const Tampilan2Kategori: React.FC<Tampilan2KategoriProps> = ({
  building,
  onSelectFrequency,
  onBackToStep1,
  submissions,
  items,
}) => {
  const [filterType, setFilterType] = useState<string>('all');
  const stats = calculateBuildingFrequencyStats(building.id, submissions, items);

  const filteredCategories = FREQUENCY_CATEGORIES.filter((cat) => {
    if (filterType === 'all') return true;
    return cat.id === filterType;
  });

  return (
    <div className="space-y-4 animate-in fade-in duration-300 pb-12" id="tampilan-2-root">
      {/* 1. TOP RED BAR (Exact Match to screen-0.jpg Header: "<- Checklist") */}
      <div className="bg-gradient-to-r from-rose-600 to-rose-700 -mx-4 sm:-mx-6 lg:-mx-8 -mt-6 p-4 sm:p-5 text-white shadow-md flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToStep1}
            className="p-1.5 rounded-full hover:bg-white/20 transition text-white"
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
            </div>
          </div>
        </div>

        {/* Step Badge */}
        <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/20 text-white text-[11px] font-mono font-bold tracking-wider uppercase backdrop-blur-sm">
          <span>Tampilan 2</span>
        </div>
      </div>

      {/* 2. FILTER PILLS (Matching screen-0.jpg) */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
        <button
          onClick={() => setFilterType('all')}
          className={`px-4 py-1.5 rounded-full text-xs font-bold transition whitespace-nowrap ${
            filterType === 'all'
              ? 'bg-rose-600 text-white shadow-sm'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Semua ({FREQUENCY_CATEGORIES.length})
        </button>

        {FREQUENCY_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setFilterType(cat.id)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition whitespace-nowrap ${
              filterType === cat.id
                ? 'bg-rose-600 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {cat.shortCode}
          </button>
        ))}
      </div>

      {/* 3. CATEGORY CARDS (Exact Match to screen-0.jpg layout):
          - Title e.g. "Mingguan"
          - Badge: "Selesai" (Green) / "Dalam proses" (Orange)
          - Left: Big "100%" or "39%" or "31%" with label "Tingkat penyelesaian"
          - Horizontal Progress bar
          - 3-column stats box: Belum | Butuh approval | Selesai
      */}
      <div className="space-y-4" id="frequency-cards-container">
        {filteredCategories.map((cat) => {
          const catStat = stats[cat.id];
          const isFinished = catStat.percentage === 100 && catStat.totalItems > 0;
          const statusBadgeText = isFinished ? 'Selesai' : 'Dalam proses';

          return (
            <div
              key={cat.id}
              onClick={() => onSelectFrequency(cat.id)}
              className="bg-white border border-slate-200/90 hover:border-rose-400 rounded-3xl p-5 sm:p-6 shadow-sm hover:shadow-md transition cursor-pointer space-y-4 group relative overflow-hidden"
              id={`category-card-${cat.id}`}
            >
              {/* Card Header: Category Name & Status Badge */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-rose-600 transition">
                    {cat.label}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {cat.subLabel}
                  </p>
                </div>

                {/* Status Badge (Green "Selesai" / Orange "Dalam proses" matching image) */}
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
                    isFinished
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      : 'bg-amber-100 text-amber-800 border border-amber-200'
                  }`}
                >
                  {isFinished && <Check className="w-3 h-3 stroke-[3]" />}
                  <span>{statusBadgeText}</span>
                </span>
              </div>

              {/* Progress & Percentage Display (Matching screen-0.jpg) */}
              <div className="space-y-1.5">
                <div className="flex items-baseline justify-between">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-black text-slate-900 font-sans tracking-tight">
                      {catStat.percentage}%
                    </span>
                    <span className="text-xs font-semibold text-slate-400">
                      Tingkat penyelesaian
                    </span>
                  </div>

                  <span className="text-xs font-bold text-slate-500 font-mono">
                    {catStat.completedItems}/{catStat.totalItems} Selesai
                  </span>
                </div>

                {/* Progress Bar (Green when 100%, Orange/Rose gradient when in progress) */}
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

              {/* 3-Column Stats Box (Exact Match to screen-0.jpg: Belum | Butuh approval | Selesai) */}
              <div className="grid grid-cols-3 bg-slate-50 border border-slate-200/80 rounded-2xl p-3 text-center divide-x divide-slate-200">
                {/* 1. Belum */}
                <div className="px-2">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Belum
                  </div>
                  <div className="text-lg sm:text-xl font-black text-rose-600 mt-0.5">
                    {catStat.pendingItems}
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
                    {catStat.completedItems}
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
