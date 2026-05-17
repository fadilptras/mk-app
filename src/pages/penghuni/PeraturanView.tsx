import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RuleSection = ({ title, pasal, icon, children }: { title: string, pasal: string, icon: React.ReactNode, children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="bg-white rounded-[24px] border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden mb-4">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="w-full p-5 flex items-center justify-between focus:outline-none active:bg-gray-50/50 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 bg-indigo-50 rounded-[14px] flex items-center justify-center text-indigo-600 group-active:scale-90 transition-transform shrink-0">
            {icon}
          </div>
          <div className="flex flex-col text-left">
            <span className="text-[9px] font-black text-indigo-500 uppercase tracking-widest mb-0.5">{pasal}</span>
            <span className="text-xs font-black text-gray-900 uppercase tracking-tight">{title}</span>
          </div>
        </div>
        <svg className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div className={`px-5 transition-all duration-300 ${isOpen ? 'max-h-[500px] pb-6 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="space-y-3.5 pt-4 border-t border-gray-50">
          {children}
        </div>
      </div>
    </div>
  );
};

export default function PeraturanView() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FDFDFD] font-sans text-gray-800 pb-16">
      <div className="max-w-md mx-auto relative min-h-screen bg-[#F8FAFC]">
        
        {/* Header Biru Premium */}
        <div className="bg-indigo-600 px-5 py-4 flex items-center gap-4 sticky top-0 z-20 shadow-md">
          <button 
            onClick={() => navigate('/dashboard')} 
            className="p-2 bg-white/10 hover:bg-white/20 active:scale-95 transition-all rounded-full text-white"
          >
             <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
               <path d="M15 19l-7-7 7-7" />
             </svg>
          </button>
          <h1 className="text-lg font-black text-white tracking-tight">Tata Tertib Hunian</h1>
        </div>

        <div className="p-6">
          
          {/* Banner Penjelasan / Notice Area */}
          <div className="bg-indigo-50/80 border border-indigo-100/80 rounded-2xl p-4 shadow-[0_8px_30px_rgba(0,0,0,0.01)] flex gap-3.5 items-start mb-6">
            <div className="p-2.5 bg-indigo-600 text-white rounded-xl shrink-0 flex items-center justify-center shadow-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="space-y-1">
              <h2 className="text-[11px] font-black text-indigo-950 uppercase tracking-wider flex items-center gap-1.5">
                Peraturan Resmi Kosan
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
              </h2>
              <p className="text-[10px] font-bold text-indigo-900/80 leading-normal uppercase">
                Berlaku efektif sejak 01 Januari 2026. Wajib ditaati oleh seluruh penghuni demi keamanan dan kenyamanan bersama.
              </p>
            </div>
          </div>

          <div className="space-y-1">
            {/* Pasal 01 */}
            <RuleSection 
              title="Keamanan & Akses" 
              pasal="Pasal 01"
              icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>}
            >
              <p className="text-[10px] font-bold text-gray-500 leading-relaxed uppercase">
                <span className="text-indigo-600 font-black mr-1">1.1.</span> Gerbang utama akan dikunci secara otomatis pada pukul 23.00 WIB demi keamanan bersama.
              </p>
              <p className="text-[10px] font-bold text-gray-500 leading-relaxed uppercase">
                <span className="text-indigo-600 font-black mr-1">1.2.</span> Penghuni wajib membawa kunci akses pribadi dan tidak diperkenankan meminjamkannya kepada pihak luar.
              </p>
              <p className="text-[10px] font-bold text-gray-500 leading-relaxed uppercase">
                <span className="text-indigo-600 font-black mr-1">1.3.</span> Tamu kunjungan wajib melapor kepada pengelola dan batas waktu kunjungan maksimal pukul 22.00 WIB.
              </p>
            </RuleSection>

            {/* Pasal 02 */}
            <RuleSection 
              title="Fasilitas & Kebersihan" 
              pasal="Pasal 02"
              icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>}
            >
              <p className="text-[10px] font-bold text-gray-500 leading-relaxed uppercase">
                <span className="text-indigo-600 font-black mr-1">2.1.</span> Penghuni bertanggung jawab penuh atas kebersihan dan kerapihan di dalam unit kamar masing-masing.
              </p>
              <p className="text-[10px] font-bold text-gray-500 leading-relaxed uppercase">
                <span className="text-indigo-600 font-black mr-1">2.2.</span> Penggunaan fasilitas bersama (dapur, area cuci) harus dibersihkan kembali setelah digunakan.
              </p>
              <p className="text-[10px] font-bold text-gray-500 leading-relaxed uppercase">
                <span className="text-indigo-600 font-black mr-1">2.3.</span> Segala bentuk kerusakan fasilitas permanen akibat kelalaian akan dibebankan kepada penghuni.
              </p>
            </RuleSection>

            {/* Pasal 03 */}
            <RuleSection 
              title="Ketentuan Pembayaran" 
              pasal="Pasal 03"
              icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>}
            >
              <p className="text-[10px] font-bold text-gray-500 leading-relaxed uppercase">
                <span className="text-indigo-600 font-black mr-1">3.1.</span> Pembayaran sewa dilakukan paling lambat tanggal 05 setiap bulannya melalui rekening resmi.
              </p>
              <p className="text-[10px] font-bold text-gray-500 leading-relaxed uppercase">
                <span className="text-indigo-600 font-black mr-1">3.2.</span> Keterlambatan pembayaran akan dikenakan sanksi administratif sesuai dengan durasi keterlambatan.
              </p>
            </RuleSection>

            {/* Pasal 04 */}
            <RuleSection 
              title="Etika & Norma" 
              pasal="Pasal 04"
              icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
            >
              <p className="text-[10px] font-bold text-gray-500 leading-relaxed uppercase">
                <span className="text-indigo-600 font-black mr-1">4.1.</span> Penghuni dilarang membuat kegaduhan atau kebisingan yang mengganggu kenyamanan penghuni lain.
              </p>
              <p className="text-[10px] font-bold text-gray-500 leading-relaxed uppercase">
                <span className="text-indigo-600 font-black mr-1">4.2.</span> Dilarang keras membawa atau menyimpan barang terlarang, senjata tajam, dan zat adiktif.
              </p>
            </RuleSection>
          </div>

          {/* Footer Formal Modern */}
          <div className="mt-8 bg-indigo-900 rounded-[32px] p-6 text-white relative overflow-hidden shadow-lg shadow-indigo-900/20">
            <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-2 translate-y-2">
              <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
            </div>
            <div className="relative z-10">
              <p className="text-[10px] font-black text-indigo-300 uppercase tracking-[0.2em] mb-2">Penafian Legal</p>
              <p className="text-[10px] text-indigo-50/90 leading-relaxed uppercase font-bold">
                Pelanggaran terhadap tata tertib di atas dapat mengakibatkan sanksi berupa teguran lisan, tertulis, hingga pemutusan kontrak sewa secara sepihak oleh pengelola Mutiara Kost.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}