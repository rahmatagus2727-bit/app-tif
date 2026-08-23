import React from 'react';
import { X, Bell, CheckCheck, Clock, ShieldCheck, CheckCircle2, Trash2 } from 'lucide-react';
import { AppNotification } from '../types';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AppNotification[];
  onMarkAllAsRead: () => void;
  onClearNotifications: () => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllAsRead,
  onClearNotifications,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div
        className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden border border-slate-200 max-h-[85vh] flex flex-col animate-in slide-in-from-bottom duration-300"
        id="notification-modal-content"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-rose-600 to-rose-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <Bell className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white tracking-tight">Notifikasi</h3>
              <p className="text-[11px] text-rose-100 font-medium">
                {notifications.filter((n) => !n.read).length} pesan baru belum dibaca
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="px-4 py-2 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <button
            onClick={onMarkAllAsRead}
            className="flex items-center gap-1 text-rose-600 hover:text-rose-700 font-semibold"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>Tandai semua dibaca</span>
          </button>

          <button
            onClick={onClearNotifications}
            className="flex items-center gap-1 text-slate-400 hover:text-rose-600"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Bersihkan</span>
          </button>
        </div>

        {/* List of Notifications */}
        <div className="p-4 space-y-2.5 overflow-y-auto flex-1 divide-y divide-slate-100">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={`pt-2.5 first:pt-0 flex items-start gap-3 ${
                !notif.read ? 'bg-rose-50/40 p-2 rounded-xl' : ''
              }`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                notif.type === 'system'
                  ? 'bg-blue-50 text-blue-600'
                  : notif.type === 'order'
                  ? 'bg-rose-50 text-rose-600'
                  : 'bg-emerald-50 text-emerald-600'
              }`}>
                <CheckCircle2 className="w-4 h-4" />
              </div>

              <div className="flex-1 space-y-0.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-800">
                    {notif.title}
                  </h4>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {notif.time}
                  </span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {notif.message}
                </p>
              </div>
            </div>
          ))}

          {notifications.length === 0 && (
            <div className="py-12 text-center text-slate-400 text-xs">
              Tidak ada notifikasi saat ini.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition shadow"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
