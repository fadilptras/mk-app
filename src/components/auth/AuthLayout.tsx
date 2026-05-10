import React from 'react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    // Background dengan sentuhan warna pastel tipis
    <div className="flex flex-col min-h-full bg-violet-50 p-6 relative overflow-hidden">
      
      {/* Dekorasi aksen pastel di pojok layar untuk estetika */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-fuchsia-200 rounded-bl-full mix-blend-multiply opacity-40"></div>
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-cyan-200 rounded-tr-full mix-blend-multiply opacity-40"></div>

      {/* Bagian Header / Logo Utama */}
      <div className="flex flex-col items-center justify-center mt-12 mb-8 relative z-10">
        <div className="w-24 h-24 bg-violet-500 rounded-[2rem] rotate-3 flex items-center justify-center mb-6 shadow-[8px_8px_0px_#c084fc] transition-transform hover:rotate-0">
          <span className="text-4xl text-white font-black italic">MK</span>
        </div>
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">Mutiara Kost</h1>
        <p className="text-slate-500 font-bold mt-1">Manajemen Kost Modern</p>
      </div>

      {/* Area Tengah Tempat Form Berada (Login/Forgot/Register) */}
      <div className="flex-1 w-full z-10 flex flex-col justify-center">
        {children}
      </div>
      
    </div>
  );
}