import React, { useState, useEffect } from 'react';
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
  AlertCircle,
  Database,
  Users,
  History,
  Download,
  RotateCcw,
  Trash2,
  KeyRound,
  Check
} from 'lucide-react';
import { UserProfile, UserAccount, AuditLog } from '../types';
import { api } from '../services/api';

interface ProfileScreenProps {
  user: UserProfile;
  onUpdateUser: (updated: UserProfile) => void;
  onLogout: () => void;
  onOpenExcel: () => void;
  onDatabaseReset?: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  user,
  onUpdateUser,
  onLogout,
  onOpenExcel,
  onDatabaseReset,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showUsersModal, setShowUsersModal] = useState(false);
  const [showAuditModal, setShowAuditModal] = useState(false);
  
  const [editName, setEditName] = useState(user.name);
  const [editEmail, setEditEmail] = useState(user.email);
  const [editPhone, setEditPhone] = useState(user.phoneNumber || '0812-3456-7890');
  const [editDepartment, setEditDepartment] = useState(user.department || '');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Password state
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showResetDbConfirm, setShowResetDbConfirm] = useState(false);

  // Registered Users list state
  const [allUsers, setAllUsers] = useState<UserAccount[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);

  const isAdminOrSpv = user.role.includes('Admin') || user.role.includes('Supervisor') || user.role.includes('Manager');

  useEffect(() => {
    setEditName(user.name);
    setEditEmail(user.email);
    setEditPhone(user.phoneNumber || '');
    setEditDepartment(user.department || '');
  }, [user]);

  const fetchUsers = async () => {
    setIsLoadingUsers(true);
    try {
      const users = await api.getAllUsers();
      setAllUsers(users);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const fetchLogs = async () => {
    try {
      const logs = await api.getAuditLogs();
      setAuditLogs(logs);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await api.updateProfile({
        name: editName.trim(),
        email: editEmail.trim(),
        phoneNumber: editPhone.trim(),
        department: editDepartment.trim()
      });
      onUpdateUser(res.user);
      setSavedSuccess(true);
      setIsEditing(false);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err: any) {
      alert(err.message || 'Gagal menyimpan profil');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg('');
    setPasswordSuccess(false);

    if (newPassword.length < 6) {
      setPasswordMsg('Password baru minimal 6 karakter!');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg('Konfirmasi password tidak cocok!');
      return;
    }

    try {
      await api.changePassword(oldPassword, newPassword);
      setPasswordSuccess(true);
      setPasswordMsg('Password berhasil diperbarui di database!');
      setTimeout(() => {
        setIsChangingPassword(false);
        setPasswordMsg('');
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }, 1500);
    } catch (err: any) {
      setPasswordMsg(err.message || 'Gagal mengubah password');
    }
  };

  const handleDeleteUser = async (userId: string, name: string) => {
    if (confirm(`Yakin ingin menghapus akun ${name}?`)) {
      await api.deleteUser(userId);
      setAllUsers((prev) => prev.filter((u) => u.id !== userId));
    }
  };

  const handleExportDatabase = () => {
    window.location.href = '/api/db/export';
  };

  const handleResetDatabase = async () => {
    try {
      await api.resetDatabase();
      setShowResetDbConfirm(false);
      if (onDatabaseReset) onDatabaseReset();
      alert('Database berhasil direset ke konfigurasi awal.');
    } catch (err: any) {
      alert(err.message || 'Gagal reset database');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-10" id="my-birawa-profile-view">
      {/* 1. TOP RED HEADER BAR */}
      <div className="bg-gradient-to-r from-rose-600 to-rose-700 -mx-4 sm:-mx-6 lg:-mx-8 -mt-6 p-6 sm:p-8 text-white shadow-md">
        <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight uppercase font-sans text-center">
          Profile & Akun
        </h1>
        <p className="text-center text-xs text-rose-100 mt-0.5">
          Telkom Property • Sistem Autentikasi & Database Terintegrasi
        </p>
      </div>

      {/* 2. USER CARD: AVATAR, NAME, & EMAIL */}
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
          <div className="absolute bottom-0 right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white" title="Status: Online & Database Terhubung">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>

        {/* User Info */}
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            {user.name}
          </h2>
          <p className="text-xs sm:text-sm font-medium text-slate-500 font-mono">
            {user.email} • NIK: <strong>{user.nik}</strong>
          </p>
          <div className="inline-block mt-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-100 text-rose-700 text-xs font-bold">
            {user.role}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {user.department}
          </div>
        </div>

        {savedSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-xs font-medium animate-in fade-in flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            <span>Profil berhasil diperbarui di database!</span>
          </div>
        )}
      </div>

      {/* EDIT PROFILE FORM */}
      {isEditing && (
        <form onSubmit={handleSaveProfile} className="bg-white rounded-3xl p-6 border border-rose-200 shadow-md space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Edit Data Profil
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">Simpan ke DB Server</span>
          </div>

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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Resmi</label>
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
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Unit / Departemen</label>
              <input
                type="text"
                value={editDepartment}
                onChange={(e) => setEditDepartment(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-rose-600"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-700 cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow transition cursor-pointer disabled:opacity-60"
            >
              {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </div>
        </form>
      )}

      {/* CHANGE PASSWORD FORM */}
      {isChangingPassword && (
        <form onSubmit={handleSavePassword} className="bg-white rounded-3xl p-6 border border-rose-200 shadow-md space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Ubah Password Akun
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">Bcrypt Hashing</span>
          </div>

          {passwordMsg && (
            <div className={`p-3 rounded-xl text-xs font-medium ${passwordSuccess ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'}`}>
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
              className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-700 cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow transition cursor-pointer"
            >
              Update Password
            </button>
          </div>
        </form>
      )}

      {/* 3. PENGATURAN AKUN SECTION */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
          Pengaturan Akun & Keamanan
        </h3>

        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden divide-y divide-slate-100">
          {/* Menu Item: Edit Profile */}
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="w-full p-4.5 sm:p-5 flex items-center justify-between hover:bg-slate-50 transition text-left group cursor-pointer"
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
                  Ubah nama, email, kontak telepon
                </div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Menu Item: Ubah Password */}
          <button
            onClick={() => setIsChangingPassword(!isChangingPassword)}
            className="w-full p-4.5 sm:p-5 flex items-center justify-between hover:bg-slate-50 transition text-left group cursor-pointer"
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
                  Keamanan enkripsi akun & password
                </div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Menu Item: Sinkronisasi Data Excel Real-Time */}
          <button
            onClick={onOpenExcel}
            className="w-full p-4.5 sm:p-5 flex items-center justify-between hover:bg-slate-50 transition text-left group cursor-pointer"
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

      {/* 4. DATABASE & ADMIN MANAGEMENT SECTION */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1 flex items-center gap-1.5">
          <Database className="w-3.5 h-3.5 text-rose-600" />
          <span>Manajemen Database & Pengguna</span>
        </h3>

        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden divide-y divide-slate-100">
          {/* Admin User Management */}
          <button
            onClick={() => {
              setShowUsersModal(true);
              fetchUsers();
            }}
            className="w-full p-4.5 sm:p-5 flex items-center justify-between hover:bg-slate-50 transition text-left group cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-100 transition shadow-inner">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition">
                  Daftar Akun Pengguna Terdaftar
                </div>
                <div className="text-xs text-slate-400">
                  Lihat & kelola akun staf HK, SPV, dan Admin di DB
                </div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Audit Logs */}
          <button
            onClick={() => {
              setShowAuditModal(true);
              fetchLogs();
            }}
            className="w-full p-4.5 sm:p-5 flex items-center justify-between hover:bg-slate-50 transition text-left group cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-100 transition shadow-inner">
                <History className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-slate-800 group-hover:text-amber-600 transition">
                  Audit Trail & Log Aktivitas
                </div>
                <div className="text-xs text-slate-400">
                  Riwayat login, checklist masuk, dan perubahan sistem
                </div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Download Database Backup */}
          <button
            onClick={handleExportDatabase}
            className="w-full p-4.5 sm:p-5 flex items-center justify-between hover:bg-slate-50 transition text-left group cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-100 transition shadow-inner">
                <Download className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-slate-800 group-hover:text-emerald-600 transition">
                  Download Backup Database (JSON)
                </div>
                <div className="text-xs text-slate-400">
                  Unduh seluruh database (user, checklist, progress)
                </div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Reset Database (Factory Default) */}
          <button
            onClick={() => setShowResetDbConfirm(true)}
            className="w-full p-4.5 sm:p-5 flex items-center justify-between hover:bg-slate-50 transition text-left group cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center group-hover:bg-rose-100 transition shadow-inner">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-rose-700 transition">
                  Reset Data Checklist ke Bawaan
                </div>
                <div className="text-xs text-slate-400">
                  Kembalikan 15 gedung ke kondisi awal
                </div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* 5. LOGOUT BUTTON */}
      <div className="pt-2">
        <button
          type="button"
          onClick={() => setShowLogoutConfirm(true)}
          className="w-full py-4 px-6 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 active:from-rose-700 active:to-rose-800 text-white rounded-2xl font-extrabold text-sm uppercase tracking-wider shadow-lg shadow-rose-600/30 hover:shadow-rose-600/50 transition-all flex items-center justify-center gap-2 cursor-pointer"
          id="profile-btn-logout"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout Akun</span>
        </button>
      </div>

      {/* MODAL: ALL USERS IN DATABASE */}
      {showUsersModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 max-h-[85vh] flex flex-col animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    Pengguna Database
                  </h3>
                  <p className="text-xs text-slate-400">
                    Total {allUsers.length} akun terdaftar di sistem
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowUsersModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-3 divide-y divide-slate-100">
              {isLoadingUsers ? (
                <div className="py-8 text-center text-xs text-slate-400">
                  Memuat data pengguna...
                </div>
              ) : allUsers.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400">
                  Belum ada pengguna terdaftar.
                </div>
              ) : (
                allUsers.map((u) => (
                  <div key={u.id} className="pt-3 first:pt-0 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden flex items-center justify-center text-slate-700 font-bold text-xs shrink-0 border border-slate-200">
                        {u.avatarUrl ? (
                          <img src={u.avatarUrl} alt={u.name} className="w-full h-full object-cover" />
                        ) : (
                          u.name.substring(0, 2).toUpperCase()
                        )}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                          <span>{u.name}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 font-semibold">
                            {u.role}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          NIK: {u.nik} • {u.email}
                        </div>
                        {u.lastLoginAt && (
                          <div className="text-[10px] text-slate-400">
                            Terakhir login: {new Date(u.lastLoginAt).toLocaleString('id-ID')}
                          </div>
                        )}
                      </div>
                    </div>

                    {u.id !== user.nik && (
                      <button
                        type="button"
                        onClick={() => handleDeleteUser(u.id, u.name)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition cursor-pointer"
                        title="Hapus Pengguna"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 text-right">
              <button
                type="button"
                onClick={() => setShowUsersModal(false)}
                className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: AUDIT LOGS */}
      {showAuditModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 max-h-[85vh] flex flex-col animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <History className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    Audit Trail & Log Aktivitas
                  </h3>
                  <p className="text-xs text-slate-400">
                    Pencatatan real-time perubahan data sistem
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAuditModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-2.5">
              {auditLogs.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400">
                  Belum ada log aktivitas tercatat.
                </div>
              ) : (
                auditLogs.map((log) => (
                  <div key={log.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-slate-800 font-mono">{log.action}</span>
                      <span className="text-slate-400 text-[10px]">
                        {new Date(log.timestamp).toLocaleTimeString('id-ID')}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">{log.details}</p>
                    <div className="text-[10px] text-slate-400 flex items-center gap-2 pt-0.5">
                      <span>Oleh: <strong>{log.performedBy}</strong> ({log.role})</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 text-right">
              <button
                type="button"
                onClick={() => setShowAuditModal(false)}
                className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* IN-APP RESET DB CONFIRMATION MODAL */}
      {showResetDbConfirm && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-sm w-full shadow-2xl border border-slate-200 text-center space-y-4 animate-in zoom-in-95">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 mx-auto">
              <RotateCcw className="w-7 h-7 stroke-[2.2]" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-lg font-black text-slate-900 tracking-tight">
                Reset Data Checklist?
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Semua data foto checklist gedung akan dikembalikan ke kondisi bawaan awal. Akun yang telah terdaftar tetap tersimpan.
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowResetDbConfirm(false)}
                className="flex-1 py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleResetDatabase}
                className="flex-1 py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-bold text-xs transition shadow-md shadow-rose-600/30 cursor-pointer"
              >
                Ya, Reset DB
              </button>
            </div>
          </div>
        </div>
      )}

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
                className="flex-1 py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowLogoutConfirm(false);
                  onLogout();
                }}
                className="flex-1 py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-bold text-xs transition shadow-md shadow-rose-600/30 cursor-pointer"
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
