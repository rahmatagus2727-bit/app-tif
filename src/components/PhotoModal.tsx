import React from 'react';
import { X, CheckCircle, AlertTriangle, Calendar, User, Building, Clock } from 'lucide-react';
import { HKSubmission } from '../types';

interface PhotoModalProps {
  submission: HKSubmission | null;
  onClose: () => void;
}

export const PhotoModal: React.FC<PhotoModalProps> = ({ submission, onClose }) => {
  if (!submission) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={onClose}
      id="photo-modal-overlay"
    >
      <div
        className="relative bg-white border border-slate-200 rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
        id="photo-modal-content"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 bg-slate-50">
          <div>
            <div className="text-[11px] font-bold text-rose-600 uppercase tracking-wider">{submission.buildingName}</div>
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <span>{submission.itemName}</span>
              <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold ${
                submission.conditionGood ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
              }`}>
                {submission.conditionGood ? 'YA (Kondisi Bersih)' : 'TIDAK (Kotor/Perbaikan)'}
              </span>
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-700 flex items-center justify-center transition"
            id="close-photo-modal-btn"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Image Container */}
        <div className="p-4 bg-slate-950 flex items-center justify-center min-h-[280px] max-h-[50vh] overflow-hidden">
          {submission.photoUrl ? (
            <img
              src={submission.photoUrl}
              alt={submission.itemName}
              className="max-h-[48vh] w-auto max-w-full object-contain rounded-xl shadow-lg"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="text-center py-12 text-slate-400">
              <AlertTriangle className="w-10 h-10 mx-auto mb-2 text-amber-400" />
              <p className="text-xs">Tidak ada lampiran foto yang tersedia</p>
            </div>
          )}
        </div>

        {/* Details Footer */}
        <div className="p-4 sm:p-5 bg-white border-t border-slate-100 space-y-2.5 text-xs text-slate-700">
          <div className="grid grid-cols-2 gap-2 text-slate-600">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-rose-600 shrink-0" />
              <span>Tanggal: <strong className="text-slate-900">{new Date(submission.timestamp).toLocaleDateString('id-ID', { dateStyle: 'medium' })}</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-rose-600 shrink-0" />
              <span>Waktu: <strong className="text-slate-900">{new Date(submission.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <User className="w-4 h-4 text-rose-600 shrink-0" />
              <span>Petugas: <strong className="text-slate-900">{submission.officerName || 'Rudik Setiyawan'}</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <Building className="w-4 h-4 text-rose-600 shrink-0" />
              <span>Kategori: <strong className="text-slate-900">{submission.frequencyLabel}</strong></span>
            </div>
          </div>

          {submission.notes && (
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-xs">
              <span className="font-bold text-slate-900">Catatan Petugas: </span>
              {submission.notes}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
