import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
  onBack?: () => void; // Tambahkan prop ini
}

export default function AuthLayout({ children, onBack }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-[#F1F5F9] relative overflow-hidden font-sans">
      
      {/* --- TOMBOL BACK FLOATING (Bebas di Pojok Kiri Atas) --- */}
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="absolute top-10 left-6 z-50 w-11 h-11 bg-white/40 backdrop-blur-xl border border-white/60 rounded-full shadow-[0_4px_10px_0_rgba(31,38,135,0.05)] text-slate-700 hover:bg-white hover:text-blue-600 transition-all active:scale-95 flex items-center justify-center"
          aria-label="Kembali"
          title="Kembali"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
      )}

      {/* --- DEKORASI NEON PASTEL GLOW --- */}
      <div className="absolute top-[-10%] right-[-10%] w-[400px] h-[400px] bg-cyan-400/40 rounded-full mix-blend-multiply filter blur-[100px] pointer-events-none animate-pulse" style={{ animationDuration: '4s' }}></div>
      <div className="absolute bottom-[-10%] left-[-20%] w-[500px] h-[500px] bg-fuchsia-400/30 rounded-full mix-blend-multiply filter blur-[120px] pointer-events-none animate-pulse" style={{ animationDuration: '5s' }}></div>
      <div className="absolute top-[40%] left-[20%] w-[300px] h-[300px] bg-violet-400/30 rounded-full mix-blend-multiply filter blur-[90px] pointer-events-none"></div>

      {/* --- ORNAMEN ISOMETRIK 3D MELAYANG --- */}
      <div className="absolute top-[12%] right-[8%] w-16 h-16 bg-gradient-to-tr from-cyan-400 to-blue-300 rounded-xl opacity-60 [transform:rotateX(60deg)_rotateZ(-45deg)] shadow-[15px_15px_0px_rgba(34,211,238,0.2)]"></div>
      <div className="absolute bottom-[18%] left-[5%] w-24 h-24 bg-gradient-to-tr from-fuchsia-400 to-pink-300 rounded-2xl opacity-50 [transform:rotateX(60deg)_rotateZ(-45deg)] shadow-[20px_20px_0px_rgba(232,121,249,0.2)]"></div>

      {/* --- KONTEN UTAMA --- */}
      <div className="w-full flex-1 flex flex-col px-6 pt-20 pb-8 relative z-10 justify-center">
        
        {/* Header / Logo dengan efek Glassmorphism */}
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="w-20 h-20 bg-white/40 backdrop-blur-xl border border-white/50 rounded-2xl flex items-center justify-center mb-5 shadow-[0_8px_32px_0_rgba(31,38,135,0.1)] relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl opacity-90 group-hover:opacity-100 transition-opacity"></div>
            <span className="text-3xl text-white font-black tracking-wider drop-shadow-md relative z-10">MK</span>
          </div>
          
          <h1 className="text-[28px] font-black text-[#0F172A] tracking-widest uppercase drop-shadow-sm text-center">
            Mutiara Kost
          </h1>
          
          <div className="flex items-center gap-3 mt-2">
            <div className="h-[2px] w-8 bg-gradient-to-r from-transparent to-blue-500 rounded-full"></div>
            <p className="text-blue-600 font-bold text-[10px] uppercase tracking-[0.25em]">Management System</p>
            <div className="h-[2px] w-8 bg-gradient-to-l from-transparent to-blue-500 rounded-full"></div>
          </div>
        </div>

        {/* Area Form - Dibungkus dengan Glassmorphism Card */}
        <div className="w-full relative z-10 bg-white/60 backdrop-blur-2xl border border-white/60 p-7 rounded-[32px] shadow-[0_12px_40px_0_rgba(31,38,135,0.07)]">
          {children}
        </div>

      </div>
    </div>
  );
}