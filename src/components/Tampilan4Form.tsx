import React, { useState, useRef } from 'react';
import { Building, FrequencyType, HKItemDefinition, HKSubmission } from '../types';
import { FREQUENCY_CATEGORIES } from '../data/defaultData';
import confetti from 'canvas-confetti';
import { compressImageFile } from '../utils/imageCompressor';
import {
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Upload,
  Camera,
  Image as ImageIcon,
  Trash2,
  Send,
  FileSpreadsheet,
  Building2,
  Layers,
  AlertCircle,
  RotateCcw,
  Check
} from 'lucide-react';

interface Tampilan4FormProps {
  building: Building;
  frequency: FrequencyType;
  item: HKItemDefinition;
  existingSubmission?: HKSubmission | null;
  onSubmit: (submissionData: Omit<HKSubmission, 'id' | 'timestamp' | 'dateOnly'>) => void;
  onDeleteSubmission?: (buildingId: string, itemId: string) => void;
  onBackToStep3: () => void;
  onBackToStep1Excel: () => void;
}

export const Tampilan4Form: React.FC<Tampilan4FormProps> = ({
  building,
  frequency,
  item,
  existingSubmission,
  onSubmit,
  onDeleteSubmission,
  onBackToStep3,
  onBackToStep1Excel,
}) => {
  const [photoUrl, setPhotoUrl] = useState<string>(
    existingSubmission ? existingSubmission.photoUrl : ''
  );
  const [photoFileName, setPhotoFileName] = useState<string>(
    existingSubmission?.photoFileName || ''
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  // Separate refs for Gallery (file picker) and Camera (direct capture)
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const currentCategory = FREQUENCY_CATEGORIES.find((c) => c.id === frequency) || {
    id: frequency,
    label: 'Kegiatan HK',
    subLabel: '',
  };

  const isTaskAlreadyCompleted = Boolean(existingSubmission && existingSubmission.photoUrl);

  // Convert File to Compressed Base64 for instant real-time sync
  const handleFileChange = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Harap unggah file gambar (JPG, PNG, JPEG, WEBP)');
      return;
    }
    setErrorMessage('');
    setDeleteSuccess(false);
    setPhotoFileName(file.name);

    try {
      const compressed = await compressImageFile(file, 800, 0.65);
      setPhotoUrl(compressed.base64);
      setPhotoFileName(compressed.fileName);
    } catch (err) {
      // Fallback to standard reader
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setPhotoUrl(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleDeleteTask = () => {
    if (onDeleteSubmission) {
      onDeleteSubmission(building.id, item.id);
    }
    setPhotoUrl('');
    setPhotoFileName('');
    setShowDeleteConfirm(false);
    setDeleteSuccess(true);
    setSubmitSuccess(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!photoUrl) {
      setErrorMessage('Wajib melampirkan foto bukti pengerjaan sebelum mengirim!');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');
    setDeleteSuccess(false);

    onSubmit({
      buildingId: building.id,
      buildingName: building.name,
      frequency: frequency,
      frequencyLabel: currentCategory.label,
      itemId: item.id,
      itemName: item.name,
      conditionGood: true,
      photoUrl: photoUrl,
      photoFileName: photoFileName || `foto_${item.id}_${Date.now()}.jpg`,
      notes: '',
      officerName: existingSubmission?.officerName || 'Petugas HK',
    });

    try {
      confetti({
        particleCount: 75,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch (err) {
      console.warn('Confetti effect error:', err);
    }

    setIsSubmitting(false);
    setSubmitSuccess(true);
  };

  return (
    <div className="space-y-4 max-w-2xl mx-auto animate-in fade-in duration-300 pb-16" id="tampilan-4-root">
      {/* 1. TOP RED HEADER BAR */}
      <div className="bg-gradient-to-r from-rose-600 to-rose-700 -mx-4 sm:-mx-6 lg:-mx-8 -mt-6 p-4 sm:p-5 text-white shadow-md space-y-2">
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={onBackToStep3}
            className="p-1.5 rounded-full hover:bg-white/20 transition text-white"
            title="Kembali ke Tampilan 3"
            id="back-to-step3-btn"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1 text-center">
            <h1 className="text-lg sm:text-xl font-black text-white tracking-tight uppercase">
              TAMPILAN 4 • FORM PEMERIKSAAN
            </h1>
            <div className="text-[11px] text-rose-100 font-medium">
              Bagian: <strong>{item.name}</strong> ({building.name})
            </div>
          </div>
          <span className="w-8" />
        </div>
      </div>

      {/* Delete Task Success Alert */}
      {deleteSuccess && (
        <div className="bg-amber-50 border border-amber-300 p-4 rounded-3xl text-amber-900 space-y-2 shadow-md animate-in zoom-in-95">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center text-amber-700">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-amber-950">Data Tugas Berhasil Dihapus!</h3>
              <p className="text-xs text-amber-800">
                Foto bukti dan rekaman tugas untuk item ini telah dibersihkan dari checklist.
              </p>
            </div>
          </div>
          <div className="flex gap-2 pt-1">
            <button
              onClick={onBackToStep3}
              className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition shadow"
            >
              Kembali ke Daftar Item (Tampilan 3)
            </button>
          </div>
        </div>
      )}

      {/* Success Notification Banner */}
      {submitSuccess && (
        <div className="bg-emerald-50 border border-emerald-300 p-5 rounded-3xl text-emerald-800 space-y-3 shadow-md animate-in zoom-in-95">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-emerald-900">Foto & Tugas Tersimpan!</h3>
              <p className="text-xs text-emerald-700">
                Data langsung sinkron ke spreadsheet Excel real-time dan checklist gedung.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            <button
              onClick={onBackToStep3}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition shadow"
            >
              Lanjut Periksa Item Lainnya (Tampilan 3)
            </button>

            <button
              onClick={onBackToStep1Excel}
              className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-bold px-4 py-2 rounded-xl transition flex items-center gap-1.5"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>Lihat Excel Real-Time (Tampilan 1)</span>
            </button>
          </div>
        </div>
      )}

      {/* 2. MAIN FORM CARD */}
      <form onSubmit={handleSubmit} className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-7 space-y-5 shadow-sm" id="form-tampilan-4">
        {/* Item Header Banner with Status & Delete Option */}
        <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="text-[11px] font-bold uppercase tracking-wider text-rose-600">
              Standar Kegiatan Kerja
            </div>
            <div className="text-base font-black text-slate-900">
              {item.name}
            </div>
            {item.description && (
              <p className="text-xs text-slate-500">
                {item.description}
              </p>
            )}
          </div>

          {/* If Task already has a submission, show status + Hapus Tugas button */}
          {isTaskAlreadyCompleted && (
            <div className="flex items-center gap-2 self-start sm:self-center">
              <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 border border-emerald-300 px-3 py-1.5 rounded-full text-xs font-extrabold">
                <Check className="w-3.5 h-3.5 stroke-[3] text-emerald-600" />
                <span>Tugas Sudah Diisi</span>
              </span>
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition shadow-xs"
                title="Hapus data tugas yang sudah tersimpan"
                id="btn-hapus-tugas-header"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                <span>Hapus Tugas</span>
              </button>
            </div>
          )}
        </div>

        {/* FIELD: LAMPIRAN FOTO [TEMPAT APLOD FOTO] */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              • Lampiran Foto Bukti Pekerjaan:
            </label>
            <span className="text-[10px] font-bold text-rose-600">
              *Wajib melampirkan foto
            </span>
          </div>

          {/* Hidden File Inputs */}
          {/* 1. Direct Gallery Input (no capture flag -> opens phone gallery or file picker) */}
          <input
            type="file"
            ref={galleryInputRef}
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFileChange(e.target.files[0]);
              }
            }}
            id="input-galeri"
          />

          {/* 2. Direct Camera Input (capture="environment" -> opens camera directly) */}
          <input
            type="file"
            ref={cameraInputRef}
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFileChange(e.target.files[0]);
              }
            }}
            id="input-kamera"
          />

          {!photoUrl ? (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-3xl p-6 sm:p-8 text-center transition-all ${
                isDragging
                  ? 'border-rose-500 bg-rose-50/50'
                  : 'border-slate-200 hover:border-rose-400 bg-slate-50/60'
              }`}
              id="upload-dropzone"
            >
              <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center shadow-inner">
                <Upload className="w-7 h-7" />
              </div>
              <div className="text-sm font-bold text-slate-800">
                Pilih foto dari Galeri atau ambil lewat Kamera
              </div>
              <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                Format: JPG, PNG, WEBP. Foto akan tersimpan otomatis ke laporan.
              </p>

              {/* Direct Action Buttons: Galeri & Kamera */}
              <div className="mt-5 flex flex-col sm:flex-row items-center justify-center gap-3">
                {/* 1. BUTTON KE GALERI */}
                <button
                  type="button"
                  onClick={() => galleryInputRef.current?.click()}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold px-5 py-3 rounded-2xl shadow-md transition active:scale-95"
                  id="btn-buka-galeri"
                >
                  <ImageIcon className="w-4 h-4 text-emerald-400" />
                  <span>Pilih dari Galeri Foto</span>
                </button>

                {/* 2. BUTTON KAMERA */}
                <button
                  type="button"
                  onClick={() => cameraInputRef.current?.click()}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-bold px-5 py-3 rounded-2xl shadow-md transition active:scale-95"
                  id="btn-ambil-kamera"
                >
                  <Camera className="w-4 h-4" />
                  <span>Ambil Foto Kamera</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 rounded-3xl border border-slate-200 p-4 sm:p-5 space-y-4" id="photo-preview-box">
              <div className="rounded-2xl overflow-hidden max-h-[320px] flex items-center justify-center bg-black/5 border border-slate-200">
                <img
                  src={photoUrl}
                  alt="Preview Bukti Foto"
                  className="max-h-[300px] w-auto max-w-full object-contain rounded-xl"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600 border-t border-slate-200/80 pt-3">
                <div className="flex items-center gap-1.5 font-bold text-emerald-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="truncate">Foto Siap Dikirim: {photoFileName || 'Foto Bukti'}</span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => galleryInputRef.current?.click()}
                    className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 text-xs font-bold flex items-center gap-1.5 transition shadow-2xs"
                    id="btn-ganti-galeri"
                  >
                    <ImageIcon className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Ganti dari Galeri</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => cameraInputRef.current?.click()}
                    className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 text-xs font-bold flex items-center gap-1.5 transition shadow-2xs"
                    id="btn-ganti-kamera"
                  >
                    <Camera className="w-3.5 h-3.5 text-rose-600" />
                    <span>Kamera</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setPhotoUrl('');
                      setPhotoFileName('');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold flex items-center gap-1.5 transition"
                    id="btn-hapus-foto-preview"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hapus Foto</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {errorMessage && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* BOTTOM ACTION BAR: BATAL, HAPUS TUGAS, & BUTTON KIRIM */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={onBackToStep3}
              className="w-full sm:w-auto px-4 py-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 transition text-center"
            >
              Kembali
            </button>

            {/* Hapus Tugas Button if existing submission or active photo */}
            {(existingSubmission || photoUrl) && (
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full sm:w-auto px-4 py-3 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-xs font-bold text-rose-700 transition flex items-center justify-center gap-1.5"
                id="btn-hapus-tugas-bottom"
              >
                <Trash2 className="w-4 h-4 text-rose-600" />
                <span>Hapus Tugas</span>
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl text-sm font-extrabold uppercase tracking-wider bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white shadow-lg shadow-rose-600/30 transition-all flex items-center justify-center gap-2 active:scale-98"
            id="btn-kirim-foto"
          >
            <Send className="w-4 h-4" />
            <span>{isSubmitting ? 'Mengirim Data...' : 'Kirim Foto & Simpan Tugas'}</span>
          </button>
        </div>
      </form>

      {/* CONFIRMATION MODAL: HAPUS TUGAS (Bukan Hapus Kegiatan Kerja) */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-sm w-full shadow-2xl border border-slate-200 text-center space-y-4 animate-in zoom-in-95">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 mx-auto">
              <Trash2 className="w-7 h-7 stroke-[2.2]" />
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-black text-slate-900 tracking-tight">
                Hapus Tugas Ini?
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Tindakan ini akan menghapus foto bukti dan status pengerjaan untuk tugas <strong>{item.name}</strong>. Kegiatan kerja tetap tersedia di daftar tugas.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="py-3 px-4 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
              >
                Batal
              </button>

              <button
                type="button"
                onClick={handleDeleteTask}
                className="py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-600/30 transition flex items-center justify-center gap-1.5"
                id="btn-confirm-delete-task"
              >
                <Trash2 className="w-4 h-4" />
                <span>Ya, Hapus</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

