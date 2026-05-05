import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';

interface NewTenantViewProps {
  onBackToLogin: () => void;
}

export function NewTenantView({ onBackToLogin }: NewTenantViewProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // ... (Logic handleCheckEmail dan handleActivateAccount tetap sama persis seperti sebelumnya) ...
  const handleCheckEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError(null);
    try {
      const { data: user, error: fetchError } = await supabase.from('users').select('id, status_akun').eq('email', email).single();
      if (fetchError || !user) throw new Error('Email tidak terdaftar.');
      if (user.status_akun !== 'belum_aktif') throw new Error('Akun sudah aktif.');
      setStep(2);
    } catch (err: any) { setError(err.message); } finally { setLoading(false); }
  };

  const handleActivateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) { setError('Password tidak cocok.'); return; }
    setLoading(true); setError(null);
    try {
      const { error: authError } = await supabase.auth.signUp({ email, password });
      if (authError) throw authError;
      const { error: updateError } = await supabase.from('users').update({ status_akun: 'aktif', is_profile_complete: false }).eq('email', email);
      if (updateError) throw updateError;
      setSuccess(true);
      setTimeout(() => window.location.href = '/dashboard', 1500);
    } catch (err: any) { setError(err.message); } finally { setLoading(false); }
  };

  return (
    <div className="w-full">
      {error && (
        <div className="bg-red-500/20 border border-red-400/50 text-red-100 p-4 rounded-2xl mb-4 text-center text-sm backdrop-blur-sm">
          {error}
        </div>
      )}

      {success ? (
        <div className="bg-emerald-500/20 border border-emerald-400/50 text-emerald-100 p-6 rounded-3xl text-center backdrop-blur-sm shadow-[0_0_30px_rgba(16,185,129,0.2)]">
          <div className="text-4xl mb-2">🎉</div>
          <p className="font-bold text-lg tracking-wide uppercase">Aktivasi Berhasil</p>
          <p className="text-sm mt-1 opacity-80">Mengarahkan ke dashboard...</p>
        </div>
      ) : (
        <form onSubmit={step === 1 ? handleCheckEmail : handleActivateAccount} className="space-y-4">
          
          {step === 1 ? (
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-6 py-4 bg-white/10 border border-white/30 rounded-full text-white placeholder-white/60 focus:bg-white/20 focus:border-white focus:outline-none transition-all"
              placeholder="Masukkan Email Kamu"
              required
            />
          ) : (
            <>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-6 py-4 bg-white/10 border border-white/30 rounded-full text-white placeholder-white/60 focus:bg-white/20 focus:border-white focus:outline-none transition-all"
                placeholder="Buat Password Baru"
                required
              />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-6 py-4 bg-white/10 border border-white/30 rounded-full text-white placeholder-white/60 focus:bg-white/20 focus:border-white focus:outline-none transition-all"
                placeholder="Ulangi Password"
                required
              />
            </>
          )}
          
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-full text-sm font-extrabold tracking-wider uppercase transition-all shadow-[0_4px_20px_rgba(0,0,0,0.2)] ${
              step === 1 
                ? 'bg-[#00D4FF] hover:bg-[#00B8E6] text-[#041533]' 
                : 'bg-emerald-400 hover:bg-emerald-500 text-[#041533]'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {loading ? 'Processing...' : step === 1 ? 'Cek Akun' : 'Aktifkan'}
          </button>
        </form>
      )}

      <div className="mt-8 text-center">
        <button
          onClick={onBackToLogin}
          className="text-sm text-white/60 hover:text-white transition uppercase tracking-widest font-semibold"
        >
          ← Kembali ke Login
        </button>
      </div>
    </div>
  );
}