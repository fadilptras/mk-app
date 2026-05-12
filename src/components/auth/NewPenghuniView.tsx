import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

export default function NewPenghuniView({ onBack }: any) {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
      {/* Tombol Back - Posisi ditinggikan agar lebih pas di pojok atas */}
      <button
        type="button"
        onClick={step === 2 ? () => setStep(1) : onBack}
        className="absolute -top-[210px] sm:-top-[230px] -left-2 z-50 flex items-center justify-center w-10 h-10 bg-white/90 backdrop-blur-md border border-blue-100 rounded-full shadow-md text-blue-600 hover:bg-blue-600 hover:text-white transition-all active:scale-95"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>

      <h2 className="text-xl font-bold text-[#0D2F5C] mb-1">Aktivasi Akun</h2>
      <p className="text-sm text-[#7A93B5] mb-5">Lengkapi langkah berikut untuk mengaktifkan akun penghuni kamu</p>

      {/* Warning box */}
      <div className="flex gap-3 bg-[#FFF5EE] border-[1.5px] border-[#F5C4A0] rounded-xl p-3.5 mb-6">
        <svg className="flex-shrink-0 mt-0.5" width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M9 1L17 16H1L9 1Z" stroke="#C47A30" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M9 7V10" stroke="#C47A30" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="9" cy="13" r="0.8" fill="#C47A30" />
        </svg>
        <p className="text-xs text-[#A05520] leading-relaxed">
          Akun penghuni didaftarkan oleh admin. Masukkan email kamu untuk verifikasi dan buat password.
        </p>
      </div>

      {/* Tahapan Steps */}
      <div className="space-y-4 mb-7">
        {[
          { n: 1, active: step >= 1, title: 'Verifikasi Email', sub: 'Input email yang didaftarkan admin' },
          { n: 2, active: step >= 2, title: 'Buat Password', sub: 'Tentukan password untuk login kamu' },
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
        <div className="bg-red-50 text-red-500 p-3 rounded-xl mb-5 text-sm font-bold border border-red-100">
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
          <input 
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full h-12 px-4 rounded-xl border-2 border-blue-50 focus:border-blue-600 focus:bg-white bg-gray-50 outline-none transition-all text-sm font-medium"
            placeholder="Minimal 8 karakter"
            required
          />
        )}

        <button 
          disabled={loading}
          className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-95 mt-2"
        >
          {loading ? 'Memproses...' : step === 1 ? 'Verifikasi Email' : 'Aktifkan Akun'}
        </button>
      </form>
    </div>
  );
}