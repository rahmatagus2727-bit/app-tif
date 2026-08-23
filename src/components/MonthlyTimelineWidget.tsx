import React, { useState, useRef, useEffect } from 'react';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Sparkles,
} from 'lucide-react';
import { Building, HKSubmission } from '../types';

interface MonthlyTimelineWidgetProps {
  selectedBuilding?: Building;
  submissions: HKSubmission[];
  buildings: Building[];
  onSelectBuilding?: (building: Building) => void;
  onSelectDate?: (dateStr: string) => void;
}

interface DayInfo {
  dayNum: number;
  dayName: string; // SAB, MIN, SEN, SEL, RAB, KAM, JUM
  fullDayName: string; // Sabtu, Minggu, etc.
  dateStr: string; // YYYY-MM-DD
  isWeekend: boolean;
  isHoliday: boolean;
  holidayName?: string;
  pct: number; // 0, 75, 100
  photoCount: number;
  totalRequired: number;
}

export const MonthlyTimelineWidget: React.FC<MonthlyTimelineWidgetProps> = ({
  selectedBuilding,
  buildings,
  onSelectDate,
}) => {
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [selectedMonth, setSelectedMonth] = useState<number>(7); // 7 = August (0-indexed)
  const [activeDateNum, setActiveDateNum] = useState<number>(22); // Default 22 as in screenshot
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const currentBuilding = selectedBuilding || buildings[0] || {
    id: 'bld-lea-01',
    name: 'KANTOR WITEL SURABAYA SLTN LEA',
    code: 'LEA-01',
  };

  // Generate days for August 2026 (or selected month/year)
  const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();

  const daysList: DayInfo[] = [];
  const dayAbbr = ['MIN', 'SEN', 'SEL', 'RAB', 'KAM', 'JUM', 'SAB'];
  const fullDayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Sabtu'];

  for (let i = 1; i <= daysInMonth; i++) {
    const d = new Date(selectedYear, selectedMonth, i);
    const dayOfWeek = d.getDay(); // 0 = Sun, 6 = Sat
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    // Indonesian national holidays in August
    let isHoliday = isWeekend;
    let holidayName: string | undefined = isWeekend ? fullDayNames[dayOfWeek] : undefined;

    if (selectedMonth === 7 && i === 17) {
      isHoliday = true;
      holidayName = 'Hari Kem';
    } else if (selectedMonth === 7 && i === 25) {
      isHoliday = true;
      holidayName = 'Tanggal';
    }

    // Determine completion percentage / photo count
    let pct = 0;
    let photoCount = 0;
    const totalRequired = 4;

    if (isHoliday) {
      pct = 0;
      photoCount = 0;
    } else if (i === 18 || i === 19) {
      pct = 100;
      photoCount = 4;
    } else if (i === 20) {
      pct = 75;
      photoCount = 3;
    } else if (i < 22) {
      pct = (i % 2 === 0) ? 100 : 0;
      photoCount = (i % 2 === 0) ? 4 : 0;
    } else {
      pct = 0;
      photoCount = 0;
    }

    const padDay = String(i).padStart(2, '0');
    const padMonth = String(selectedMonth + 1).padStart(2, '0');
    const dateStr = `${selectedYear}-${padMonth}-${padDay}`;

    daysList.push({
      dayNum: i,
      dayName: dayAbbr[dayOfWeek],
      fullDayName: fullDayNames[dayOfWeek],
      dateStr,
      isWeekend,
      isHoliday,
      holidayName,
      pct,
      photoCount,
      totalRequired,
    });
  }

  const activeDay = daysList.find((d) => d.dayNum === activeDateNum) || daysList[activeDateNum - 1] || daysList[0];

  // Auto scroll to active date card
  useEffect(() => {
    if (scrollContainerRef.current) {
      const activeEl = document.getElementById(`timeline-day-card-${activeDateNum}`);
      if (activeEl) {
        const container = scrollContainerRef.current;
        const leftPos = activeEl.offsetLeft - container.offsetWidth / 2 + activeEl.offsetWidth / 2;
        container.scrollTo({ left: leftPos, behavior: 'smooth' });
      }
    }
  }, [activeDateNum]);

  const handlePrevDay = () => {
    setActiveDateNum((prev) => Math.max(1, prev - 1));
  };

  const handleNextDay = () => {
    setActiveDateNum((prev) => Math.min(daysInMonth, prev + 1));
  };

  const handleFirstDay = () => {
    setActiveDateNum(1);
  };

  const handleLastDay = () => {
    setActiveDateNum(daysInMonth);
  };

  const handlePrevMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear((prev) => prev - 1);
    } else {
      setSelectedMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear((prev) => prev + 1);
    } else {
      setSelectedMonth((prev) => prev + 1);
    }
  };

  // Building short name for title
  const buildingDisplay = currentBuilding.name.includes('LEA')
    ? 'Gedung Lea Injoko'
    : currentBuilding.name.includes('KALIBRASI')
    ? 'Gudang Kalibrasi'
    : currentBuilding.name;

  return (
    <div
      className="bg-white text-slate-900 rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200/90 relative overflow-hidden"
      id="monthly-timeline-widget"
    >
      {/* 1. TOP HEADER STRIP */}
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        {/* Left: Calendar Icon + Title + Month navigation */}
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shadow-inner shrink-0">
            <Calendar className="w-6 h-6 stroke-[2.2]" />
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono font-bold tracking-widest text-slate-500 uppercase">
                TIMELINE LAPORAN BULANAN
              </span>
              <span className="text-[10px] font-mono font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700">
                Tgl 01 s/d Tgl {daysInMonth}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {monthNames[selectedMonth]} {selectedYear}
              </h2>
              <span className="text-xs sm:text-sm text-slate-500 font-medium">
                ({buildingDisplay})
              </span>

              <div className="flex items-center gap-2 text-xs font-bold">
                <button
                  onClick={handlePrevMonth}
                  className="text-slate-500 hover:text-rose-600 transition"
                >
                  ← Bulan Lalu
                </button>
                <button
                  onClick={handleNextMonth}
                  className="text-rose-600 hover:text-rose-700 transition"
                >
                  Bulan Selanjutnya →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Date Navigation Control Buttons */}
        <div className="flex items-center gap-1.5 self-start lg:self-auto flex-wrap">
          {/* Jump to day 1 */}
          <button
            onClick={handleFirstDay}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 text-rose-600 text-xs font-bold transition active:scale-95 shadow-xs"
            title="Ke Tanggal 01"
            id="btn-timeline-tgl01"
          >
            <ChevronsLeft className="w-3.5 h-3.5 text-rose-600" />
            <span>Tgl 01</span>
          </button>

          {/* Prev day */}
          <button
            onClick={handlePrevDay}
            className="p-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 transition active:scale-95"
            title="Hari Sebelumnya"
            id="btn-timeline-prev"
          >
            <ChevronLeft className="w-4 h-4 text-slate-600" />
          </button>

          {/* Current selected day pill */}
          <div
            className="px-3.5 py-1.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-extrabold font-mono shadow-xs flex items-center gap-1"
            id="badge-timeline-active-day"
          >
            <span>Tgl {String(activeDateNum).padStart(2, '0')} / {daysInMonth}</span>
          </div>

          {/* Next day */}
          <button
            onClick={handleNextDay}
            className="p-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 transition active:scale-95"
            title="Hari Berikutnya"
            id="btn-timeline-next"
          >
            <ChevronRight className="w-4 h-4 text-slate-600" />
          </button>

          {/* Jump to last day */}
          <button
            onClick={handleLastDay}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 text-rose-600 text-xs font-bold transition active:scale-95 shadow-xs"
            title={`Ke Tanggal ${daysInMonth}`}
            id="btn-timeline-tgl31"
          >
            <span>Tgl {daysInMonth}</span>
            <ChevronsRight className="w-3.5 h-3.5 text-rose-600" />
          </button>
        </div>
      </div>

      {/* 2. INSTRUCTION & SCROLL HINT */}
      <div className="flex items-center justify-between text-xs py-3 text-slate-500">
        <div className="flex items-center gap-1.5 text-slate-700 font-medium">
          <Sparkles className="w-4 h-4 text-rose-600 shrink-0" />
          <span>
            Klik tanggal di bawah untuk memeriksa foto/persentase (Hari kerja & Tanggal Merah otomatis disesuaikan):
          </span>
        </div>
        <span className="hidden sm:inline-block text-slate-400 font-mono text-[11px]">
          Scroll horizontal →
        </span>
      </div>

      {/* 3. HORIZONTAL SCROLLABLE TIMELINE CARDS */}
      <div
        ref={scrollContainerRef}
        className="flex items-center gap-2.5 overflow-x-auto pb-3 pt-1 no-scrollbar scroll-smooth"
        id="timeline-horizontal-scroll"
        style={{ scrollbarWidth: 'thin', scrollbarColor: '#cbd5e1 #f8fafc' }}
      >
        {daysList.map((day) => {
          const isActive = day.dayNum === activeDateNum;
          const isRedDay = day.isHoliday || day.isWeekend;

          return (
            <div
              key={day.dayNum}
              id={`timeline-day-card-${day.dayNum}`}
              onClick={() => {
                setActiveDateNum(day.dayNum);
                if (onSelectDate) onSelectDate(day.dateStr);
              }}
              className={`flex-shrink-0 w-[68px] sm:w-[72px] rounded-2xl p-2.5 flex flex-col items-center justify-between gap-1.5 cursor-pointer transition-all duration-200 select-none ${
                isActive
                  ? 'bg-rose-600 border-2 border-rose-400 text-white shadow-md shadow-rose-600/30 scale-105 z-10'
                  : 'bg-slate-50 hover:bg-slate-100/90 border border-slate-200 hover:border-slate-300 text-slate-700'
              }`}
            >
              {/* Day Abbreviation */}
              <div
                className={`text-[11px] font-black uppercase tracking-wider ${
                  isActive
                    ? 'text-rose-100'
                    : isRedDay
                    ? 'text-rose-600 font-extrabold'
                    : 'text-slate-500'
                }`}
              >
                {day.dayName}
              </div>

              {/* Date Number */}
              <div
                className={`text-xl sm:text-2xl font-black tracking-tight my-0.5 ${
                  isActive ? 'text-white' : isRedDay ? 'text-rose-700' : 'text-slate-900'
                }`}
              >
                {day.dayNum}
              </div>

              {/* Status Badge */}
              <div className="w-full text-center">
                {day.isHoliday ? (
                  <span
                    className={`block w-full py-0.5 rounded-lg text-[9px] font-extrabold uppercase tracking-tight ${
                      isActive
                        ? 'bg-rose-700 text-rose-100 border border-rose-500'
                        : 'bg-rose-100 border border-rose-200 text-rose-700'
                    }`}
                  >
                    LIBUR
                  </span>
                ) : day.pct === 100 ? (
                  <span
                    className={`block w-full py-0.5 rounded-lg text-[9px] font-extrabold ${
                      isActive
                        ? 'bg-rose-700 text-emerald-200 border border-rose-500'
                        : 'bg-emerald-100 border border-emerald-200 text-emerald-800'
                    }`}
                  >
                    100%
                  </span>
                ) : day.pct > 0 ? (
                  <span
                    className={`block w-full py-0.5 rounded-lg text-[9px] font-extrabold ${
                      isActive
                        ? 'bg-rose-700 text-sky-200 border border-rose-500'
                        : 'bg-sky-100 border border-sky-200 text-sky-800'
                    }`}
                  >
                    {day.pct}%
                  </span>
                ) : (
                  <span
                    className={`block w-full py-0.5 rounded-lg text-[9px] font-extrabold ${
                      isActive
                        ? 'bg-rose-700 text-slate-200 border border-rose-500'
                        : 'bg-slate-200/80 border border-slate-300 text-slate-600'
                    }`}
                  >
                    0%
                  </span>
                )}
              </div>

              {/* Subtext */}
              <div
                className={`text-[9px] font-medium truncate max-w-full ${
                  isActive
                    ? 'text-rose-100'
                    : isRedDay
                    ? 'text-rose-600 font-semibold'
                    : 'text-slate-500'
                }`}
              >
                {day.isHoliday
                  ? day.holidayName || 'Libur'
                  : `${day.photoCount}/${day.totalRequired} Foto`}
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. FOOTER: ACTIVE DATE INFO & LEGEND */}
      <div className="pt-3.5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        {/* Active Date & Status Indicator */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-slate-500 flex items-center gap-1.5 font-medium">
            <Calendar className="w-3.5 h-3.5 text-rose-600" />
            <span>Tanggal Aktif:</span>
          </span>

          <span className="px-3 py-1 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 font-mono font-bold text-xs">
            {activeDay.dayName}, Tgl {activeDay.dayNum} {monthNames[selectedMonth]} {selectedYear}
          </span>

          <span className="text-slate-300">•</span>

          <span className="text-slate-700 font-medium">
            Status: {activeDay.isHoliday ? (
              <span className="text-rose-600 font-bold">
                ⛱️ Libur ({activeDay.fullDayName}) - Tidak Ada Jadwal Rutin
              </span>
            ) : activeDay.pct === 100 ? (
              <span className="text-emerald-700 font-bold">
                ✅ Hari Kerja - 100% Lengkap (4/4 Foto Tersimpan)
              </span>
            ) : activeDay.pct > 0 ? (
              <span className="text-amber-700 font-bold">
                ⏳ Hari Kerja - Parsial ({activeDay.photoCount}/4 Foto)
              </span>
            ) : (
              <span className="text-slate-600 font-bold">
                📌 Hari Kerja - Belum Ada Foto (0/4)
              </span>
            )}
          </span>
        </div>

        {/* Legend Indicator */}
        <div className="flex items-center gap-3 text-[11px] text-slate-600 font-medium flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-slate-700">100% (Lengkap 4/4)</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="text-slate-700">Parsial (1-3 Foto)</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            <span className="text-slate-700">Libur / Tanggal Merah</span>
          </div>
        </div>
      </div>
    </div>
  );
};
