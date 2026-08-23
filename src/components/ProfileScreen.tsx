import React, { useState } from 'react';
import {
  User,
  Mail,
  Lock,
  LogOut,
  ChevronRight,
  Shield,
  FileSpreadsheet,
  Building,
  Sparkles,
  Phone,
  Briefcase,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { UserProfile } from '../types';

interface ProfileScreenProps {
  user: UserProfile;
  onUpdateUser: (updated: UserProfile) => void;
  onLogout: () => void;
  onOpenExcel: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  user,
  onUpdateUser,
  onLogout,
  onOpenExcel,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [editName, setEditName] = useState(user.name);
  const [editEmail, setEditEmail] = useState(user.email);
  const [editPhone, setEditPhone] = useState(user.phoneNumber || '0812-3456-7890');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Password state
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState('');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      ...user,
      name: editName.trim(),
      email: editEmail.trim(),
      phoneNumber: editPhone.trim(),
    });
    setSavedSuccess(true);
    setIsEditing(false);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setPasswordMsg('Password baru minimal 6 karakter!');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg('Konfirmasi password tidak cocok!');
      return;
    }
    setPasswordMsg('Password berhasil diperbarui!');
    setTimeout(() => {
      setIsChangingPassword(false);
      setPasswordMsg('');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }, 1200);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-10" id="my-birawa-profile-view">
      {/* 1. TOP RED HEADER BAR (Exact Match to Profile Screen in Image 18.50.13) */}
      <div className="bg-gradient-to-r from-rose-600 to-rose-700 -mx-4 sm:-mx-6 lg:-mx-8 -mt-6 p-6 sm:p-8 text-white shadow-md">
        <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight uppercase font-sans text-center">
          Profile
        </h1>
        <p className="text-center text-xs text-rose-100 mt-0.5">
          Telkom Property • Akun Petugas HK TIF
        </p>
      </div>

      {/* 2. USER CARD: AVATAR, NAME, & EMAIL (Exact Match to Image 18.50.13) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm text-center space-y-4">
        {/* Avatar Circle with Badge */}
        <div className="relative inline-block mx-auto">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-tr from-rose-600 via-rose-500 to-amber-400 p-1 shadow-xl shadow-rose-900/20">
            <div className="w-full h-full rounded-full bg-slate-100 overflow-hidden flex items-center justify-center text-rose-600 font-black text-2xl sm:text-3xl border-2 border-white">
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <span>RS</span>
              )}
            </div>
          </div>
          <div className="absolute bottom-0 right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white" title="Status: Online & Aktif">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>

        {/* User Info */}
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            {user.name}
          </h2>
          <p className="text-xs sm:text-sm font-medium text-slate-500 font-mono">
            {user.email}
          </p>
          <div className="inline-block mt-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-100 text-rose-700 text-xs font-bold">
            {user.role}
          </div>
        </div>

        {savedSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-xs font-medium animate-in fade-in">
            Profil berhasil disimpan!
          </div>
        )}
      </div>

      {/* EDIT PROFILE MODAL / DRAWER */}
      {isEditing && (
        <form onSubmit={handleSaveProfile} className="bg-white rounded-3xl p-6 border border-rose-200 shadow-md space-y-4 animate-in fade-in">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Edit Data Profil
          </h3>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Nama Lengkap</label>
              <input
                type="text"
                required
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-rose-600"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Email / NIK</label>
              <input
                type="email"
                required
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-rose-600"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">No. Handphone / WA</label>
              <input
                type="text"
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-rose-600"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-700"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow transition"
            >
              Simpan Perubahan
            </button>
          </div>
        </form>
      )}

      {/* CHANGE PASSWORD MODAL */}
      {isChangingPassword && (
        <form onSubmit={handleSavePassword} className="bg-white rounded-3xl p-6 border border-rose-200 shadow-md space-y-4 animate-in fade-in">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Ubah Password Akun
          </h3>
          {passwordMsg && (
            <div className={`p-3 rounded-xl text-xs font-medium ${passwordMsg.includes('berhasil') ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'}`}>
              {passwordMsg}
            </div>
          )}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Password Lama</label>
              <input
                type="password"
                required
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="Masukkan password saat ini"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-rose-600"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Password Baru</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimal 6 karakter"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-rose-600"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Konfirmasi Password Baru</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Ulangi password baru"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-rose-600"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsChangingPassword(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-700"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow transition"
            >
              Update Password
            </button>
          </div>
        </form>
      )}

      {/* 3. PENGATURAN AKUN SECTION (Exact Match to Image 18.50.13) */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
          Pengaturan Akun
        </h3>

        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden divide-y divide-slate-100">
          {/* Menu Item: Edit Profile */}
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="w-full p-4.5 sm:p-5 flex items-center justify-between hover:bg-slate-50 transition text-left group"
            id="profile-btn-edit-profile"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center group-hover:bg-rose-100 transition shadow-inner">
                <User className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-slate-800 group-hover:text-rose-600 transition">
                  Edit Profile
                </div>
                <div className="text-xs text-slate-400">
                  Ubah nama, email, nomor telepon
                </div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Menu Item: Ubah Password */}
          <button
            onClick={() => setIsChangingPassword(!isChangingPassword)}
            className="w-full p-4.5 sm:p-5 flex items-center justify-between hover:bg-slate-50 transition text-left group"
            id="profile-btn-ubah-password"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-100 transition shadow-inner">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition">
                  Ubah Password
                </div>
                <div className="text-xs text-slate-400">
                  Keamanan akun & autentikasi
                </div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Menu Item: Sinkronisasi Data Excel Real-Time */}
          <button
            onClick={onOpenExcel}
            className="w-full p-4.5 sm:p-5 flex items-center justify-between hover:bg-slate-50 transition text-left group"
            id="profile-btn-excel-sync"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-100 transition shadow-inner">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-slate-800 group-hover:text-emerald-600 transition">
                  Data Excel Real-Time
                </div>
                <div className="text-xs text-slate-400">
                  Export laporan spreadsheet & status sinkronisasi
                </div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* 4. LOGOUT BUTTON (Exact Match to Red Logout Button in Image 18.50.13) */}
      <div className="pt-2">
        <button
          type="button"
          onClick={() => setShowLogoutConfirm(true)}
          className="w-full py-4 px-6 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 active:from-rose-700 active:to-rose-800 text-white rounded-2xl font-extrabold text-sm uppercase tracking-wider shadow-lg shadow-rose-600/30 hover:shadow-rose-600/50 transition-all flex items-center justify-center gap-2 cursor-pointer"
          id="profile-btn-logout"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>

      {/* IN-APP LOGOUT CONFIRMATION MODAL */}
      {showLogoutConfirm && (
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
                id="modal-btn-confirm-logout"
              >
                Ya, Keluar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
