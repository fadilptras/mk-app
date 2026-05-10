// src/components/auth/NewTenantView.tsx
import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

export default function NewPenghuniView() {
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
      window.location.href = '/auth'; // Redirect ke halaman login
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-xl font-bold mb-4 text-center">
        {step === 1 ? 'Cek Email Penghuni' : 'Buat Password Baru'}
      </h2>

      {error && <div className="bg-red-50 text-red-500 p-3 rounded-lg mb-4 text-sm font-bold">{error}</div>}

      <form onSubmit={step === 1 ? handleNextStep : handleActivation} className="space-y-4">
        {step === 1 ? (
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Masukkan Email Terdaftar</label>
            <input 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-12 px-4 rounded-xl border-2 focus:border-blue-500 outline-none"
              placeholder="contoh@email.com"
              required
            />
          </div>
        ) : (
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Password Baru</label>
            <input 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-12 px-4 rounded-xl border-2 focus:border-blue-500 outline-none mb-4"
              placeholder="••••••••"
              required
            />
            <p className="text-xs text-gray-500">Gunakan minimal 8 karakter dengan kombinasi huruf dan angka.</p>
          </div>
        )}

        <button 
          disabled={loading}
          className="w-full h-12 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:bg-blue-700 transition-all"
        >
          {loading ? 'Processing...' : step === 1 ? 'Lanjut' : 'Aktifkan Akun'}
        </button>
      </form>
    </div>
  );
}