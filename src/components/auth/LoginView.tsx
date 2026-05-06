import { useState } from 'react';

const inputClass = "w-full px-4 py-2.5 sm:py-3 bg-[#F7FBFF] border-[1.5px] border-[#D0E4F7] rounded-xl text-[#1A2E4A] placeholder-[#B0C8E0] text-sm focus:outline-none focus:border-[#1A5FA8] focus:bg-white focus:ring-2 focus:ring-[#1A5FA8]/10 transition-all";

export default function LoginView({ onLogin, onForgot, onNewTenant }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div>
      <h2 className="text-lg sm:text-xl font-bold text-[#0D2F5C] mb-0.5">Selamat datang kembali</h2>
      <p className="text-xs sm:text-sm text-[#7A93B5] mb-4 sm:mb-6">Masuk ke akunmu untuk melanjutkan</p>

      <div className="space-y-3 sm:space-y-4">
        <div>
          <label className="block text-[11px] font-semibold text-[#3A5F8A] uppercase tracking-wide mb-1.5">Email</label>
          <input
            type="email"
            placeholder="contoh@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
            autoComplete="email"
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-[#3A5F8A] uppercase tracking-wide mb-1.5">Password</label>
          <input
            type="password"
            placeholder="Masukkan password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
            autoComplete="current-password"
          />
        </div>

        <div className="flex justify-end">
          <button
            onClick={onForgot}
            className="text-xs font-semibold text-[#1A5FA8] hover:text-[#154D8A] transition-colors bg-transparent border-0 cursor-pointer p-0"
          >
            Lupa password?
          </button>
        </div>

        <button
          onClick={() => onLogin(email, password)}
          className="w-full bg-[#1A5FA8] hover:bg-[#154D8A] active:scale-[0.98] text-white py-3 sm:py-3.5 rounded-2xl text-sm font-bold tracking-wide transition-all"
        >
          Masuk
        </button>

        <div className="flex items-center gap-3 py-0.5">
          <div className="h-px flex-1 bg-[#E3EEF9]" />
          <span className="text-xs text-[#B0C8E0]">atau</span>
          <div className="h-px flex-1 bg-[#E3EEF9]" />
        </div>

        <button
          onClick={onNewTenant}
          className="w-full border-[1.5px] border-[#1A5FA8] text-[#1A5FA8] hover:bg-[#F0F7FF] active:scale-[0.98] py-3 sm:py-3.5 rounded-2xl text-sm font-semibold transition-all"
        >
          Saya penghuni baru
        </button>
      </div>

      <p className="text-center text-xs text-[#B0C8E0] mt-4 sm:mt-5">
        Butuh bantuan?{' '}
        <a href="https://wa.me/628XXXXXXXXX" target="_blank" rel="noopener noreferrer" className="text-[#1A5FA8] font-medium">
          Hubungi admin kost
        </a>
      </p>
    </div>
  );
}