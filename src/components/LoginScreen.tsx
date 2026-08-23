import React, { useState } from 'react';
import { Lock, User, Eye, EyeOff, Building2, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import { UserProfile } from '../types';

interface LoginScreenProps {
  onLogin: (user: UserProfile) => void;
  defaultUser: UserProfile;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, defaultUser }) => {
  const [username, setUsername] = useState('92001214');
  const [password, setPassword] = useState('••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [infoMessage, setInfoMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setErrorMessage('Username tidak boleh kosong');
      return;
    }
    setIsLoading(true);
    setErrorMessage('');
    setInfoMessage('');
    setTimeout(() => {
      setIsLoading(false);
      onLogin({
        ...defaultUser,
        nik: username.trim(),
        email: `${username.trim()}@telpro.co.id`,
      });
    }, 350);
  };

  const handleQuickLogin = (role: 'petugas' | 'supervisor' | 'admin') => {
    setIsLoading(true);
    setErrorMessage('');
    setInfoMessage('');
    setTimeout(() => {
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
        });
      } else {
        onLogin(defaultUser);
      }
    }, 250);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 sm:p-6 selection:bg-rose-500/20 selection:text-rose-600">
      {/* Mobile-First Shell Card */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200/80 flex flex-col relative" id="my-birawa-login-card">
        {/* Top Red Header with Telkom Property Skyline Branding */}
        <div className="bg-gradient-to-b from-rose-600 to-rose-700 p-8 text-white relative overflow-hidden text-center">
          {/* Subtle Skyline Graphic Silhouette */}
          <div className="absolute inset-0 opacity-15 pointer-events-none flex items-end justify-center">
            <svg viewBox="0 0 500 150" className="w-full h-28 fill-white">
              <path d="M0,150 L0,90 L30,90 L30,60 L50,60 L50,90 L80,90 L80,40 L110,40 L110,90 L140,90 L140,20 L160,20 L160,90 L200,90 L200,50 L230,50 L230,90 L270,90 L270,30 L290,30 L290,10 L300,10 L300,90 L340,90 L340,45 L370,45 L370,90 L410,90 L410,35 L430,35 L430,90 L460,90 L460,70 L480,70 L480,90 L500,90 L500,150 Z" />
            </svg>
          </div>

          <div className="relative z-10 space-y-2">
            {/* Telkom Property Logo Badge */}
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white text-rose-600 shadow-xl shadow-rose-900/30 font-black text-2xl tracking-tighter mx-auto mb-2 border-2 border-rose-100">
              <div className="text-center leading-none">
                <span className="text-xs block font-bold text-slate-500 uppercase tracking-widest -mb-0.5">TELPRO</span>
                <span className="text-xl font-extrabold text-rose-600">HK</span>
              </div>
            </div>

            <h1 className="text-2xl font-black tracking-tight text-white font-sans uppercase">
              My Birawa
            </h1>
            <p className="text-xs text-rose-100 font-medium tracking-wide">
              Telkom Property by Telkom Indonesia
            </p>
            <div className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-white/20 text-[10px] font-mono font-semibold tracking-wider uppercase text-white backdrop-blur-sm">
              Proyek HK TIF Checklist & Excel
            </div>
          </div>
        </div>

        {/* Login Form Body */}
        <div className="p-6 sm:p-8 space-y-5 flex-1 bg-white">
          <div className="text-center space-y-1">
            <h2 className="text-lg font-bold text-slate-800 tracking-tight">
              Sign In ke Akun Anda
            </h2>
            <p className="text-xs text-slate-500">
              Masukkan Username (NIK) & Password untuk memulai checklist HK
            </p>
          </div>

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

          <form onSubmit={handleSubmit} className="space-y-4" id="login-form">
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
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600 transition"
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
                  placeholder="Masukkan password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600 transition"
                  id="input-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition"
                  title={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-xs pt-1">
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
                  setInfoMessage('Untuk reset password akun HK Telkom Property, silakan hubungi Administrator HK TIF atau klik salah satu tombol akun cepat di bawah.');
                }}
                className="text-rose-600 font-semibold hover:underline cursor-pointer"
              >
                Lupa Password?
              </button>
            </div>

            {/* Red Sign In Button (Matching Image) */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 active:from-rose-700 active:to-rose-800 text-white rounded-xl font-extrabold text-sm uppercase tracking-wider shadow-lg shadow-rose-600/30 hover:shadow-rose-600/50 transition-all flex items-center justify-center gap-2 mt-2 cursor-pointer"
              id="btn-sign-in"
            >
              {isLoading ? (
                <span>Memproses Masuk...</span>
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </form>

          {/* Quick Demo Login Option */}
          <div className="pt-3 border-t border-slate-100 space-y-2">
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center">
              Pilihan Akun Demo Cepat
            </p>
            <button
              type="button"
              onClick={() => handleQuickLogin('petugas')}
              className="w-full py-2.5 px-3 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold border border-slate-200 transition flex items-center justify-center gap-2 cursor-pointer"
              id="btn-quick-login-petugas"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
              <span>Masuk sebagai <strong>Rudik Setiyawan</strong> (HK Officer)</span>
            </button>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('supervisor')}
                className="py-2 px-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl text-[11px] font-medium border border-slate-200 transition text-center cursor-pointer"
                id="btn-quick-login-spv"
              >
                Budi S. (Supervisor)
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('admin')}
                className="py-2 px-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl text-[11px] font-medium border border-slate-200 transition text-center cursor-pointer"
                id="btn-quick-login-admin"
              >
                Admin Area TIF
              </button>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 text-center text-[11px] text-slate-400 font-mono">
          Telkom Property • Sistem Checklist HK TIF v2.4
        </div>
      </div>
    </div>
  );
};
