import React, { useState, useRef } from 'react';
import { Building, FrequencyType, HKItemDefinition, HKSubmission } from '../types';
import { FREQUENCY_CATEGORIES } from '../data/defaultData';
import confetti from 'canvas-confetti';
import {
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Upload,
  Camera,
  Trash2,
  Send,
  Check,
  X,
  FileSpreadsheet,
  Building2,
  Layers
} from 'lucide-react';

interface Tampilan4FormProps {
  building: Building;
  frequency: FrequencyType;
  item: HKItemDefinition;
  existingSubmission?: HKSubmission | null;
  onSubmit: (submissionData: Omit<HKSubmission, 'id' | 'timestamp' | 'dateOnly'>) => void;
  onBackToStep3: () => void;
  onBackToStep1Excel: () => void;
}

export const Tampilan4Form: React.FC<Tampilan4FormProps> = ({
  building,
  frequency,
  item,
  existingSubmission,
  onSubmit,
  onBackToStep3,
  onBackToStep1Excel,
}) => {
  const [conditionGood, setConditionGood] = useState<boolean>(
    existingSubmission ? existingSubmission.conditionGood : true
  );
  const [photoUrl, setPhotoUrl] = useState<string>(
    existingSubmission ? existingSubmission.photoUrl : ''
  );
  const [photoFileName, setPhotoFileName] = useState<string>(
    existingSubmission?.photoFileName || ''
  );
  const [notes, setNotes] = useState<string>(
    existingSubmission ? existingSubmission.notes || '' : ''
  );
  const [officerName, setOfficerName] = useState<string>(() => {
    return existingSubmission?.officerName || localStorage.getItem('tif_officer_name') || 'Rudik Setiyawan';
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const currentCategory = FREQUENCY_CATEGORIES.find((c) => c.id === frequency) || {
    id: frequency,
    label: 'Kegiatan HK',
    subLabel: '',
  };

  // Convert File to Base64
  const handleFileChange = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Harap unggah file gambar (JPG, PNG, WEBP)');
      return;
    }
    setErrorMessage('');
    setPhotoFileName(file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setPhotoUrl(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!photoUrl) {
      setErrorMessage('Wajib melampirkan foto kondisi kebersihan sebelum mengirim!');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    if (officerName.trim()) {
      localStorage.setItem('tif_officer_name', officerName.trim());
    }

    onSubmit({
      buildingId: building.id,
      buildingName: building.name,
      frequency: frequency,
      frequencyLabel: currentCategory.label,
      itemId: item.id,
      itemName: item.name,
      conditionGood: conditionGood,
      photoUrl: photoUrl,
      photoFileName: photoFileName,
      notes: notes.trim(),
      officerName: officerName.trim() || 'Rudik Setiyawan',
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

      {/* Success Notification Banner */}
      {submitSuccess && (
        <div className="bg-emerald-50 border border-emerald-300 p-5 rounded-3xl text-emerald-800 space-y-3 shadow-md animate-in zoom-in-95">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-emerald-900">Foto & Checklist Tersimpan!</h3>
              <p className="text-xs text-emerald-700">
                Data langsung sinkron ke spreadsheet Excel real-time dan storage lokal.
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
        {/* Item Header Banner */}
        <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-1">
          <div className="text-[11px] font-bold uppercase tracking-wider text-rose-600">
            Standar Pemeriksaan Item
          </div>
          <div className="text-sm font-extrabold text-slate-900">
            {item.name}
          </div>
          {item.description && (
            <p className="text-xs text-slate-500">
              {item.description}
            </p>
          )}
        </div>

        {/* FIELD 1: KONDISI BAIK / BERSIH (YA / TIDAK) */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            • Kondisi Baik / Bersih:
          </label>

          <div className="grid grid-cols-2 gap-3" id="selector-kondisi-baik">
            <button
              type="button"
              onClick={() => setConditionGood(true)}
              className={`p-3.5 sm:p-4 rounded-2xl border flex items-center justify-center gap-3 transition-all ${
                conditionGood
                  ? 'bg-emerald-50 border-emerald-500 text-emerald-900 shadow-sm ring-2 ring-emerald-500/30'
                  : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
              }`}
              id="option-kondisi-ya"
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center border ${
                conditionGood ? 'bg-emerald-600 text-white border-emerald-600' : 'border-slate-300'
              }`}>
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
              <div className="text-left">
                <div className="text-sm sm:text-base font-extrabold text-slate-900">YA</div>
                <div className="text-[10px] sm:text-xs text-slate-500">Bersih / Sesuai Standar</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setConditionGood(false)}
              className={`p-3.5 sm:p-4 rounded-2xl border flex items-center justify-center gap-3 transition-all ${
                !conditionGood
                  ? 'bg-rose-50 border-rose-500 text-rose-900 shadow-sm ring-2 ring-rose-500/30'
                  : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
              }`}
              id="option-kondisi-tidak"
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center border ${
                !conditionGood ? 'bg-rose-600 text-white border-rose-600' : 'border-slate-300'
              }`}>
                <X className="w-3.5 h-3.5 stroke-[3]" />
              </div>
              <div className="text-left">
                <div className="text-sm sm:text-base font-extrabold text-slate-900">TIDAK</div>
                <div className="text-[10px] sm:text-xs text-slate-500">Kotor / Perlu Perbaikan</div>
              </div>
            </button>
          </div>
        </div>

        {/* FIELD 2: LAMPIRAN FOTO [TEMPAT APLOD FOTO] */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              • Lampiran Foto [Tempat Aplod Foto]:
            </label>
            <span className="text-[10px] font-bold text-rose-600">
              *Wajib melampirkan foto
            </span>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFileChange(e.target.files[0]);
              }
            }}
          />
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
          />

          {!photoUrl ? (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-3xl p-6 sm:p-8 text-center transition-all cursor-pointer ${
                isDragging
                  ? 'border-rose-500 bg-rose-50/50'
                  : 'border-slate-200 hover:border-rose-400 bg-slate-50/50'
              }`}
              onClick={() => fileInputRef.current?.click()}
              id="upload-dropzone"
            >
              <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center shadow-inner">
                <Upload className="w-6 h-6" />
              </div>
              <div className="text-sm font-bold text-slate-800">
                Pilih File Foto atau Drag & Drop ke sini
              </div>
              <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                Format: JPG, PNG. Foto akan otomatis masuk ke tabel Excel.
              </p>

              <div className="mt-4 flex justify-center gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    cameraInputRef.current?.click();
                  }}
                  className="inline-flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-md transition"
                  id="btn-kamera"
                >
                  <Camera className="w-4 h-4" />
                  <span>Ambil Foto Kamera</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 rounded-3xl border border-slate-200 p-4 space-y-3" id="photo-preview-box">
              <div className="rounded-2xl overflow-hidden max-h-[300px] flex items-center justify-center bg-black/5 border border-slate-200">
                <img
                  src={photoUrl}
                  alt="Preview Bukti Foto"
                  className="max-h-[280px] w-auto max-w-full object-contain rounded-xl"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="flex items-center justify-between text-xs text-slate-600">
                <div className="flex items-center gap-1.5 font-bold text-emerald-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Foto Terlampir Siap Dikirim</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => cameraInputRef.current?.click()}
                    className="p-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold flex items-center gap-1"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Ulang Foto</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPhotoUrl('');
                      setPhotoFileName('');
                    }}
                    className="p-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hapus</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* FIELD 3: PETUGAS & CATATAN */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Nama Petugas Housekeeping (HK):
            </label>
            <input
              type="text"
              required
              value={officerName}
              onChange={(e) => setOfficerName(e.target.value)}
              placeholder="Contoh: Rudik Setiyawan"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-rose-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Catatan Khusus (Opsional):
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Contoh: Sudah dipel & disemprot desinfektan"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-rose-600"
            />
          </div>
        </div>

        {errorMessage && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* FIELD 4: BUTTON KIRIM (Matching exact mockup requirement) */}
        <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row justify-end items-center gap-3">
          <button
            type="button"
            onClick={onBackToStep3}
            className="w-full sm:w-auto px-4 py-3 text-xs font-bold text-slate-500 hover:text-slate-700"
          >
            Batal
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl text-sm font-extrabold uppercase tracking-wider bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white shadow-lg shadow-rose-600/30 transition-all flex items-center justify-center gap-2"
            id="btn-kirim-foto"
          >
            <Send className="w-4 h-4" />
            <span>{isSubmitting ? 'Mengirim Data...' : 'Button Kirim (Kirim Foto & Data)'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
