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
} from 'lucide-react';
import { UserProfile, Building, HKSubmission, HKItemDefinition } from '../types';
import { MonthlyTimelineWidget } from './MonthlyTimelineWidget';

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
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

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

      {/* 4. DAFTAR GEDUNG OPERASIONAL HK & PROGRES CHECKLIST */}
      <div className="space-y-3 pt-1">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight">
              Daftar 15 Gedung Operasional HK
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Witel Surabaya Selatan • Kelas 2, Kelas 3, dan Kelas 5
            </p>
          </div>

          <button
            onClick={onOpenChecklist}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-extrabold transition shadow-xs border border-rose-200/80 self-start sm:self-auto"
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
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
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
              const bldSubmissions = submissions.filter((s) => s.buildingId === building.id);
              const totalItems = items.length;
              const completedCount = bldSubmissions.filter((s) => s.photoUrl).length;
              const pct =
                totalItems > 0 ? Math.min(100, Math.round((completedCount / totalItems) * 100)) : 0;

              const isDone = pct === 100;

              return (
                <div
                  key={building.id}
                  onClick={() => onSelectBuilding(building)}
                  className="bg-white border border-slate-200/90 hover:border-rose-400 rounded-3xl p-4 sm:p-5 shadow-sm hover:shadow-md transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                >
                  <div className="space-y-1.5 flex-1">
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
                          isDone
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : pct > 0
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}
                      >
                        {isDone ? 'Selesai 100%' : pct > 0 ? `${pct}% Selesai` : 'Belum Mulai'}
                      </span>
                    </div>

                    <h4 className="text-sm sm:text-base font-extrabold text-slate-900 group-hover:text-rose-600 transition flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-slate-400 group-hover:text-rose-500 transition shrink-0" />
                      <span>{building.name}</span>
                    </h4>

                    <p className="text-xs text-slate-500 font-medium">
                      {building.address} • {completedCount} dari {totalItems} item terisi
                    </p>

                    {/* Progress bar */}
                    <div className="w-full bg-slate-100 rounded-full h-2 mt-2 overflow-hidden">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${
                          isDone
                            ? 'bg-emerald-500'
                            : pct > 40
                            ? 'bg-amber-500'
                            : 'bg-rose-500'
                        }`}
                        style={{ width: `${Math.max(5, pct)}%` }}
                      />
                    </div>
                  </div>

                  {/* Right Action */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    <div className="text-left sm:text-right">
                      <div className="text-[10px] text-slate-400 font-medium">Progres Gedung</div>
                      <div className="text-sm font-mono font-extrabold text-slate-800">
                        {pct}%
                      </div>
                    </div>

                    <div className="w-9 h-9 rounded-full bg-slate-50 group-hover:bg-rose-600 group-hover:text-white text-slate-400 flex items-center justify-center transition shadow-inner">
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
