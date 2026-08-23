import React, { useState } from 'react';
import { Download, Search, Image as ImageIcon, CheckCircle, AlertCircle, Eye, FileSpreadsheet, RefreshCw, Filter, Sparkles, Building2 } from 'lucide-react';
import { Building, HKSubmission, HKItemDefinition } from '../types';
import { exportBuildingToChecklistExcel, calculateBuildingFrequencyStats } from '../utils/excelHelper';
import { FREQUENCY_CATEGORIES } from '../data/defaultData';

interface ExcelRealtimeTableProps {
  buildings: Building[];
  selectedBuilding: Building;
  onSelectBuilding: (b: Building) => void;
  submissions: HKSubmission[];
  items: HKItemDefinition[];
  onViewPhoto: (submission: HKSubmission) => void;
  onNavigateToForm?: (building: Building, item: HKItemDefinition) => void;
}

export const ExcelRealtimeTable: React.FC<ExcelRealtimeTableProps> = ({
  buildings,
  selectedBuilding,
  onSelectBuilding,
  submissions,
  items,
  onViewPhoto,
  onNavigateToForm,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFreqFilter, setSelectedFreqFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'complete' | 'missing'>('all');

  const stats = calculateBuildingFrequencyStats(selectedBuilding.id, submissions, items);
  const totalItemsCount = items.length;
  const buildingSubs = submissions.filter((s) => s.buildingId === selectedBuilding.id);
  const completedSubsCount = items.filter((item) =>
    buildingSubs.some((s) => s.itemId === item.id && s.photoUrl)
  ).length;
  const missingSubsCount = totalItemsCount - completedSubsCount;
  const overallPercentage = Math.round((completedSubsCount / totalItemsCount) * 100);

  // Filtered rows for the Excel View
  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFreq = selectedFreqFilter === 'all' || item.frequency === selectedFreqFilter;

    const sub = buildingSubs.find((s) => s.itemId === item.id && s.photoUrl);
    const isCompleted = !!sub;

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'complete' && isCompleted) ||
      (statusFilter === 'missing' && !isCompleted);

    return matchesSearch && matchesFreq && matchesStatus;
  });

  return (
    <div className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-sm space-y-0" id="excel-realtime-container">
      {/* Header Banner: Clean Emerald / Excel Style */}
      <div className="bg-gradient-to-r from-emerald-700 to-teal-800 p-4 sm:p-5 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-white/20 flex items-center justify-center text-white font-bold shadow-inner">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-100 bg-white/20 px-2 py-0.5 rounded-full">
                LIVE EXCEL REAL-TIME
              </span>
              <span className="text-xs text-emerald-100">Database Checklist Terintegrasi</span>
            </div>
            <h2 className="text-base sm:text-lg font-black text-white tracking-tight">
              Matriks Data Excel: <span className="underline decoration-emerald-300">{selectedBuilding.name}</span>
            </h2>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => exportBuildingToChecklistExcel(selectedBuilding, submissions, items)}
            className="inline-flex items-center gap-2 bg-white hover:bg-emerald-50 active:bg-emerald-100 text-emerald-800 text-xs font-black px-4 py-2.5 rounded-xl transition shadow-md"
            title="Download File Format Excel Asli (.xlsx)"
            id="download-excel-btn"
          >
            <Download className="w-4 h-4 text-emerald-700" />
            <span>Download Excel (.xlsx)</span>
          </button>
        </div>
      </div>

      {/* Building Tabs for Quick Switching within Excel view */}
      <div className="bg-slate-50 px-4 pt-3 pb-0 border-b border-slate-200 flex gap-2 overflow-x-auto no-scrollbar">
        <span className="text-xs font-bold text-slate-500 self-center mr-1 whitespace-nowrap">Sheet Gedung:</span>
        {buildings.map((b) => {
          const isSelected = b.id === selectedBuilding.id;
          const bSubs = submissions.filter((s) => s.buildingId === b.id);
          const bCompleted = items.filter((item) => bSubs.some((s) => s.itemId === item.id && s.photoUrl)).length;
          const bPct = Math.round((bCompleted / items.length) * 100);

          return (
            <button
              key={b.id}
              onClick={() => onSelectBuilding(b)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-t-2xl text-xs font-bold transition border-t border-x whitespace-nowrap ${
                isSelected
                  ? 'bg-white text-emerald-700 border-slate-200 border-b-2 border-b-white shadow-xs'
                  : 'bg-slate-100 text-slate-500 border-transparent hover:text-slate-700 hover:bg-slate-200/60'
              }`}
              id={`excel-tab-${b.id}`}
            >
              <span className={`w-2 h-2 rounded-full ${bPct === 100 ? 'bg-emerald-500' : 'bg-amber-500'}`} />
              <span>{b.name}</span>
              <span className="text-[10px] px-1.5 py-0.2 bg-slate-200 rounded text-slate-700 font-mono">
                {bPct}%
              </span>
            </button>
          );
        })}
      </div>

      {/* Summary KPI Bar for Selected Building */}
      <div className="bg-white p-4 border-b border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-slate-50 border border-slate-200/80 p-3 rounded-2xl">
          <div className="text-[11px] text-slate-500 font-semibold">Status Kelengkapan Foto</div>
          <div className="text-lg font-black text-slate-900 mt-0.5 flex items-center gap-2">
            <span>{overallPercentage}%</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
              overallPercentage === 100 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
            }`}>
              {overallPercentage === 100 ? 'LENGKAP' : 'ADA FOTO KURANG'}
            </span>
          </div>
          <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${overallPercentage === 100 ? 'bg-emerald-500' : 'bg-amber-500'}`}
              style={{ width: `${overallPercentage}%` }}
            />
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200/80 p-3 rounded-2xl">
          <div className="text-[11px] text-slate-500 font-semibold">Sudah Selesai & Ada Foto</div>
          <div className="text-lg font-extrabold text-emerald-700 mt-0.5">{completedSubsCount} Item</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Tersimpan di database Excel</div>
        </div>

        <div className="bg-slate-50 border border-slate-200/80 p-3 rounded-2xl">
          <div className="text-[11px] text-slate-500 font-semibold">Belum Dicek / Foto Kurang</div>
          <div className="text-lg font-extrabold text-rose-600 mt-0.5">{missingSubsCount} Item</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Perlu dokumentasi petugas HK</div>
        </div>

        <div className="bg-slate-50 border border-slate-200/80 p-3 rounded-2xl">
          <div className="text-[11px] text-slate-500 font-semibold">Total Item Standar HK</div>
          <div className="text-lg font-extrabold text-slate-900 mt-0.5">{totalItemsCount} Pekerjaan</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Harian, Mingguan & Bulanan</div>
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="p-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 flex-1 min-w-[280px]">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[180px] max-w-xs">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari item / sampah / toilet..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600"
            />
          </div>

          {/* Frequency Filter */}
          <select
            value={selectedFreqFilter}
            onChange={(e) => setSelectedFreqFilter(e.target.value)}
            className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-emerald-600"
          >
            <option value="all">Semua Frekuensi</option>
            <option value="harian">Kegiatan Harian</option>
            <option value="1x_seminggu">Kegiatan 1x Seminggu</option>
            <option value="2x_seminggu">Kegiatan 2x Seminggu</option>
            <option value="1x_sebulan">Kegiatan 1x Sebulan</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-emerald-600"
          >
            <option value="all">Semua Status</option>
            <option value="complete">Hanya yang Lengkap Foto</option>
            <option value="missing">Hanya yang Kurang Foto</option>
          </select>
        </div>

        <div className="text-xs text-slate-500 font-mono">
          {filteredItems.length} dari {items.length} baris
        </div>
      </div>

      {/* Spreadsheet Table View */}
      <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="sticky top-0 z-20 bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
            <tr>
              <th className="py-2.5 px-3 w-12 text-center border-r border-slate-200">No</th>
              <th className="py-2.5 px-3 min-w-[140px] border-r border-slate-200">Frekuensi</th>
              <th className="py-2.5 px-3 min-w-[200px] border-r border-slate-200">Item Pekerjaan</th>
              <th className="py-2.5 px-3 min-w-[120px] text-center border-r border-slate-200">Status Foto</th>
              <th className="py-2.5 px-3 min-w-[110px] text-center border-r border-slate-200">Kondisi</th>
              <th className="py-2.5 px-3 min-w-[120px] text-center border-r border-slate-200">Bukti Foto</th>
              <th className="py-2.5 px-3 min-w-[140px] border-r border-slate-200">Waktu & Petugas</th>
              <th className="py-2.5 px-3 min-w-[160px] border-r border-slate-200">Catatan</th>
              <th className="py-2.5 px-3 min-w-[90px] text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white font-sans">
            {filteredItems.map((item, idx) => {
              const sub = buildingSubs.find((s) => s.itemId === item.id && s.photoUrl);
              const isDone = !!sub;
              const freqCat = FREQUENCY_CATEGORIES.find((c) => c.id === item.frequency);

              return (
                <tr
                  key={item.id}
                  className={`hover:bg-slate-50 transition ${
                    isDone ? 'bg-white' : 'bg-rose-50/20'
                  }`}
                >
                  {/* No */}
                  <td className="py-2.5 px-3 text-center text-slate-500 font-mono border-r border-slate-200">
                    {idx + 1}
                  </td>

                  {/* Frekuensi */}
                  <td className="py-2.5 px-3 border-r border-slate-200 font-medium">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] whitespace-nowrap">
                      {freqCat?.label || item.frequency}
                    </span>
                  </td>

                  {/* Item Name & Description */}
                  <td className="py-2.5 px-3 border-r border-slate-200">
                    <div className="font-bold text-slate-900">{item.name}</div>
                    {item.description && (
                      <div className="text-[11px] text-slate-500 line-clamp-1">{item.description}</div>
                    )}
                  </td>

                  {/* Status Foto */}
                  <td className="py-2.5 px-3 text-center border-r border-slate-200">
                    {isDone ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                        LENGKAP
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800">
                        <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                        KURANG
                      </span>
                    )}
                  </td>

                  {/* Kondisi Baik/Bersih */}
                  <td className="py-2.5 px-3 text-center border-r border-slate-200">
                    {sub ? (
                      <span className={`px-2.5 py-0.5 rounded font-bold text-[11px] ${
                        sub.conditionGood
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {sub.conditionGood ? 'YA (Bersih)' : 'TIDAK (Kotor)'}
                      </span>
                    ) : (
                      <span className="text-slate-400 text-[11px] italic">Belum Diperiksa</span>
                    )}
                  </td>

                  {/* Bukti Foto (Thumbnail) */}
                  <td className="py-2.5 px-3 text-center border-r border-slate-200">
                    {sub?.photoUrl ? (
                      <div
                        onClick={() => onViewPhoto(sub)}
                        className="group relative inline-block cursor-pointer"
                        title="Klik untuk melihat foto ukuran penuh"
                      >
                        <img
                          src={sub.photoUrl}
                          alt={item.name}
                          className="w-11 h-11 object-cover rounded-xl border border-emerald-400 shadow-xs hover:scale-105 transition"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-black/30 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                          <Eye className="w-4 h-4 text-white" />
                        </div>
                      </div>
                    ) : (
                      <div className="text-[11px] text-slate-400 flex items-center justify-center gap-1">
                        <ImageIcon className="w-3.5 h-3.5" />
                        <span>Belum Ada</span>
                      </div>
                    )}
                  </td>

                  {/* Waktu & Petugas */}
                  <td className="py-2.5 px-3 border-r border-slate-200 text-slate-700">
                    {sub ? (
                      <div>
                        <div className="font-mono text-[11px] text-slate-800 font-semibold">
                          {new Date(sub.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                        </div>
                        <div className="text-[10px] text-slate-500">{sub.officerName}</div>
                      </div>
                    ) : (
                      <span className="text-slate-400 text-[11px]">-</span>
                    )}
                  </td>

                  {/* Catatan */}
                  <td className="py-2.5 px-3 border-r border-slate-200 text-slate-700">
                    {sub?.notes ? (
                      <span className="text-[11px] text-slate-600 line-clamp-2" title={sub.notes}>
                        {sub.notes}
                      </span>
                    ) : (
                      <span className="text-slate-400 text-[11px]">-</span>
                    )}
                  </td>

                  {/* Aksi / Input Foto */}
                  <td className="py-2.5 px-3 text-center">
                    <button
                      onClick={() => onNavigateToForm && onNavigateToForm(selectedBuilding, item)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition inline-flex items-center gap-1 ${
                        isDone
                          ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                          : 'bg-rose-600 hover:bg-rose-700 text-white shadow-xs'
                      }`}
                      title={isDone ? 'Update Foto / Catatan' : 'Input Checklist & Ambil Foto'}
                    >
                      <span>{isDone ? 'Ubah' : '+ Foto'}</span>
                    </button>
                  </td>
                </tr>
              );
            })}

            {filteredItems.length === 0 && (
              <tr>
                <td colSpan={9} className="text-center py-10 text-slate-400">
                  Tidak ada item pekerjaan yang cocok dengan pencarian / filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Info */}
      <div className="p-3.5 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
          <span>Status Sinkronisasi Real-Time Excel Aktif</span>
        </div>
        <div className="text-slate-500">
          Telkom Property • Housekeeping Center
        </div>
      </div>
    </div>
  );
};
