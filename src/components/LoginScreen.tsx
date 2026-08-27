import React, { useState } from 'react';
import { 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  Building2, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles,
  UserPlus,
  Phone,
  Mail,
  Briefcase,
  Database
} from 'lucide-react';
import { UserProfile } from '../types';
import { api } from '../services/api';

interface LoginScreenProps {
  onLogin: (user: UserProfile) => void;
  defaultUser: UserProfile;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, defaultUser }) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  
  // Login State
  const [username, setUsername] = useState('92001214');
  const [password, setPassword] = useState('92001214');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  
  // Register State
  const [regNik, setRegNik] = useState('');
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regRole, setRegRole] = useState('Petugas Housekeeping (HK)');
  const [regPhone, setRegPhone] = useState('');
  const [regDepartment, setRegDepartment] = useState('Telkom Property - Witel Surabaya Selatan');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [infoMessage, setInfoMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setErrorMessage('Username atau NIK tidak boleh kosong.');
      return;
    }
    setIsLoading(true);
    setErrorMessage('');
    setInfoMessage('');
    setSuccessMessage('');

    try {
      const res = await api.login(username.trim(), password);
      setIsLoading(false);
      onLogin(res.user);
    } catch (err: any) {
      setIsLoading(false);
      setErrorMessage(err.message || 'Login gagal. Akun belum terdaftar atau password salah.');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regNik.trim() || !regName.trim() || !regPassword) {
      setErrorMessage('NIK, Nama Lengkap, dan Password wajib diisi.');
      return;
    }
    if (regPassword.length < 6) {
      setErrorMessage('Password minimal 6 karakter demi keamanan akun.');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setErrorMessage('Konfirmasi password tidak sesuai.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const res = await api.register({
        nik: regNik.trim(),
        name: regName.trim(),
        email: regEmail.trim() || `${regNik.trim()}@telpro.co.id`,
        password: regPassword,
        role: regRole,
        department: regDepartment,
        phoneNumber: regPhone.trim()
      });
      setIsLoading(false);
      setSuccessMessage('Pendaftaran akun berhasil! Mengalihkan ke dashboard...');
      setTimeout(() => {
        onLogin(res.user);
      }, 700);
    } catch (err: any) {
      setIsLoading(false);
      setErrorMessage(err.message || 'Gagal mendaftar akun baru.');
    }
  };

  const handleQuickLogin = async (role: 'petugas' | 'supervisor' | 'admin') => {
    setIsLoading(true);
    setErrorMessage('');
    setInfoMessage('');
    setSuccessMessage('');

    const targetNik = role === 'supervisor' ? '91004521' : role === 'admin' ? '88001122' : '92001214';
    
    try {
      const res = await api.login(targetNik, targetNik === '92001214' ? '92001214' : 'password123');
      setIsLoading(false);
      onLogin(res.user);
    } catch (err) {
      setIsLoading(false);
      if (role === 'supervisor') {
        onLogin({
          name: 'Budi Santoso',
          email: 'budi.santoso@telpro.co.id',
          nik: '91004521',
          role: 'HK Supervisor',
          department: 'Housekeeping Operation Witel Surabaya',
          phoneNumber: '0813-8899-7711',
          avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        });
      } else if (role === 'admin') {
        onLogin({
          name: 'Administrator TIF',
          email: 'admin.tif@telpro.co.id',
          nik: '88001122',
          role: 'Telpro Area Manager',
          department: 'Facility Management Telkom Property',
          phoneNumber: '0811-2233-4455',
          avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80'
        });
      } else {
        onLogin(defaultUser);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-900/95 flex items-center justify-center p-4 sm:p-6 selection:bg-rose-500/20 selection:text-rose-600">
      {/* Mobile-First Shell Card */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200/80 flex flex-col relative" id="my-birawa-login-card">
        {/* Top Red Header with Telkom Property Skyline Branding */}
        <div className="bg-gradient-to-b from-rose-600 to-rose-700 p-7 text-white relative overflow-hidden text-center">
          {/* Subtle Skyline Graphic Silhouette */}
          <div className="absolute inset-0 opacity-15 pointer-events-none flex items-end justify-center">
            <svg viewBox="0 0 500 150" className="w-full h-28 fill-white">
              <path d="M0,150 L0,90 L30,90 L30,60 L50,60 L50,90 L80,90 L80,40 L110,40 L110,90 L140,90 L140,20 L160,20 L160,90 L200,90 L200,50 L230,50 L230,90 L270,90 L270,30 L290,30 L290,10 L300,10 L300,90 L340,90 L340,45 L370,45 L370,90 L410,90 L410,35 L430,35 L430,90 L460,90 L460,70 L480,70 L480,90 L500,90 L500,150 Z" />
            </svg>
          </div>

          <div className="relative z-10 space-y-1.5">
            {/* Telkom Property Logo Badge */}
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white text-rose-600 shadow-xl shadow-rose-900/30 font-black text-2xl tracking-tighter mx-auto mb-1 border-2 border-rose-100">
              <div className="text-center leading-none">
                <span className="text-[10px] block font-bold text-slate-500 uppercase tracking-widest -mb-0.5">TELPRO</span>
                <span className="text-lg font-extrabold text-rose-600">HK</span>
              </div>
            </div>

            <h1 className="text-2xl font-black tracking-tight text-white font-sans uppercase">
              My Birawa
            </h1>
            <p className="text-xs text-rose-100 font-medium tracking-wide">
              Telkom Property by Telkom Indonesia
            </p>
            
            <div className="flex items-center justify-center gap-2 mt-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-[10px] font-mono font-semibold tracking-wider uppercase text-white backdrop-blur-sm">
                <Database className="w-3 h-3 text-emerald-300" />
                <span>Live Realtime Database</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Switcher: Sign In vs Register */}
        <div className="flex border-b border-slate-100 bg-slate-50 p-1.5 gap-1.5">
          <button
            type="button"
            onClick={() => {
              setActiveTab('login');
              setErrorMessage('');
            }}
            className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'login'
                ? 'bg-white text-rose-600 shadow-sm border border-slate-200/60'
                : 'text-slate-500 hover:text-slate-800'
            }`}
            id="tab-btn-signin"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Sign In Akun</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('register');
              setErrorMessage('');
            }}
            className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'register'
                ? 'bg-white text-rose-600 shadow-sm border border-slate-200/60'
                : 'text-slate-500 hover:text-slate-800'
            }`}
            id="tab-btn-register"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Daftar Akun Baru</span>
          </button>
        </div>

        {/* Login Form Body */}
        <div className="p-6 sm:p-7 space-y-4 flex-1 bg-white">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-medium animate-shake">
              {errorMessage}
            </div>
          )}

          {infoMessage && (
            <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 text-xs font-medium animate-in fade-in">
              {infoMessage}
            </div>
          )}

          {successMessage && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium animate-in fade-in flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {activeTab === 'login' ? (
            /* ================= SIGN IN FORM ================= */
            <form onSubmit={handleLoginSubmit} className="space-y-4" id="login-form">
              <div className="text-center space-y-1 pb-1">
                <h2 className="text-base font-bold text-slate-800 tracking-tight">
                  Sign In ke Akun Anda
                </h2>
                <p className="text-xs text-slate-500">
                  Masukkan NIK & Password untuk mengakses checklist real-time
                </p>
              </div>

              {/* Username Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Username / NIK
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: 92001214"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600 transition"
                    id="input-username"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4 text-slate-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Masukkan password akun"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600 transition"
                    id="input-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition cursor-pointer"
                    title={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between text-xs pt-0.5">
                <label className="flex items-center gap-2 cursor-pointer text-slate-600 hover:text-slate-800">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-rose-600 rounded border-slate-300 focus:ring-rose-500"
                  />
                  <span>Ingat saya</span>
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setInfoMessage('Password akun bawaan default: Petugas (92001214), SPV (password123), Admin (password123). Anda juga dapat mengubah password di menu profil.');
                  }}
                  className="text-rose-600 font-semibold hover:underline cursor-pointer"
                >
                  Lupa Password?
                </button>
              </div>

              {/* Red Sign In Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 active:from-rose-700 active:to-rose-800 text-white rounded-xl font-extrabold text-sm uppercase tracking-wider shadow-lg shadow-rose-600/30 hover:shadow-rose-600/50 transition-all flex items-center justify-center gap-2 mt-2 cursor-pointer disabled:opacity-60"
                id="btn-sign-in"
              >
                {isLoading ? (
                  <span>Memvalidasi Autentikasi...</span>
                ) : (
                  <span>Sign In Database</span>
                )}
              </button>

              {/* Quick Demo Login Option */}
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center">
                  Akses Cepat (Role Demo)
                </p>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('petugas')}
                  className="w-full py-2 px-3 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold border border-slate-200 transition flex items-center justify-center gap-2 cursor-pointer"
                  id="btn-quick-login-petugas"
                >
                  <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                  <span>Masuk: <strong>Rudik Setiyawan</strong> (Petugas HK)</span>
                </button>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickLogin('supervisor')}
                    className="py-1.5 px-2 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl text-[11px] font-medium border border-slate-200 transition text-center cursor-pointer"
                    id="btn-quick-login-spv"
                  >
                    Budi S. (SPV HK)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickLogin('admin')}
                    className="py-1.5 px-2 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl text-[11px] font-medium border border-slate-200 transition text-center cursor-pointer"
                    id="btn-quick-login-admin"
                  >
                    Admin Area TIF
                  </button>
                </div>
              </div>
            </form>
          ) : (
            /* ================= REGISTER FORM ================= */
            <form onSubmit={handleRegisterSubmit} className="space-y-3" id="register-form">
              <div className="text-center space-y-1 pb-1">
                <h2 className="text-base font-bold text-slate-800 tracking-tight">
                  Pendaftaran Akun HK
                </h2>
                <p className="text-xs text-slate-500">
                  Data akun akan disimpan di database internal secara terenkripsi
                </p>
              </div>

              {/* NIK & Full Name */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 mb-1 uppercase tracking-wider">
                    NIK Pegawai *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Misal: 92004588"
                    value={regNik}
                    onChange={(e) => setRegNik(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-rose-600"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 mb-1 uppercase tracking-wider">
                    Nama Lengkap *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Nama Anda"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-rose-600"
                  />
                </div>
              </div>

              {/* Role Selection */}
              <div>
                <label className="block text-[10px] font-bold text-slate-700 mb-1 uppercase tracking-wider">
                  Role / Posisi Kerja *
                </label>
                <select
                  value={regRole}
                  onChange={(e) => setRegRole(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-rose-600 cursor-pointer"
                >
                  <option value="Petugas Housekeeping (HK)">Petugas Housekeeping (HK)</option>
                  <option value="HK Supervisor">HK Supervisor</option>
                  <option value="Telpro Area Manager">Telpro Area Manager / Admin</option>
                  <option value="Quality & Safety Auditor">Quality & Safety Auditor</option>
                </select>
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 mb-1 uppercase tracking-wider">
                    Email Resmi
                  </label>
                  <input
                    type="email"
                    placeholder="nama@telpro.co.id"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-rose-600"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 mb-1 uppercase tracking-wider">
                    No. Handphone / WA
                  </label>
                  <input
                    type="text"
                    placeholder="0812-xxxx-xxxx"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-rose-600"
                  />
                </div>
              </div>

              {/* Password & Confirm Password */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 mb-1 uppercase tracking-wider">
                    Password *
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Min 6 karakter"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-rose-600"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 mb-1 uppercase tracking-wider">
                    Konfirmasi *
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Ulangi password"
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-rose-600"
                  />
                </div>
              </div>

              {/* Submit Register Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white rounded-xl font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-rose-600/30 transition-all flex items-center justify-center gap-2 mt-2 cursor-pointer disabled:opacity-60"
              >
                {isLoading ? <span>Menyimpan ke Database...</span> : <span>Daftarkan Akun Baru</span>}
              </button>
            </form>
          )}
        </div>

        {/* Footer info */}
        <div className="bg-slate-50 px-6 py-2.5 border-t border-slate-100 text-center text-[10px] text-slate-400 font-mono">
          Telkom Property • Sistem Real-time Database & Autentikasi v2.5
        </div>
      </div>
    </div>
  );
};
