import React from 'react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-1 flex flex-col bg-violet-50 p-6 relative overflow-hidden">
      
      {/* Dekorasi aksen pastel */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-blue-100 rounded-bl-full mix-blend-multiply opacity-40"></div>
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-cyan-100 rounded-tr-full mix-blend-multiply opacity-40"></div>

      {/* Header / Logo Utama */}
      <div className="flex flex-col items-center justify-center mt-12 mb-8 relative z-10">
        
        {/* Logo MK dengan warna Biru Jelas (Blue-600) */}
        <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-400 rounded-2xl flex items-center justify-center mb-5 shadow-lg shadow-blue-200">
          <span className="text-3xl text-white font-black tracking-wider">MK</span>
        </div>
        
        {/* Teks Mutiara Kost dengan gradasi Biru Cerah */}
        <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-500 tracking-wider uppercase drop-shadow-sm text-center">
          Mutiara Kost
        </h1>
        <div className="flex items-center gap-3 mt-3">
          <div className="h-[2px] w-8 bg-gradient-to-r from-transparent to-blue-400 rounded-full"></div>
          <p className="text-blue-500 font-bold text-[10px] uppercase tracking-[0.2em]">Manajemen Modern</p>
          <div className="h-[2px] w-8 bg-gradient-to-l from-transparent to-blue-400 rounded-full"></div>
        </div>
      </div>

      {/* Area Form */}
      <div className="flex-1 w-full z-10 flex flex-col justify-center relative">
        {children}
      </div>
      
    </div>
  );
}