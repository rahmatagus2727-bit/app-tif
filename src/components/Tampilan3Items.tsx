import React, { useState } from 'react';
import { Building, FrequencyType, HKItemDefinition, HKSubmission } from '../types';
import {
  FREQUENCY_CATEGORIES,
  getCategoriesForBuilding,
  getItemsForBuilding,
  isKelas5Building,
  isKelas2Building,
  isKelas3Building,
  getItemMonthlyPhotoQuota,
  getCategoryMonthlyPhotoQuotaInfo
} from '../data/defaultData';
import { getBuildingStatsForDate } from '../utils/dateProgressHelper';
import {
  ArrowLeft,
  ChevronRight,
  Layers,
  CheckCircle2,
  AlertCircle,
  Camera,
  Image as ImageIcon,
  Plus,
  Eye,
  Check,
  Building2
} from 'lucide-react';

interface Tampilan3ItemsProps {
  building: Building;
  frequency: FrequencyType;
  items: HKItemDefinition[];
  submissions: HKSubmission[];
  onSelectItem: (item: HKItemDefinition) => void;
  onBackToStep2: () => void;
  onViewPhoto: (sub: HKSubmission) => void;
  onAddItem: (name: string, description: string, frequency: FrequencyType) => void;
  selectedDateStr?: string;
}

export const Tampilan3Items: React.FC<Tampilan3ItemsProps> = ({
  building,
  frequency,
  items,
  submissions,
  onSelectItem,
  onBackToStep2,
  onViewPhoto,
  onAddItem,
  selectedDateStr = '2026-08-20',
}) => {
  const [isAddingNewItem, setIsAddingNewItem] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemDesc, setNewItemDesc] = useState('');

  const selectedDayNum = parseInt(selectedDateStr.split('-')[2], 10) || 20;

  const buildingCategories = getCategoriesForBuilding(building);
  const currentCategory = buildingCategories.find((c) => c.id === frequency) ||
    FREQUENCY_CATEGORIES.find((c) => c.id === frequency) || {
      id: frequency,
      label: 'Kegiatan HK',
      subLabel: '',
    };

  const buildingItems = getItemsForBuilding(building, items);
  const categoryItems = buildingItems.filter((i) => i.frequency === frequency);
  
  // Filter submissions for this building & date
  const buildingSubs = submissions.filter((s) => s.buildingId === building.id);
  const isK5 = isKelas5Building(building);
  const isK2 = isKelas2Building(building);
  const isK3 = isKelas3Building(building);

  const quotaInfo = getCategoryMonthlyPhotoQuotaInfo(frequency, building, items);

  const buildingStats = getBuildingStatsForDate(building, items, submissions, selectedDateStr);
  const currentCategoryStat = buildingStats.categoryStats[frequency] || {
    id: frequency,
    label: currentCategory.label,
    totalItems: categoryItems.length,
    completedCount: 0,
    percentage: 0,
    isCompleted: false,
  };

  const completedCount = currentCategoryStat.completedCount;
  const percentage = currentCategoryStat.percentage;

  const handleCreateItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;
    onAddItem(newItemName.trim(), newItemDesc.trim(), frequency);
    setNewItemName('');
    setNewItemDesc('');
    setIsAddingNewItem(false);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-300 pb-12" id="tampilan-3-root">
      {/* 1. TOP RED HEADER BAR */}
      <div className="bg-gradient-to-r from-rose-600 to-rose-700 -mx-4 sm:-mx-6 lg:-mx-8 -mt-6 p-4 sm:p-5 text-white shadow-md space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToStep2}
              className="p-1.5 rounded-full hover:bg-white/20 transition text-white"
              title="Kembali ke Tampilan 2 (Pilih Kategori)"
              id="back-to-step2-btn"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-lg sm:text-xl font-black text-white tracking-tight uppercase">
                TAMPILAN 3 • {currentCategory.label}
              </h1>
              <div className="text-[11px] text-rose-100 flex items-center gap-1 font-medium">
                <Building2 className="w-3 h-3" />
                <span>{building.name} ({building.code})</span>
                {building.buildingClass && (
                  <span className="ml-1 px-1.5 py-0.2 bg-white/20 rounded text-[10px] font-bold">
                    {building.buildingClass}
                  </span>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsAddingNewItem(!isAddingNewItem)}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white hover:bg-rose-50 text-rose-700 text-xs font-bold shadow-md transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Item</span>
          </button>
        </div>

        {/* Modal Form Tambah Item Baru */}
        {isAddingNewItem && (
          <form onSubmit={handleCreateItem} className="bg-white text-slate-900 border border-rose-200 p-4 rounded-2xl space-y-3 max-w-xl shadow-xl animate-in fade-in">
            <h4 className="text-xs font-bold text-rose-700 uppercase tracking-wider">Tambah Item Pekerjaan Baru</h4>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Nama Item / Pekerjaan</label>
              <input
                type="text"
                required
                placeholder="Contoh: Pembersihan Kaca Pintu Otomatis"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-rose-600"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Deskripsi Standar Kebersihan</label>
              <input
                type="text"
                placeholder="Contoh: Bebas debu, noda sidik jari dan bersih mengkilap"
                value={newItemDesc}
                onChange={(e) => setNewItemDesc(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-rose-600"
              />
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsAddingNewItem(false)}
                className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-700"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow"
              >
                Simpan Item
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Info Kelas 5 Notice */}
      {isK5 && (
        <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-3.5 text-xs text-emerald-900 flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md bg-emerald-200/80 font-mono font-black text-[10px] text-emerald-900">
              KELAS 5 • {frequency === '1x_seminggu' ? 'MINGGUAN (3 ITEM)' : 'BULANAN (3 ITEM)'}
            </span>
            <span className="font-medium">
              {frequency === '1x_seminggu'
                ? 'Daftar Kegiatan Mingguan: Lantai (1x seminggu), Sampah Ruangan (1x seminggu), Sampah TPS (1x seminggu).'
                : 'Daftar Kegiatan Bulanan: Dinding (1x sebulan), Plafon (1x 3 bulan), Saluran air (1x sebulan).'}
            </span>
          </div>
        </div>
      )}

      {/* Info Kelas 2 Notice */}
      {isK2 && (
        <div className="bg-blue-50 border border-blue-200/80 rounded-2xl p-3.5 text-xs text-blue-900 flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md bg-blue-200/80 font-mono font-black text-[10px] text-blue-900">
              KELAS 2 • {frequency === 'harian' ? 'HARIAN (5 ITEM)' : frequency === '1x_seminggu' ? 'MINGGUAN (1 ITEM)' : 'BULANAN (9 ITEM)'}
            </span>
            <span className="font-medium">
              {frequency === 'harian' && 'Daftar Kegiatan Harian: Lantai (5x seminggu), Sampah ruangan (2x sehari), Pembersihan meubelair (1x sehari), Tissue roll (3x sehari), Kebersihan toilet (4x sehari).'}
              {frequency === '1x_seminggu' && 'Daftar Kegiatan Mingguan: Sampah TPS (2 x seminggu).'}
              {frequency === '1x_sebulan' && 'Daftar Kegiatan Bulanan: Pembersihan dinding (2x/bln), Lantai (triwulan), Lantai keramik (4x/bln), Plafon (4x/bln), Saluran air (2x/bln), Gordyn & blind (1x/bln), Pest control (2x/bln), Hygiene service (1x/bln), Hygiene unit (2x/bln).'}
            </span>
          </div>
        </div>
      )}

      {/* Info Kelas 3 Notice */}
      {isK3 && (
        <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-3.5 text-xs text-emerald-900 flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md bg-emerald-200/80 font-mono font-black text-[10px] text-emerald-900">
              KELAS 3 • {frequency === 'harian' ? 'HARIAN (4 ITEM)' : frequency === '1x_seminggu' ? 'MINGGUAN (2 ITEM)' : 'BULANAN (9 ITEM)'}
            </span>
            <span className="font-medium">
              {frequency === 'harian' && 'Daftar Kegiatan Harian: Sampah ruangan (1x sehari), Pembersihan meubelair (1x sehari), Tissue roll (3x sehari), Kebersihan toilet (3x sehari).'}
              {frequency === '1x_seminggu' && 'Daftar Kegiatan Mingguan: Pembersihan dan perawatan lantai (2x seminggu), Sampah TPS (2x seminggu).'}
              {frequency === '1x_sebulan' && 'Daftar Kegiatan Bulanan: Pembersihan dinding (1x/bln), Lantai (triwulan), Lantai keramik (1x/bln), Plafon (1x/bln), Saluran air (2x/bln), Gordyn & blind (1x/bln), Pest control (1x/bln), Hygiene service (1x/bln), Hygiene unit (1x/bln).'}
            </span>
          </div>
        </div>
      )}

      {/* Progress Summary Card */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-slate-500 font-medium">Progres Kelengkapan Foto Kategori Ini:</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-900 text-white">
              Target Kategori: {quotaInfo.totalTargetPhotos} Foto/Bulan
            </span>
          </div>
          <div className="text-xl font-black text-slate-900 font-sans mt-0.5">
            {percentage}% <span className="text-xs font-semibold text-slate-500">({completedCount}/{categoryItems.length} Item Selesai)</span>
          </div>
        </div>
        <div className="w-full sm:w-36 bg-slate-100 h-2.5 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${percentage === 100 ? 'bg-emerald-500' : 'bg-gradient-to-r from-amber-500 to-rose-600'}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* 2. DAFTAR ITEM PEKERJAAN (BARIS LURUS / GRID RESPONSIF) */}
      <div className="space-y-3" id="items-cards-container">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Daftar Item Pekerjaan ({categoryItems.length} Item Tersedia):
          </h2>
          <span className="text-[11px] text-rose-600 font-semibold">
            Klik item untuk membuka Tampilan 4 (Form &amp; Upload Foto)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {categoryItems.map((item, index) => {
            const itemStatus = buildingStats.itemsMap[item.id];
            const sub = itemStatus?.submission;
            const isCompleted = !!itemStatus?.isCompleted;
            const itemQuota = getItemMonthlyPhotoQuota(item, building);

            return (
              <div
                key={item.id}
                onClick={() => onSelectItem(item)}
                className="bg-white border border-slate-200/90 hover:border-rose-500 rounded-3xl p-5 cursor-pointer shadow-sm hover:shadow-md transition flex flex-col justify-between group space-y-3"
                id={`item-card-${item.id}`}
              >
                <div>
                  {/* Top Status & Item Number */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="w-6 h-6 rounded-lg bg-rose-50 border border-rose-100 text-rose-600 font-mono text-xs font-black flex items-center justify-center">
                      {index + 1}
                    </span>

                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                      isCompleted
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : 'bg-rose-100 text-rose-800 border border-rose-200'
                    }`}>
                      {isCompleted ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600 stroke-[3]" />
                          <span>Foto Lengkap</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-3 h-3 text-rose-600" />
                          <span>Foto Kurang</span>
                        </>
                      )}
                    </span>
                  </div>

                  {/* Item Bullet & Name */}
                  <h3 className="text-base font-extrabold text-slate-900 group-hover:text-rose-600 transition flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-600 shrink-0" />
                    <span>{item.name}</span>
                  </h3>

                  {/* Item Quota Target Badge */}
                  <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                    <span className="px-2 py-0.5 rounded-md bg-rose-50 border border-rose-200/80 font-mono font-bold text-[10.5px] text-rose-700">
                      Target: {itemQuota.monthlyPhotos} Foto/Bulan
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-[10.5px] font-medium text-slate-600">
                      {itemQuota.perPeriodText}
                    </span>
                  </div>

                  {item.description && (
                    <p className="text-xs text-slate-500 mt-2 leading-relaxed line-clamp-2">
                      {item.description}
                    </p>
                  )}

                  {/* Photo Preview if already completed */}
                  {sub && sub.photoUrl ? (
                    <div className="mt-3 p-2 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-3">
                      <img
                        src={sub.photoUrl}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded-xl border border-emerald-400"
                        referrerPolicy="no-referrer"
                      />
                      <div className="text-xs text-slate-600 flex-1">
                        <div className="font-bold text-emerald-700">
                          Tugas Selesai (Foto Terlampir)
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {sub.timestamp ? new Date(sub.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '10:15'} WIB
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onViewPhoto(sub);
                        }}
                        className="p-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 transition"
                        title="Lihat Foto Fullscreen"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  ) : isCompleted ? (
                    <div className="mt-3 p-2.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-2 text-xs text-emerald-800">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="font-semibold">Foto terverifikasi pada Tgl {selectedDayNum}</span>
                    </div>
                  ) : null}
                </div>

                {/* Card Action Footer */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-xs text-slate-400">
                    {isCompleted ? 'Update foto' : 'Wajib foto'}
                  </div>

                  <div className="flex items-center text-xs font-bold text-rose-600 group-hover:translate-x-1 transition-transform">
                    <span>Buka Form</span>
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
