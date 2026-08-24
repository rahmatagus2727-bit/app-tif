import React, { useState } from 'react';
import { Building, HKSubmission, HKItemDefinition } from '../types';
import { getItemsForBuilding } from '../data/defaultData';
import { getBuildingStatsForDate } from '../utils/dateProgressHelper';
import {
  Building2,
  ChevronRight,
  Plus,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Trash2,
  Layers,
  Search,
  Filter,
  Calendar,
} from 'lucide-react';

interface Tampilan1GedungProps {
  buildings: Building[];
  onSelectBuilding: (b: Building) => void;
  onAddBuilding: (name: string, code: string) => void;
  onDeleteBuilding: (id: string) => void;
  submissions: HKSubmission[];
  items: HKItemDefinition[];
  onViewPhoto: (submission: HKSubmission) => void;
  onNavigateToForm: (building: Building, item: HKItemDefinition) => void;
  selectedDateStr?: string;
}

export const Tampilan1Gedung: React.FC<Tampilan1GedungProps> = ({
  buildings,
  onSelectBuilding,
  onAddBuilding,
  onDeleteBuilding,
  submissions,
  items,
  selectedDateStr = '2026-08-20',
}) => {
  const [isAddingBuilding, setIsAddingBuilding] = useState(false);
  const [newBuildingName, setNewBuildingName] = useState('');
  const [newBuildingCode, setNewBuildingCode] = useState('');
  const [newBuildingClass, setNewBuildingClass] = useState('Kelas 3');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState('all');

  const selectedDayNum = parseInt(selectedDateStr.split('-')[2], 10) || 20;

  const handleCreateBuilding = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBuildingName.trim()) return;
    onAddBuilding(newBuildingName.trim(), newBuildingCode.trim() || `BLD-${buildings.length + 1}`);
    setNewBuildingName('');
    setNewBuildingCode('');
    setIsAddingBuilding(false);
  };

  const filteredBuildings = buildings.filter((b) => {
    const matchSearch =
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.address && b.address.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchClass =
      selectedClass === 'all' ? true : b.buildingClass === selectedClass;

    return matchSearch && matchClass;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12" id="tampilan-1-root">
      {/* 1. TOP RED HEADER BAR */}
      <div className="bg-gradient-to-r from-rose-600 to-rose-700 -mx-4 sm:-mx-6 lg:-mx-8 -mt-6 p-6 sm:p-8 text-white shadow-md space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-mono font-bold uppercase tracking-wider mb-2 backdrop-blur-sm">
              <Layers className="w-3.5 h-3.5" />
              <span>Tampilan 1 • Lokasi & Gedung</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white uppercase font-sans">
              Pilih Lokasi Gedung HK
            </h1>
            <p className="text-xs sm:text-sm text-rose-100 mt-1 max-w-xl">
              Daftar 15 Gedung Witel Surabaya Selatan. Progres dihitung berdasarkan <span className="font-bold underline text-white">Tanggal {selectedDayNum} Agustus 2026</span> dengan Persentase Harian &amp; Gabungan.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl bg-white/20 text-white text-xs font-mono font-bold flex items-center gap-1.5 backdrop-blur-sm border border-white/20">
              <Calendar className="w-3.5 h-3.5" />
              <span>Tgl {selectedDayNum} Agustus 2026</span>
            </span>

            <button
              onClick={() => setIsAddingBuilding(!isAddingBuilding)}
              className="inline-flex items-center gap-1.5 bg-white hover:bg-rose-50 text-rose-700 text-xs font-extrabold px-4 py-2.5 rounded-xl shadow-md transition cursor-pointer"
              id="btn-tambah-gedung"
            >
              <Plus className="w-4 h-4 text-rose-600" />
              <span>Tambah Gedung Baru</span>
            </button>
          </div>
        </div>

        {/* Modal Form Tambah Gedung */}
        {isAddingBuilding && (
          <form onSubmit={handleCreateBuilding} className="bg-white text-slate-900 border border-rose-200 p-4 sm:p-5 rounded-2xl space-y-3 max-w-xl shadow-xl animate-in fade-in">
            <h4 className="text-xs font-bold text-rose-700 uppercase tracking-wider">Tambah Lokasi Gedung Baru</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Nama Gedung</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: STO Rungkut III"
                  value={newBuildingName}
                  onChange={(e) => setNewBuildingName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-rose-600"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Kode</label>
                <input
                  type="text"
                  placeholder="Contoh: RKT-16"
                  value={newBuildingCode}
                  onChange={(e) => setNewBuildingCode(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-rose-600"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsAddingBuilding(false)}
                className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-700"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow"
              >
                Simpan Gedung
              </button>
            </div>
          </form>
        )}
      </div>

      {/* 2. SEARCH & FILTER CONTROLS */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari gedung (Lea, Kalibrasi, STO Injoko, Waru, Kapuas, Dinoyo, Melawai, dll)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 text-xs bg-white border border-slate-200 rounded-2xl focus:outline-none focus:border-rose-500 text-slate-800 placeholder-slate-400 shadow-xs"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {['all', 'Kelas 2', 'Kelas 3', 'Kelas 5'].map((cls) => (
            <button
              key={cls}
              onClick={() => setSelectedClass(cls)}
              className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                selectedClass === cls
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {cls === 'all' ? 'Semua Kelas (15)' : cls}
            </button>
          ))}
        </div>
      </div>

      {/* 3. DAFTAR GEDUNG (GRID RESPONSIF) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Building2 className="w-4 h-4 text-rose-600" />
            <span>Daftar Gedung Operasional:</span>
          </h2>
          <span className="text-xs text-slate-500 font-mono font-semibold">
            {filteredBuildings.length} dari {buildings.length} Gedung
          </span>
        </div>

        {/* Building Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" id="building-cards-container">
          {filteredBuildings.map((b) => {
            const stats = getBuildingStatsForDate(b, items, submissions, selectedDateStr);
            const {
              harianPercentage,
              compositePercentage,
              categoryStats,
              hasHarian,
              isHoliday,
              totalCompletedCount,
              totalItems,
            } = stats;

            const isFullyCompleted = compositePercentage === 100 && totalItems > 0;

            return (
              <div
                key={b.id}
                onClick={() => {
                  onSelectBuilding(b);
                }}
                className="bg-white border border-slate-200/90 hover:border-rose-500 rounded-3xl p-5 sm:p-6 cursor-pointer shadow-sm hover:shadow-md transition flex flex-col justify-between group space-y-4 relative overflow-hidden"
                id={`building-card-${b.id}`}
              >
                <div>
                  {/* Top Badges */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[11px] font-mono font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-lg border border-rose-100">
                        {b.code}
                      </span>
                      {b.buildingClass && (
                        <span className="text-[10px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                          {b.buildingClass}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isFullyCompleted
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : isHoliday
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}>
                        {isHoliday ? 'Libur' : `${compositePercentage}% Selesai`}
                      </span>

                      {/* Optional Delete for Custom Buildings */}
                      {buildings.length > 15 && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm(`Hapus gedung "${b.name}"?`)) {
                              onDeleteBuilding(b.id);
                            }
                          }}
                          className="text-slate-400 hover:text-rose-600 p-1 transition"
                          title="Hapus Gedung"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Building Name */}
                  <h3 className="text-sm sm:text-base font-extrabold text-slate-900 group-hover:text-rose-600 transition leading-snug line-clamp-2">
                    {b.name}
                  </h3>

                  {b.address && (
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="line-clamp-1">{b.address}</span>
                    </p>
                  )}

                  {/* Category percentage mini pills */}
                  {!isHoliday && (
                    <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
                      {hasHarian && (
                        <span className="px-2 py-0.5 rounded-md bg-rose-50 text-[10px] font-bold text-rose-700 border border-rose-100">
                          H: {categoryStats.harian.percentage}%
                        </span>
                      )}
                      <span className="px-2 py-0.5 rounded-md bg-blue-50 text-[10px] font-bold text-blue-700 border border-blue-100">
                        M: {categoryStats['1x_seminggu'].percentage}%
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-[10px] font-bold text-emerald-700 border border-emerald-100">
                        B: {categoryStats['1x_sebulan'].percentage}%
                      </span>
                    </div>
                  )}

                  {/* Mini Progress Bars */}
                  <div className="mt-3.5 space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500 font-medium">Harian (Tgl {selectedDayNum}):</span>
                      <span className="font-bold text-rose-600 font-mono">
                        {isHoliday ? 'LIBUR' : `${harianPercentage}%`}
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isFullyCompleted ? 'bg-emerald-500' : 'bg-gradient-to-r from-amber-500 to-rose-600'
                        }`}
                        style={{ width: `${compositePercentage}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-xs">
                    {!isFullyCompleted ? (
                      <span className="text-amber-600 font-semibold flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                        <span>Gabungan: <strong>{compositePercentage}%</strong></span>
                      </span>
                    ) : (
                      <span className="text-emerald-600 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Foto Lengkap (100%)</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center text-xs font-bold text-rose-600 group-hover:translate-x-1 transition-transform">
                    <span>Buka Tampilan 2</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
