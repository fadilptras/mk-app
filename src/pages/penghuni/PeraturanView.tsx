import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RuleSection = ({ title, pasal, children }: { title: string, pasal: string, children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="bg-white border-b border-gray-200 overflow-hidden transition-all">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="w-full py-5 flex items-center justify-between focus:outline-none text-left"
      >
        <div className="flex flex-col">
          <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] mb-1">{pasal}</span>
          <span className="text-sm font-bold text-slate-800 uppercase tracking-tight">{title}</span>
        </div>
        <div className={`p-2 rounded-full transition-all duration-300 ${isOpen ? 'bg-indigo-50 rotate-180' : 'bg-gray-50'}`}>
          <svg className={`w-4 h-4 ${isOpen ? 'text-indigo-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
            <path d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-[500px] pb-6' : 'max-h-0'}`}>
        <div className="space-y-3 pl-1 border-l-2 border-indigo-100">
          {children}
        </div>
      </div>
    </div>
  );
};

export default function PeraturanView() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FDFDFD] font-sans text-slate-900 pb-12">
      <div className="max-w-md mx-auto min-h-screen bg-white shadow-sm border-x border-gray-50">
        
        {/* Simple & Formal Header */}
        <div className="bg-white px-5 py-6 flex items-center justify-between sticky top-0 z-20 border-b border-gray-100 backdrop-blur-md bg-white/90">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/dashboard')} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
               <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" /></svg>
            </button>
            <h1 className="text-lg font-black text-slate-800 tracking-tighter uppercase">Tata Tertib Hunian</h1>
          </div>
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
        </div>

        <div className="p-6">
          {/* Official Stamp/Notice Area */}
          <div className="mb-10 text-center border-b-2 border-double border-slate-200 pb-8">
            <h2 className="text-xl font-black text-indigo-950 uppercase tracking-tighter mb-1">Mutiara Kost Harmony</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">Official Management Rules</p>
            <div className="mt-4 inline-block px-4 py-1.5 bg-slate-50 border border-slate-200 rounded-full">
              <p className="text-[9px] font-black text-slate-500 uppercase">Berlaku efektif sejak: 01 Januari 2026</p>
            </div>
          </div>

          <div className="space-y-2">
            {/* Pasal 01 */}
            <RuleSection title="Keamanan & Akses Utama" pasal="Pasal 01">
              <p className="text-xs font-medium text-slate-600 leading-relaxed uppercase italic tracking-tight">
                1.1. Gerbang utama akan dikunci secara otomatis pada pukul 23.00 WIB demi keamanan bersama.
              </p>
              <p className="text-xs font-medium text-slate-600 leading-relaxed uppercase italic tracking-tight">
                1.2. Penghuni wajib membawa kunci akses pribadi dan tidak diperkenankan meminjamkannya kepada pihak luar.
              </p>
              <p className="text-xs font-medium text-slate-600 leading-relaxed uppercase italic tracking-tight">
                1.3. Tamu kunjungan wajib melapor kepada pengelola dan batas waktu kunjungan maksimal pukul 22.00 WIB.
              </p>
            </RuleSection>

            {/* Pasal 02 */}
            <RuleSection title="Fasilitas & Pemeliharaan" pasal="Pasal 02">
              <p className="text-xs font-medium text-slate-600 leading-relaxed uppercase italic tracking-tight">
                2.1. Penghuni bertanggung jawab penuh atas kebersihan dan kerapihan di dalam unit kamar masing-masing.
              </p>
              <p className="text-xs font-medium text-slate-600 leading-relaxed uppercase italic tracking-tight">
                2.2. Penggunaan fasilitas bersama (dapur, area cuci) harus dibersihkan kembali setelah digunakan.
              </p>
              <p className="text-xs font-medium text-slate-600 leading-relaxed uppercase italic tracking-tight">
                2.3. Segala bentuk kerusakan fasilitas permanen akibat kelalaian akan dibebankan kepada penghuni.
              </p>
            </RuleSection>

            {/* Pasal 03 */}
            <RuleSection title="Ketentuan Pembayaran" pasal="Pasal 03">
              <p className="text-xs font-medium text-slate-600 leading-relaxed uppercase italic tracking-tight">
                3.1. Pembayaran sewa dilakukan paling lambat tanggal 05 setiap bulannya melalui rekening resmi.
              </p>
              <p className="text-xs font-medium text-slate-600 leading-relaxed uppercase italic tracking-tight">
                3.2. Keterlambatan pembayaran akan dikenakan sanksi administratif sesuai dengan durasi keterlambatan.
              </p>
            </RuleSection>

            {/* Pasal 04 */}
            <RuleSection title="Etika & Norma Hunian" pasal="Pasal 04">
              <p className="text-xs font-medium text-slate-600 leading-relaxed uppercase italic tracking-tight">
                4.1. Penghuni dilarang membuat kegaduhan atau kebisingan yang mengganggu kenyamanan penghuni lain.
              </p>
              <p className="text-xs font-medium text-slate-600 leading-relaxed uppercase italic tracking-tight">
                4.2. Dilarang keras membawa atau menyimpan barang terlarang, senjata tajam, dan zat adiktif.
              </p>
            </RuleSection>
          </div>

          {/* Footer Formal */}
          <div className="mt-12 bg-slate-900 rounded-3xl p-6 text-white relative overflow-hidden">
            <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-4 translate-y-4">
              <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
            </div>
            <p className="text-[9px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-2">Penafian Legal</p>
            <p className="text-[10px] text-slate-300 leading-relaxed uppercase font-bold">
              Pelanggaran terhadap tata tertib di atas dapat mengakibatkan sanksi berupa teguran lisan, tertulis, hingga pemutusan kontrak sewa secara sepihak oleh pengelola Mutiara Kost.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}