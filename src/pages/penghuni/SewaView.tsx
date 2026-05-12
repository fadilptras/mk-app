// src/pages/penghuni/SewaView.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SewaView() {
  const navigate = useNavigate();
  // State dummy (nanti diganti fetch dari Supabase)
  const [rekening] = useState({ bank: 'BCA', no: '1234567890', nama: 'MUTIARA KOST ADMIN' });

  const handleCopy = () => {
    navigator.clipboard.writeText(rekening.no);
    alert('Nomor rekening berhasil disalin!');
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] font-sans text-gray-800 pb-10">
      <div className="max-w-md mx-auto relative min-h-screen bg-[#F8FAFC]">
        
        {/* Header App Bar */}
        <div className="bg-white px-5 py-4 flex items-center gap-4 sticky top-0 z-20 shadow-sm">
          <button onClick={() => navigate('/dashboard')} className="p-2 bg-gray-50 rounded-full hover:bg-gray-100">
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <h1 className="text-lg font-black text-gray-800">Pembayaran Sewa</h1>
        </div>

        <div className="p-5 space-y-6">
          {/* Card Rekening Bank */}
          <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-[32px] p-6 text-white shadow-lg shadow-indigo-500/30 relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
            <p className="text-[10px] font-black uppercase tracking-widest text-indigo-200 mb-4">Transfer Pembayaran Ke:</p>
            
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 mb-4">
              <p className="text-xs font-bold text-indigo-100 mb-1">Bank {rekening.bank}</p>
              <div className="flex justify-between items-center">
                <p className="text-2xl font-black tracking-widest">{rekening.no}</p>
                <button onClick={handleCopy} className="bg-white/20 p-2 rounded-xl hover:bg-white/30 transition-all">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                </button>
              </div>
              <p className="text-xs font-medium text-indigo-100 mt-2">A.N. {rekening.nama}</p>
            </div>
            
            <div className="bg-amber-400/20 text-amber-100 p-3 rounded-xl border border-amber-400/30 flex gap-3 items-start">
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <p className="text-[10px] font-medium leading-relaxed">Pastikan nominal transfer sesuai dengan tagihan bulanan. Jangan lupa simpan bukti transfer untuk dikirim ke Admin.</p>
            </div>
          </div>

          {/* Riwayat Pembayaran */}
          <div>
            <h3 className="font-black text-sm text-gray-800 mb-3 pl-1 uppercase tracking-tight">Riwayat Pembayaran</h3>
            <div className="space-y-3">
              {/* Dummy Data List */}
              {[1, 2, 3].map((item) => (
                <div key={item} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center">
                  <div className="flex gap-3 items-center">
                    <div className="bg-emerald-100 p-3 rounded-xl text-emerald-600">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <div>
                      <p className="font-bold text-xs text-gray-800">Bulan Mei 2026</p>
                      <p className="text-[10px] text-gray-400 font-medium mt-0.5">05 Mei 2026 • Transfer BCA</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-xs text-gray-800">Rp 1.500.000</p>
                    <p className="text-[9px] font-black uppercase text-emerald-500 mt-0.5">Lunas</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}