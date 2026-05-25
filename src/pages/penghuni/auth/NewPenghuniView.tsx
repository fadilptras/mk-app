import React, { useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';

export default function NewPenghuniView({ onBack }: any) {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { checkEmailEligibility, registerNewTenant, loading, error } = useAuth();

  const handleNextStep = async (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = await checkEmailEligibility(email);
    if (isValid) setStep(2);
  };

  const handleActivation = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await registerNewTenant(email, password);
    if (success) {
      alert("Aktivasi Berhasil! Silakan login.");
      onBack(); 
    }
  };

  return (
    <div>
      {/* Tombol Back - Posisi Fixed di Pojok Kiri Atas */}
      <button
        type="button"
        onClick={step === 2 ? () => setStep(1) : onBack}
        aria-label="Kembali"
        title="Kembali"
        className="fixed top-6 left-6 z-50 flex items-center justify-center w-10 h-10 bg-white/90 backdrop-blur-md border border-blue-100 rounded-full shadow-md text-blue-600 hover:bg-blue-600 hover:text-white transition-all active:scale-95"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <h2 className="text-xl font-bold text-[#0D2F5C] mb-1">Aktivasi Akun</h2>
      {/* Kalimat dipersingkat agar hemat ruang vertikal */}
      <p className="text-sm text-[#7A93B5] mb-4">Lengkapi langkah berikut untuk aktivasi akun kamu</p>

      {/* Warning box - Padding & margin disesuaikan sedikit agar lebih ringkas */}
      <div className="flex gap-3 bg-[#FFF5EE] border-[1.5px] border-[#F5C4A0] rounded-xl p-3 mb-4">
        <svg className="flex-shrink-0 mt-0.5" width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M9 1L17 16H1L9 1Z" stroke="#C47A30" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M9 7V10" stroke="#C47A30" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="9" cy="13" r="0.8" fill="#C47A30" />
        </svg>
        <p className="text-xs text-[#A05520] leading-relaxed">
          Akun didaftarkan oleh admin. Masukkan email kamu untuk verifikasi dan buat password.
        </p>
      </div>

      {/* Tahapan Steps - Jarak antar step dioptimalkan (space-y-3 & mb-5) */}
      <div className="space-y-3 mb-5">
        {[
          { n: 1, active: step >= 1, title: 'Verifikasi Email', sub: 'Masukkan email terdaftar' },
          { n: 2, active: step >= 2, title: 'Buat Password', sub: 'Buat password login kamu' },
        ].map(({ n, active, title, sub }) => (
          <div key={n} className="flex items-start gap-3.5">
            <div
              className={`w-[30px] h-[30px] rounded-full flex-shrink-0 flex items-center justify-center text-sm font-bold transition-colors duration-300 ${
                active ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-300'
              }`}
            >
              {n}
            </div>
            <div>
              <p className={`text-sm font-semibold ${active ? 'text-[#1A2E4A]' : 'text-blue-300'}`}>{title}</p>
              <p className="text-xs text-[#7A93B5] mt-0.5">{sub}</p>
            </div>
          </div>
        ))}
      </div>

      {error && (
        <div className="bg-red-50 text-red-500 p-3 rounded-xl mb-4 text-sm font-bold border border-red-100">
          ⚠️ {error}
        </div>
      )}

      <form onSubmit={step === 1 ? handleNextStep : handleActivation} className="space-y-4">
        {step === 1 ? (
          <input 
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-12 px-4 rounded-xl border-2 border-blue-50 focus:border-blue-600 focus:bg-white bg-gray-50 outline-none transition-all text-sm font-medium"
            placeholder="Masukkan email kamu"
            required
          />
        ) : (
          <div className="relative">
            <input 
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-12 px-4 pr-12 rounded-xl border-2 border-blue-50 focus:border-blue-600 focus:bg-white bg-gray-50 outline-none transition-all text-sm font-medium"
              placeholder="Minimal 8 karakter"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Sembunyikan Password" : "Lihat Password"}
              title={showPassword ? "Sembunyikan Password" : "Lihat Password"}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors focus:outline-none"
            >
              {showPassword ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0l-3.29-3.29" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
        )}

        <button 
          disabled={loading}
          className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-95 mt-1"
        >
          {loading ? 'Memproses...' : step === 1 ? 'Verifikasi Email' : 'Aktifkan Akun'}
        </button>
      </form>
    </div>
  );
}