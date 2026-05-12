import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Accordion = ({ title, children, icon }: { title: string, children: React.ReactNode, icon: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden mb-3">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-5 flex items-center justify-between focus:outline-none"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-600 group-active:scale-90 transition-transform">
            {icon}
          </div>
          <span className="text-sm font-black text-gray-800 tracking-tight uppercase">{title}</span>
        </div>
        <svg className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg>
      </button>
      <div className={`px-5 pb-6 space-y-4 transition-all duration-300 ${isOpen ? 'block opacity-100' : 'hidden opacity-0'}`}>
        {children}
      </div>
    </div>
  );
};

export default function ListrikView() {
  const navigate = useNavigate();
  const [token] = useState({ nomor: '4521 8890 1123 6674 9081', meteran: '1423 5567 890', tanggal: '12 Mei 2026' });

  return (
    <div className="min-h-screen bg-[#FDFDFD] font-sans text-gray-800 pb-10">
      <div className="max-w-md mx-auto relative min-h-screen bg-[#F8FAFC]">
        <div className="bg-white px-5 py-4 flex items-center gap-4 sticky top-0 z-20 shadow-sm border-b border-gray-50">
          <button onClick={() => navigate('/dashboard')} className="p-2 bg-gray-50 rounded-full">
             <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" /></svg>
          </button>
          <h1 className="text-lg font-black text-gray-800 tracking-tight">Listrik Kamar</h1>
        </div>

        <div className="p-5 space-y-6">
          {/* Card Info Utama */}
          <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-[40px] p-7 text-white shadow-xl shadow-orange-500/20 relative overflow-hidden">
            <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div className="flex justify-between items-start mb-8">
              <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-xl text-[10px] font-black uppercase border border-white/30 tracking-widest">Kamar A-01</div>
              <p className="text-[10px] font-bold text-orange-100 uppercase italic">{token.tanggal}</p>
            </div>
            <p className="text-[10px] font-black uppercase text-orange-100 tracking-widest mb-1 ml-1">ID Pelanggan</p>
            <p className="text-2xl font-black tracking-[0.2em] mb-6">{token.meteran}</p>
            <p className="text-[10px] font-black uppercase text-orange-100 tracking-widest mb-2 ml-1">Token Terakhir</p>
            <div className="bg-white text-orange-600 rounded-2xl py-4 px-4 shadow-inner text-center font-mono font-black text-xl tracking-widest border-2 border-orange-200">
              {token.nomor}
            </div>
          </div>

          <div className="pt-2">
            {/* Dropdown 1: Pembelian */}
            <Accordion 
              title="Panduan Pembelian" 
              icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>}
            >
              <div className="space-y-4 pt-2">
                <p className="text-[11px] font-bold text-gray-500 leading-relaxed uppercase border-l-2 border-amber-400 pl-3">
                  Anda bisa membeli token melalui Mobile Banking, E-Wallet (GoPay/OVO), atau minimarket terdekat.
                </p>
                <div className="space-y-3">
                  <div className="flex gap-4 items-center">
                    <div className="w-6 h-6 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center text-[10px] font-black">1</div>
                    <p className="text-xs font-bold text-gray-600">Pilih menu PLN / Token Listrik.</p>
                  </div>
                  <div className="flex gap-4 items-center">
                    <div className="w-6 h-6 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center text-[10px] font-black">2</div>
                    <p className="text-xs font-bold text-gray-600">Masukkan ID Pelanggan: <span className="text-gray-900 font-black">{token.meteran}</span>.</p>
                  </div>
                  <div className="flex gap-4 items-center">
                    <div className="w-6 h-6 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center text-[10px] font-black">3</div>
                    <p className="text-xs font-bold text-gray-600">Selesaikan pembayaran dan simpan 20 digit angka token.</p>
                  </div>
                </div>
              </div>
            </Accordion>

            {/* Dropdown 2: Pengisian */}
            <Accordion 
              title="Cara Input ke Meteran" 
              icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
            >
              <div className="space-y-4 pt-2 border-l-2 border-indigo-400 pl-3">
                <p className="text-xs font-bold text-gray-600 leading-relaxed italic">
                  Gunakan keypad pada meteran fisik di depan kamar Anda:
                </p>
                <div className="space-y-3">
                  <p className="text-[11px] font-black text-gray-800 uppercase tracking-tighter">1. Masukkan 20 digit angka token secara perlahan.</p>
                  <p className="text-[11px] font-black text-gray-800 uppercase tracking-tighter">2. Tekan tombol 'Enter' (Panah Merah/Hijau di pojok kanan bawah).</p>
                  <div className="bg-indigo-50 p-3 rounded-xl border border-indigo-100">
                    <p className="text-[10px] font-black text-indigo-700 leading-relaxed uppercase">
                      Jika muncul tulisan "ACCEPT" atau "BENAR", maka daya listrik Anda telah berhasil bertambah.
                    </p>
                  </div>
                </div>
              </div>
            </Accordion>
          </div>

        </div>
      </div>
    </div>
  );
}