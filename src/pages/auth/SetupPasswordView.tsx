import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSetupPassword } from '../../hooks/auth/useSetupPassword';
import { supabase } from '../../lib/supabase';
import AuthLayout from "../../components/auth/AuthLayout";
import toast, { Toaster } from 'react-hot-toast';

export default function SetupPasswordView() {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  const { setupPassword, loading } = useSetupPassword();

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) return toast.error("Password minimal 6 karakter.");
    if (newPassword !== confirmPassword) return toast.error("Konfirmasi password tidak cocok.");

    const result = await setupPassword(newPassword);
    
    // --- PERUBAHAN LOGIKA DI SINI ---
    if (result.success) {
      // 1. Hancurkan sesi login saat ini (logout otomatis)
      await supabase.auth.signOut();
      
      // 2. Beri pesan tambahan ke user (Opsional, karena hook biasanya sudah bawa toast)
      toast.success("Sesi diperbarui. Silakan login ulang.");

      // 3. Arahkan kembali ke halaman Login
      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 2000); // Waktu tunggu sedikit dilamakan agar user sempat membaca pesan sukses
    }
  };

  const handleCancel = async () => {
    await supabase.auth.signOut();
    navigate('/login', { replace: true });
  };

  return (
    <AuthLayout onBack={handleCancel}>
      <div className="w-full">
        <Toaster position="top-center" />
        
        {/* Header Section (Tengah dan Lega) */}
        <div className="w-full text-center mb-6">
            <h2 className="text-[22px] font-extrabold text-[#1E293B] uppercase tracking-widest mb-1.5">Amankan Akun</h2>
            <p className="text-[12px] text-[#475569] font-bold">
                Ganti sandi bawaan admin dengan sandi baru.
            </p>
        </div>

        {/* Warning box */}
        <div className="flex gap-3.5 bg-orange-400/10 backdrop-blur-sm border border-orange-400/30 rounded-2xl p-4 mb-8 shadow-inner items-start">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center flex-shrink-0 text-orange-600 shadow-sm border border-white/50">
                <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
                    <path d="M9 1L17 16H1L9 1Z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
                    <path d="M9 7V10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                    <circle cx="9" cy="13" r="1.5" fill="currentColor" />
                </svg>
            </div>
            <div className="flex-1 mt-0.5">
                <p className="text-[12px] text-[#9A3412] leading-relaxed font-extrabold">
                    Sistem mendeteksi Anda menggunakan sandi default. Silakan atur sandi baru.
                </p>
            </div>
        </div>

        <form onSubmit={handleSetup} className="space-y-5">
          <div className="relative">
            <input 
              type={showPassword1 ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full h-[52px] px-5 pr-12 rounded-2xl border border-white/60 focus:outline-none focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/20 transition-all font-semibold bg-white/50 text-sm text-gray-800 tracking-wider shadow-inner"
              placeholder="Password baru (Min. 6 karakter)"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword1(!showPassword1)}
              className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-cyan-500 transition-colors focus:outline-none"
            >
              {showPassword1 ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0l-3.29-3.29" /></svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
              )}
            </button>
          </div>

          <div className="relative">
            <input 
              type={showPassword2 ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full h-[52px] px-5 pr-12 rounded-2xl border border-white/60 focus:outline-none focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/20 transition-all font-semibold bg-white/50 text-sm text-gray-800 tracking-wider shadow-inner"
              placeholder="Ulangi password baru"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword2(!showPassword2)}
              className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-cyan-500 transition-colors focus:outline-none"
            >
              {showPassword2 ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0l-3.29-3.29" /></svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
              )}
            </button>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className={`w-full h-[52px] mt-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-black rounded-2xl shadow-[0_8px_20px_0_rgba(34,211,238,0.3)] transition-all active:scale-95 text-[13px] uppercase tracking-widest ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
          >
            {loading ? 'Menyimpan...' : 'Simpan Password'}
          </button>
        </form>
      </div>
    </AuthLayout>
  );
}