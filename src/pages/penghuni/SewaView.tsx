// src/pages/penghuni/SewaView.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfileCheck } from '../../hooks/useProfileCheck';

export default function SewaView() {
  const navigate = useNavigate();
  const { profileData, loading } = useProfileCheck();

  // Data Dummy untuk UI
  const contractEndDate = "20 Ags 2026"; 
  const currentTagihan = 1500000;
  const jatuhTempo = "20 Mei 2026";

  const isContractComplete = profileData?.is_contract_complete === true;

  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(angka);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#BFDDF0]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#BFDDF0] font-sans text-gray-800 pb-10">
      <div className="max-w-md mx-auto relative min-h-screen bg-[#BFDDF0] shadow-inner">
        
        {/* Header Biru Premium (Selaras dengan WifiView) */}
        <div className="bg-indigo-600 px-5 py-4 flex items-center gap-4 sticky top-0 z-20 shadow-md">
          <button onClick={() => navigate(-1)} className="p-2 bg-white/10 hover:bg-white/20 active:scale-95 transition-all rounded-full text-white">
             <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <h1 className="text-lg font-black text-white tracking-tight">Tagihan Sewa</h1>
        </div>

        <div className="p-5 space-y-6">

          {/* ============================================================== */}
          {/* SECTION STATUS KONTRAK (COMPACT VERSION) */}
          {/* ============================================================== */}
          
          {!isContractComplete ? (
            // PENGHUNI BARU (BELUM ADA KONTRAK)
            <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-[20px] p-4 shadow-lg shadow-orange-200 relative overflow-hidden flex items-center justify-between">
              <div className="absolute right-0 top-0 opacity-10">
                <svg className="w-24 h-24 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 2l5 5h-5V4zM6 20V4h5v7h7v9H6z"/></svg>
              </div>
              <div className="relative z-10 text-white flex-1 pr-4">
                <h2 className="text-sm font-black mb-1">Aktivasi Kontrak Sewa</h2>
                <p className="text-[10px] text-orange-50 font-medium leading-snug">
                  Anda wajib mengisi kontrak sebelum melakukan pembayaran sewa kamar.
                </p>
              </div>
              <button 
                onClick={() => navigate('/kontrak')}
                className="relative z-10 bg-white text-orange-600 text-[10px] font-black px-4 py-2.5 rounded-xl shadow-sm transition-all active:scale-95 whitespace-nowrap"
              >
                BUAT KONTRAK
              </button>
            </div>
          ) : (
            // PENGHUNI LAMA (PERPANJANG)
            <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wide">Masa Aktif Sewa</p>
                  <p className="text-xs font-black text-gray-800">{contractEndDate}</p>
                </div>
              </div>
              <button 
                onClick={() => navigate('/kontrak')}
                className="bg-indigo-50 text-indigo-600 hover:bg-indigo-100 text-[10px] font-black px-3 py-2 rounded-lg transition-all active:scale-95 flex items-center gap-1.5"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" /></svg>
                PERPANJANG
              </button>
            </div>
          )}

          {/* ============================================================== */}
          {/* CARD TAGIHAN BULAN INI (Desain Bersih & Modern) */}
          {/* ============================================================== */}
          
          <div className="bg-white rounded-[24px] p-5 shadow-lg shadow-indigo-100/50 border border-white relative overflow-hidden">
            {/* Ornamen Latar Tipis */}
            <div className="absolute -right-6 -top-6 w-32 h-32 bg-indigo-50/50 rounded-full blur-2xl pointer-events-none"></div>
            
            <div className="flex justify-between items-start mb-5 relative z-10">
              <div>
                <span className="inline-block bg-indigo-100 text-indigo-700 text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider mb-2">
                  Tagihan Bulan Ini
                </span>
                <h3 className="text-gray-500 text-xs font-medium">Sewa Kamar Kost</h3>
              </div>
              <span className="bg-red-50 text-red-600 text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider border border-red-100 shadow-sm">
                Belum Bayar
              </span>
            </div>
            
            <div className="mb-6 relative z-10">
              <p className="text-3xl font-black text-gray-800 tracking-tight">{formatRupiah(currentTagihan)}</p>
              <div className="flex items-center gap-1.5 mt-2 text-gray-500">
                <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                <p className="text-[11px] font-bold">Jatuh Tempo: <span className="text-gray-700">{jatuhTempo}</span></p>
              </div>
            </div>

            {/* Tombol Bayar Sekarang */}
            {isContractComplete ? (
              <button 
                onClick={() => alert("Masuk ke halaman upload struk/detail bayar")}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-black py-3.5 rounded-xl shadow-md shadow-indigo-200 transition-all active:scale-95 uppercase tracking-wide flex items-center justify-center gap-2"
              >
                Bayar Sekarang
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" /></svg>
              </button>
            ) : (
              <div className="w-full bg-gray-100 text-gray-400 text-xs font-bold py-3.5 rounded-xl text-center border border-gray-200">
                Isi Kontrak Untuk Membayar
              </div>
            )}
          </div>

          {/* ============================================================== */}
          {/* RIWAYAT PEMBAYARAN */}
          {/* ============================================================== */}
          
          <div>
            <div className="flex justify-between items-center mb-4 pl-1">
              <h3 className="font-black text-sm text-gray-800 uppercase tracking-tight">Riwayat Transaksi</h3>
            </div>
            <div className="space-y-3">
              {/* Dummy Data List */}
              {[1, 2, 3].map((item) => (
                <div key={item} className="bg-white p-4 rounded-[20px] shadow-sm border border-gray-100 flex justify-between items-center hover:bg-gray-50 transition-colors">
                  <div className="flex gap-3 items-center">
                    <div className="bg-emerald-50 p-2.5 rounded-xl text-emerald-600 border border-emerald-100">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                    </div>
                    <div>
                      <p className="font-bold text-xs text-gray-800">Sewa Bulan April</p>
                      <p className="text-[9px] text-gray-400 font-bold uppercase mt-0.5 tracking-wider">05 Apr 2026</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-xs text-gray-800">Rp 1.500.000</p>
                    <p className="text-[9px] font-black uppercase text-emerald-500 mt-0.5 tracking-wide">Lunas</p>
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