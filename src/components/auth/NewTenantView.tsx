import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';

interface NewTenantViewProps {
  onBackToLogin: () => void;
}

const inputClass = "w-full px-4 py-3 bg-[#F7FBFF] border-[1.5px] border-[#D0E4F7] rounded-xl text-[#1A2E4A] placeholder-[#B0C8E0] text-sm focus:outline-none focus:border-[#1A5FA8] focus:bg-white focus:ring-2 focus:ring-[#1A5FA8]/10 transition-all";

export function NewTenantView({ onBackToLogin }: NewTenantViewProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleCheckEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { data: user, error: fetchError } = await supabase
        .from('users')
        .select('id, status_akun')
        .eq('email', email)
        .single();
      if (fetchError || !user) throw new Error('Email tidak terdaftar.');
      if (user.status_akun !== 'belum_aktif') throw new Error('Akun sudah aktif. Silakan login langsung.');
      setStep(2);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleActivateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Password dan konfirmasi password tidak cocok.');
      return;
    }
    if (password.length < 8) {
      setError('Password minimal 8 karakter.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { error: authError } = await supabase.auth.signUp({ email, password });
      if (authError) throw authError;
      const { error: updateError } = await supabase
        .from('users')
        .update({ status_akun: 'aktif', is_profile_complete: false })
        .eq('email', email);
      if (updateError) throw updateError;
      setSuccess(true);
      setTimeout(() => (window.location.href = '/dashboard'), 1500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-[#0D2F5C] mb-1">
        {step === 1 ? 'Verifikasi Email' : 'Buat Password'}
      </h2>
      <p className="text-sm text-[#7A93B5] mb-6">
        {step === 1
          ? 'Masukkan email yang sudah didaftarkan admin kost'
          : 'Buat password baru untuk akunmu'}
      </p>

      {/* Step indicator */}
      {!success && (
        <div className="flex items-center gap-2 mb-6">
          <div className={`h-1.5 flex-1 rounded-full transition-all ${step >= 1 ? 'bg-[#1A5FA8]' : 'bg-[#E3EEF9]'}`} />
          <div className={`h-1.5 flex-1 rounded-full transition-all ${step >= 2 ? 'bg-[#1A5FA8]' : 'bg-[#E3EEF9]'}`} />
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex gap-2.5 bg-red-50 border-[1.5px] border-red-200 rounded-xl p-3.5 mb-4">
          <svg className="flex-shrink-0 mt-0.5" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="7" stroke="#EF4444" strokeWidth="1.5" />
            <path d="M8 5V8" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="8" cy="11" r="0.8" fill="#EF4444" />
          </svg>
          <p className="text-xs text-red-600 leading-relaxed">{error}</p>
        </div>
      )}

      {/* Success */}
      {success ? (
        <div className="bg-emerald-50 border-[1.5px] border-emerald-200 rounded-2xl p-6 text-center">
          <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M5 12L10 17L19 7" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <p className="font-bold text-emerald-800 text-base">Aktivasi Berhasil!</p>
          <p className="text-xs text-emerald-600 mt-1">Mengarahkan ke dashboard...</p>
        </div>
      ) : (
        <form onSubmit={step === 1 ? handleCheckEmail : handleActivateAccount} className="space-y-4">
          {step === 1 ? (
            <div>
              <label className="block text-[11px] font-semibold text-[#3A5F8A] uppercase tracking-wide mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
                placeholder="Email yang didaftarkan admin"
                required
                autoComplete="email"
              />
            </div>
          ) : (
            <>
              <div>
                <label className="block text-[11px] font-semibold text-[#3A5F8A] uppercase tracking-wide mb-1.5">Password Baru</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={inputClass}
                  placeholder="Min. 8 karakter"
                  required
                  autoComplete="new-password"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[#3A5F8A] uppercase tracking-wide mb-1.5">Konfirmasi Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={inputClass}
                  placeholder="Ulangi password"
                  required
                  autoComplete="new-password"
                />
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3.5 rounded-2xl text-sm font-bold tracking-wide transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] ${
              step === 2
                ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                : 'bg-[#1A5FA8] hover:bg-[#154D8A] text-white'
            }`}
          >
            {loading ? 'Memproses...' : step === 1 ? 'Cek Akun' : 'Aktifkan Akun'}
          </button>
        </form>
      )}

      {!success && (
        <button
          onClick={onBackToLogin}
          className="block w-full text-center text-sm text-[#1A5FA8] font-medium mt-5 cursor-pointer bg-transparent border-0 hover:text-[#154D8A] transition-colors"
        >
          ← Kembali ke Login
        </button>
      )}
    </div>
  );
}
