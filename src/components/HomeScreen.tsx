import React, { useState } from 'react';
import {
  Bell,
  RefreshCw,
  ClipboardCheck,
  ChevronRight,
  Sparkles,
  Building2,
  ArrowRight,
  Search,
  CheckCircle2,
  Filter,
  LogOut,
  Calendar,
} from 'lucide-react';
import { UserProfile, Building, HKSubmission, HKItemDefinition } from '../types';
import { getItemsForBuilding } from '../data/defaultData';
import { MonthlyTimelineWidget } from './MonthlyTimelineWidget';
import { getBuildingStatsForDate } from '../utils/dateProgressHelper';

interface HomeScreenProps {
  user: UserProfile;
  unreadNotificationCount: number;
  onOpenNotifications: () => void;
  onOpenChecklist: () => void;
  onSelectBuilding: (building: Building) => void;
  buildings: Building[];
  submissions: HKSubmission[];
  items: HKItemDefinition[];
  onLogout?: () => void;
  selectedDateStr?: string;
  onSelectDate?: (dateStr: string, dayNum: number) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  user,
  unreadNotificationCount,
  onOpenNotifications,
  onOpenChecklist,
  onSelectBuilding,
  buildings,
  submissions,
  items,
  onLogout,
  selectedDateStr: propSelectedDateStr = '2026-08-20',
  onSelectDate: propOnSelectDate,
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [localDateStr, setLocalDateStr] = useState<string>(propSelectedDateStr);

  const activeDateStr = propSelectedDateStr || localDateStr;
  const selectedDayNum = parseInt(activeDateStr.split('-')[2], 10) || 20;

  // Dynamic Greeting based on client hour
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 4 && hour < 11) return 'Selamat Pagi!';
    if (hour >= 11 && hour < 15) return 'Selamat Siang!';
    if (hour >= 15 && hour < 18) return 'Selamat Sore!';
    return 'Selamat Malam!';
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 500);
  };

  const handleDateSelect = (dateStr: string, dayNum: number) => {
    setLocalDateStr(dateStr);
    if (propOnSelectDate) {
      propOnSelectDate(dateStr, dayNum);
    }
  };

  // Filter buildings by search & class
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
    <div className="space-y-5 animate-in fade-in duration-300 pb-8" id="my-birawa-home-view">
      {/* 1. TOP GREETING HEADER */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-1.5">
            <span>{getGreeting()}</span>
          </h1>
          <div className="flex items-center gap-2 mt-0.5">
            <p className="text-sm font-bold text-rose-600 tracking-tight">
              {user.name}
            </p>
            <span className="text-[10px] font-medium text-slate-400 bg-slate-200/80 px-2 py-0.5 rounded-md">
              {user.role}
            </span>
          </div>
        </div>

        {/* Right Action Icons (Logout + Bell with Badge + Refresh) */}
        <div className="flex items-center gap-2">
          {/* Notification Bell */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2.5 rounded-full bg-white hover:bg-slate-100 border border-slate-200/80 text-slate-700 shadow-sm transition"
            title="Lihat Notifikasi"
            id="home-btn-notification"
          >
            <Bell className="w-5 h-5 text-slate-700" />
            {unreadNotificationCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-600 text-white text-[10px] font-extrabold rounded-full flex items-center justify-center shadow-md animate-pulse">
                {unreadNotificationCount > 9 ? '9+' : unreadNotificationCount}
              </span>
            )}
          </button>

          {/* Refresh Sync Button */}
          <button
            onClick={handleRefresh}
            className={`p-2.5 rounded-full bg-white hover:bg-slate-100 border border-slate-200/80 text-slate-700 shadow-sm transition ${
              isRefreshing ? 'animate-spin text-rose-600' : ''
            }`}
            title="Refresh & Sinkronisasi"
            id="home-btn-refresh"
          >
            <RefreshCw className="w-5 h-5" />
          </button>

          {/* Quick Logout Button */}
          {onLogout && (
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="p-2.5 rounded-full bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 shadow-sm transition"
              title="Keluar / Ganti Akun"
              id="home-btn-logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* LOGOUT CONFIRMATION MODAL ON HOME */}
      {showLogoutConfirm && onLogout && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-sm w-full shadow-2xl border border-slate-200 text-center space-y-4 animate-in zoom-in-95">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 mx-auto">
              <LogOut className="w-7 h-7 stroke-[2.2]" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-lg font-black text-slate-900 tracking-tight">
                Keluar dari Akun?
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Anda akan keluar dan kembali ke halaman Login Dashboard My Birawa HK.
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowLogoutConfirm(false);
                  onLogout();
                }}
                className="flex-1 py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-bold text-xs transition shadow-md shadow-rose-600/30"
                id="modal-btn-confirm-logout-home"
              >
                Ya, Keluar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. RED BANNER CARD */}
      <div
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-rose-600 via-rose-700 to-red-800 text-white p-5 sm:p-6 shadow-xl shadow-rose-950/20 border border-rose-500/40"
        id="home-banner-card"
      >
        {/* Subtle Decorative Circles */}
        <div className="absolute -right-8 -bottom-8 w-40 h-40 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute right-6 top-4 w-24 h-24 rounded-full bg-rose-400/20 pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-lg">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-mono font-bold uppercase tracking-wider backdrop-blur-md">
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>Telkom Property • Witel Surabaya Selatan</span>
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-white leading-tight">
              Monitoring & Checklist Housekeeping
            </h2>
            <p className="text-xs text-rose-100 leading-relaxed">
              Monitoring kebersihan 15 gedung operasional HK (Kelas 2, Kelas 3, Kelas 5), upload foto bukti pekerjaan, dan integrasi real-time.
            </p>
          </div>

          <div className="flex items-center gap-2 self-stretch sm:self-auto">
            <button
              onClick={onOpenChecklist}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-white hover:bg-rose-50 text-rose-700 font-extrabold text-xs shadow-lg transition active:scale-95 flex items-center justify-center gap-1.5"
              id="banner-btn-checklist"
            >
              <span>Mulai Checklist</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. TIMELINE LAPORAN BULANAN (WIDGET KALENDER & TANGGAL MERAH) */}
      <MonthlyTimelineWidget
        buildings={buildings}
        submissions={submissions}
        selectedDateStr={activeDateStr}
        onSelectDate={handleDateSelect}
        onSelectBuilding={onSelectBuilding}
      />

      {/* 4. CHECKLIST QUICK ACTION */}
      <div id="home-main-actions">
        {/* Main Checklist Card */}
        <div
          onClick={onOpenChecklist}
          className="group bg-white hover:bg-rose-50/40 border border-slate-200/90 hover:border-rose-300 rounded-3xl p-4 sm:p-5 shadow-sm hover:shadow-md transition cursor-pointer flex items-center justify-between gap-3"
          id="home-card-checklist-main"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center group-hover:scale-105 transition-transform shadow-inner shrink-0">
              <ClipboardCheck className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-extrabold text-slate-900 group-hover:text-rose-600 transition">
                Checklist Housekeeping (15 Gedung Witel Sby Selatan)
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Pilih gedung dan isi form 4 tahap checklist kebersihan
              </p>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-rose-600 group-hover:text-white text-slate-400 flex items-center justify-center transition shrink-0">
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* 5. DAFTAR GEDUNG OPERASIONAL HK & DUAL PROGRES CHECKLIST REAL-TIME PER TANGGAL */}
      <div className="space-y-3 pt-1">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight">
                Daftar 15 Gedung Operasional HK
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-[11px] font-mono font-extrabold shadow-xs flex items-center gap-1">
                <Calendar className="w-3 h-3 text-rose-600" />
                <span>Tgl {selectedDayNum} Agustus 2026</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Menampilkan <span className="font-bold text-rose-600">Persentase Harian</span> (acuan utama hari ini) dan <span className="font-bold text-slate-800">Persentase Gabungan</span> (rata-rata Harian, Mingguan, Bulanan).
            </p>
          </div>

          <button
            onClick={onOpenChecklist}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-extrabold transition shadow-xs border border-rose-200/80 self-start sm:self-auto cursor-pointer"
            id="home-btn-buka-semua-gedung"
          >
            <span>Buka Checklist</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari gedung (Lea, Kalibrasi, STO Injoko, Waru, Kapuas, Dinoyo, dll)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-2xl focus:outline-none focus:border-rose-500 text-slate-800 placeholder-slate-400 shadow-xs"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {['all', 'Kelas 2', 'Kelas 3', 'Kelas 5'].map((cls) => (
              <button
                key={cls}
                onClick={() => setSelectedClass(cls)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                  selectedClass === cls
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {cls === 'all' ? 'Semua Kelas' : cls}
              </button>
            ))}
          </div>
        </div>

        {/* Building List Cards */}
        <div className="space-y-3" id="home-buildings-list">
          {filteredBuildings.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center text-slate-400 text-xs">
              Tidak ada gedung yang cocok dengan pencarian "{searchQuery}"
            </div>
          ) : (
            filteredBuildings.map((building) => {
              // Calculate detailed stats per selected date
              const stats = getBuildingStatsForDate(
                building,
                items,
                submissions,
                activeDateStr
              );

              const {
                harianPercentage,
                compositePercentage,
                categoryStats,
                hasHarian,
                isHoliday,
                statusLabel,
                totalCompletedCount,
                totalItems,
              } = stats;

              const isAllDone = compositePercentage === 100 && totalItems > 0;

              return (
                <div
                  key={building.id}
                  onClick={() => onSelectBuilding(building)}
                  className="bg-white border border-slate-200/90 hover:border-rose-400 rounded-3xl p-4 sm:p-5 shadow-sm hover:shadow-md transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                  id={`home-building-card-${building.id}`}
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-mono font-bold text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-lg border border-rose-100">
                        {building.code}
                      </span>
                      {building.buildingClass && (
                        <span className="text-[10px] font-bold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200">
                          {building.buildingClass}
                        </span>
                      )}
                      <span
                        className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                          isAllDone
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : isHoliday
                            ? 'bg-rose-100 text-rose-800 border border-rose-200'
                            : compositePercentage > 0
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}
                      >
                        {statusLabel}
                      </span>
                    </div>

                    <h4 className="text-sm sm:text-base font-extrabold text-slate-900 group-hover:text-rose-600 transition flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-slate-400 group-hover:text-rose-500 transition shrink-0" />
                      <span>{building.name}</span>
                    </h4>

                    <p className="text-xs text-slate-500 font-medium">
                      {building.address} •{' '}
                      {isHoliday ? (
                        <span className="text-rose-600 font-bold">Hari Libur</span>
                      ) : (
                        <span>
                          <strong className="text-slate-800 font-bold">{totalCompletedCount}</strong> dari{' '}
                          <strong className="text-slate-800 font-bold">{totalItems}</strong> total item pekerjaan
                        </span>
                      )}
                    </p>

                    {/* Breakdown per Kategori: Harian, Mingguan, Bulanan */}
                    {!isHoliday && (
                      <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                        {hasHarian && (
                          <span className="px-2 py-0.5 rounded-md bg-rose-50 border border-rose-200/80 text-[10.5px] font-bold text-rose-700">
                            Harian: {categoryStats.harian.percentage}%
                          </span>
                        )}
                        <span className="px-2 py-0.5 rounded-md bg-blue-50 border border-blue-200/80 text-[10.5px] font-bold text-blue-700">
                          Mingguan: {categoryStats['1x_seminggu'].percentage}%
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200/80 text-[10.5px] font-bold text-emerald-700">
                          Bulanan: {categoryStats['1x_sebulan'].percentage}%
                        </span>
                      </div>
                    )}

                    {/* Dynamic Dual Progress bar */}
                    <div className="w-full bg-slate-100 rounded-full h-2 mt-1 overflow-hidden">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${
                          isAllDone
                            ? 'bg-emerald-500'
                            : compositePercentage > 50
                            ? 'bg-gradient-to-r from-amber-500 to-rose-500'
                            : isHoliday
                            ? 'bg-rose-400'
                            : 'bg-rose-500'
                        }`}
                        style={{ width: `${compositePercentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Right Dual Percentage Indicators (Persentase Harian + Persentase Gabungan) */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 shrink-0">
                    <div className="flex items-center sm:flex-col sm:items-end gap-3 sm:gap-0.5">
                      {/* 1. Persentase Harian (Acuan Harian) */}
                      <div className="text-left sm:text-right">
                        <div className="text-[10px] font-bold text-rose-600 uppercase tracking-tight flex items-center gap-1 sm:justify-end">
                          <span>Harian (Tgl {selectedDayNum})</span>
                        </div>
                        <div className="text-sm sm:text-base font-mono font-black text-rose-700">
                          {isHoliday ? 'LIBUR' : `${harianPercentage}%`}
                        </div>
                      </div>

                      {/* 2. Persentase Gabungan (Harian + Mingguan + Bulanan) */}
                      <div className="text-left sm:text-right pt-0.5 sm:border-t sm:border-slate-100 sm:mt-1">
                        <div className="text-[9.5px] font-bold text-slate-500 uppercase tracking-tight">
                          Gabungan (Total)
                        </div>
                        <div
                          className={`text-base sm:text-lg font-mono font-black ${
                            isAllDone
                              ? 'text-emerald-700'
                              : isHoliday
                              ? 'text-rose-600'
                              : compositePercentage > 0
                              ? 'text-slate-900'
                              : 'text-slate-400'
                          }`}
                        >
                          {isHoliday ? 'LIBUR' : `${compositePercentage}%`}
                        </div>
                      </div>
                    </div>

                    <div className="w-8 h-8 rounded-full bg-slate-50 group-hover:bg-rose-600 group-hover:text-white text-slate-400 flex items-center justify-center transition shadow-inner">
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
